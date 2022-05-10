import logging
from enum import Enum, auto
from typing import Optional, List

__version__ = "0.0.1"

tab = "\t"
comment = "#"

def isEmpty(v):
   return not v

class TokenType(Enum):
   Char = auto()
   Var = auto()

class ItemType(Enum):
   Axiom = auto()
   # Definition = auto()
   Map = auto()
   Operator = auto()
   Option = auto()
   Theorem = auto()
   Type = auto()

   def __str__(self):
      n = self._name_.lower()
      if n in ("axiom", "operator", "theorem", "type"):
         return n[:2]
      else:
         return n[:3]

def toItemType(s: str) -> ItemType:
   if s.startswith("ax"):
      return ItemType.Axiom
   elif s == "map":
      return ItemType.Map
   elif s == "op":
      return ItemType.Operator
   elif s == "opt":
      return ItemType.Option
   elif s.startswith("th"):
      return ItemType.Theorem
   elif s.startswith("ty"):
      return ItemType.Type
   else:
      raise ValueError(f"{s.__repr__()} is not a valid item type")

class Token:
   def __init__(self, typ: TokenType, val: str):
      self.type = typ
      self.value = val

class Expr:
   def __init__(self, tokens: List[Token]):
      self.tokens = tokens

class Item:
   def __init__(self, id_: str, typ: ItemType, initdata: dict):
      """
      initdata: See the source code of "Parser.parseFirstLineOfItem"
      """
      self.id = id_
      self.type = typ
      self.data = initdata
      self.initialized = False

   def __str__(self):
      return f"<{self.type} {self.id}>"

   def __hash__(self):
      return hash(self.id)

   def __eq__(self, other):
      return self.id == other.id

