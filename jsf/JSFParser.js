/// JSF is a variant of JS where only 6 characters are used: []()+!
///
/// For example, "hi" === ...uhhhh I don't know how to do this one...
///
/// Let's do an even simpler example:
/// "i" === ("falseundefined")["10"]
///     === ([false]+undefined)[1+[0]]
///     === ([![]]+[][[]])[+!![]+[+[]]]

const assert = console.assert

class ParseNode {
  /// text is a container like a tree
  /// node is a non-terminal
  constructor (text, name) {
    this.text = text
    this.name = name
  }

  toString() {
    let nesting = 0
    let result = `{${this.name.name}`

    if (typeof this.text === "string") {
      result += ` ${this.text}`
    } else {
      result += "\n "
      result += `${this.text.join`\n`}`.replaceAll("\n", "\n ")
    }

    return result
  }
}

/// In terms of grammars of programming languages
class Production {
  constructor (name, alternatives=[]) {
    this.name = name
    this.alternatives = alternatives
  }

  // Example alternative: [AdditiveExpression, "+", UnaryExpression]
  addProduction (...alternative) {
    this.alternatives.push(alternative)
  }

  /**
   * The callstack is the set of parent nodes
   * The infinite loop checker prevents node.parse if node is in the set
   * and parsetext === ""
   */
  parse (text, callstack = []) {
    let besttree = ["", []]

    Alternative:
    for (const alternative of this.alternatives) {
      let parsedtext = ""
      let textleft = text
      const tree = []

      // Lets say alternative === [AdditiveExpression, "+", UnaryExpression]
      // And text === "[]+[]", besttree === ["[]", ParseNode{...}]
      for (const node of alternative) {
        if (node instanceof Production) {
          if (parsedtext === "") {
            assert(textleft === text)

            // Prevent infinite loop
            if (callstack.includes(node)) {
              continue Alternative
            }

            callstack.push(this)
          }

          const [endtext, subtree] = parsedtext === ""
            ? node.parse(textleft, callstack)
            : node.parse(textleft)

          if (parsedtext === "") {
            callstack.pop()
          }

          if (endtext.length === 0) {
            continue Alternative
          } else {
            parsedtext += endtext
            textleft = textleft.slice(endtext.length)
            tree.push(new ParseNode(subtree, node))
          }
        } else if (textleft.startsWith(node)) {
          parsedtext += node
          textleft = textleft.slice(node.length)
          tree.push(node)
        } else {
          continue Alternative
        }
      }

      if (textleft === "") {
        assert(parsedtext === text)
        return [parsedtext, tree]
      } else if (parsedtext.length > besttree[0].length) {
        besttree = [parsedtext, tree]
      }
    }

    return besttree
  }
}

/// The root production for the "simplified" jsf language
/// The simplified jsf grammar is at: https://github.com/icecream17/Stuff/blob/master/jsf/SimplifiedGrammar.txt
/// Because the tree is so big, the stack traces are also ridiculous
const AdditiveExpression = new Production("AdditiveExpression")

const Arguments = new Production("Arguments")
Arguments.addProduction("()")
Arguments.addProduction("(", AdditiveExpression, ")")

const ArrayLiteral = new Production("ArrayLiteral")
ArrayLiteral.addProduction("[]")
ArrayLiteral.addProduction("[", AdditiveExpression, "]")

const PrimaryExpression = new Production("PrimaryExpression")
PrimaryExpression.addProduction(ArrayLiteral)
PrimaryExpression.addProduction("(", AdditiveExpression, ")")

const MemberExpression = new Production("MemberExpression")
MemberExpression.addProduction(PrimaryExpression)
MemberExpression.addProduction(MemberExpression, "[", AdditiveExpression, "]")

const CallExpression = new Production("CallExpression")
CallExpression.addProduction(MemberExpression, Arguments)
CallExpression.addProduction(CallExpression, Arguments)
CallExpression.addProduction(CallExpression, "[", AdditiveExpression, "]")

const MemberOrCallExpression = new Production("MemberOrCallExpression")
MemberOrCallExpression.addProduction(MemberExpression)
MemberOrCallExpression.addProduction(CallExpression)

const UpdateExpression = new Production("UpdateExpression")
UpdateExpression.addProduction(MemberOrCallExpression)
UpdateExpression.addProduction(MemberOrCallExpression, "++")
UpdateExpression.addProduction("++", MemberOrCallExpression)

const UnaryExpression = new Production("UnaryExpression")
UnaryExpression.addProduction(UpdateExpression)
UnaryExpression.addProduction("+", UnaryExpression)
UnaryExpression.addProduction("!", UnaryExpression)

AdditiveExpression.addProduction(UnaryExpression)
AdditiveExpression.addProduction(UnaryExpression, "+", AdditiveExpression) // Subtle modification

const parse = AdditiveExpression.parse.bind(AdditiveExpression)

const logparse = code => {
  const result = parse(code)
  console.log(result)
  console.log(String(result[1].join?.("\n") ?? result[1]))
}

/// Sample parses
logparse("[]")
logparse("[]+[]")
logparse("[[]+[]+[]]")
logparse("([![]]+[][[]])[+!![]+[+[]]]")

// This parser is so slow it can't even parse a single line of code
// logparse("+(+!![]+(!![]+[])[!![]+!![]+!![]]+(+!![]+[+[]+[+[]+[+[]]]]))")