class Parser:
   def __init__(self):
      self.processedLines: List[str] = []
      self.itemStrSoFar = ""
      self.state = None
      self.items = {}
      self.options = {}
      self.currentItem: Optional[Item] = None

      self._warned_for_indentation = False

   def process(self, line: str):
      """
      Parses a line

      Example indentation requirements:
         # Some comment
         item something: # Now parsing an item
            a
            b
            c
            # This line should be indented
            # If the item isn't finished keep indenting
         # Now the item is complete
      """
      line = line.rstrip()
      self.processedLines.append(line)
      if line.startswith(comment) or isEmpty(line):
         return

      indent = 0
      while line.startswith(tab):
         indent += 1
         line = line[1:]

      # indent None
      # 0indent, item
      if indent and self.currentItem is None:
         logging.error(f"Unexpected indentation:\n{line}")
         raise IndentationError("Expected item got indented line")
      elif not indent and self.currentItem is not None:
         if self._warned_for_indentation:
            logging.debug(f"No indentation: {line}")
         elif self.currentItem.type == ItemType.Type:
            self.currentItem = None
         else:
            self._warned_for_indentation = True
            logging.warning(f"No indentation: {line}")

      if self.currentItem is None:
         self.itemStrSoFar = line
         self.processFirstLineOfItem(line)
      else:
         self.itemStrSoFar += "\n" + line
         self.processContinueLineOfItem(line)

   def processFirstLineOfItem(self, line: str):
      tokens = line.split(" ")
      typ = None
      try:
         typ = toItemType(tokens[0])
      except ValueError as error:
         logging.error(f"Error info\nLine: {line}\nItem so far: {self.itemStrSoFar[-100:]}")
         raise error

      id_ = tokens[1]
      if id_.endswith(":"):
         id_ = id_[:-1]

      data = {}
      after_colon = " ".join(tokens[2:])

      # Rust li pona Python li ike
      # The code you want to look at for "initdata"
      if typ == ItemType.Axiom:
         data["assertion"] = after_colon
         data["hyp"] = {}
      elif typ == ItemType.Theorem:
         data["assertion"] = after_colon
         data["hyp"] = {}
         data["proof"] = {}
      elif typ == ItemType.Operator:
         data["example"] = after_colon
      elif typ == ItemType.Option:
         data["value"] = after_colon
      elif typ == ItemType.Map:
         data["expressions"] = after_colon.split("⇔")
      elif typ == ItemType.Type:
         data["alternatives"] = set()
      else:
         raise AssertionError(f"Did I miss an enum type? {typ}")

      if typ == ItemType.Option:
         self.options[id_] = data
      else:
         self.currentItem = Item(id_, typ, data)

   def processContinueLineOfItem(self, line: str):
      tokens = line.split("\t")
      item = self.currentItem
      typ = self.currentItem.type
      if typ == ItemType.Axiom or typ == ItemType.Theorem:
         first, *rest = tokens

         if first == "hyp":
            tokens.remove(first)
            if self.state is not None:
               self.synErr("Unexpected hyp", line)
            self.state = "hyp"
         elif first == "":
            if self.state is None and typ == ItemType.Theorem:
               self.synErr("Is this hyp or proof?", line)
            tokens.remove(first)
            self.state = "hyp"
         elif first == "proof":
            if typ == ItemType.Axiom:
               self.synErr("Axioms don't have proofs", line)
            if state.state not in (None, "hyp"):
               self.synErr("Unexpected proof", line)
            self.state = "proof"
            tokens.remove(first)

         id_, hyps, ref, expr = rest
         if self.state == "hyp":
            i = "h" + id_
            if i in item.data["hyp"]:
               self.synErr("Duplicate ids", line)
            else:
               item.data["hyp"][i] = self.parseExpr(expr)
         elif self.state == "proof":
            hyps = ",".split(hyps)
            raise NotImplementedError()
         else:
            raise AssertionError(f"state? {self.state}")
      elif typ == ItemType.Operator:
         raise NotImplementedError()
      elif typ == ItemType.Map:
         raise NotImplementedError()
      elif typ == ItemType.Type:
         l = line.strip()
         if l in item.data["alternatives"]:
            self.err(ValueError, "Duplicate IDs", line)
         else:
            item.data["alternatives"].add(l)
      else:
         assert typ != ItemType.Option # Options change option but not currentItem, so nothing happens
         raise AssertionError(f"Did I miss an enum type? {typ}")

   def synErr(self, message: str, line: str):
      self.err(SyntaxError, message, line)

   def err(self, ErrorCls: BaseException, message: str, line: str):
      logging.error(f"Error info\nLine:\n{line}\nItem so far:\n{self.itemStrSoFar[-100:]}")
      raise ErrorCls(f"{message}\n{line}\n{self.currentItem}")

   def parseExpr(expr: str) -> Expr:
      raise NotImplementedError()


# Global vars
parser: Optional[Parser] = None


def runCommands():
   """
   Returns `true` to indicate exiting early.
   Runs any cli args - run "--help" for details
   """
   import sys
   import argparse
   global parser

   p = argparse.ArgumentParser(
      # description="",
      epilog="To read the documentation, run python's `help` builtin.")
   p.add_argument("FILE", help="file to run")
   p.add_argument("--log", help="set the log level")
   p.add_argument("--no-run", action="store_true", help="don't run the interpreter after checking the file")
   p.add_argument("--version", "-v", action="version", version="%{prog}s " + __version__)
   args = p.parse_args()

   log_level = args.log.upper()
   if log_level is not None:
      numeric_level = getattr(logging, log_level, None)
      if not isinstance(numeric_level, int):
         raise ValueError('Invalid log level: %s' % loglevel)
      logging.basicConfig(level=numeric_level)

   filename = args.FILE
   if filename:
      with open(filename) as f:
         for line in f.readlines():
            parser.process(line)

   return args.no_run

def main():
   print(f"prover.py v{__version__}")
   global parser
   parser = Parser()
   if runCommands():
      return
   cli()


if __name__ == "__main__":
   main()
