
class MappingLevel extends null {
   static instanceSet = new WeakSet()

   // @param {object} map
   constructor (map) {
      const newlevel = Object.assign(Object.create(null), map)
      MappingLevel.instanceSet.add(newlevel)
      return newlevel
   }
   
   [Symbol.hasInstance](value) {
      return MappingLevel.instanceSet.has(value)
   }
}

const SETTINGS = {
   EvalAllowed: false
}

// Mappings in order of precedence
const MAPPINGS = []

// Fallthroughs are intentional.
// Always returns something
// Each precedence level maps /expression result/ to /expression text/
MAPPINGS[0] = (key) => {
   switch (key) {
      case 'false':
         return '![]'
      case 'true':
         return '!_false_'
      case '""':
      case "''":
      case '``':
         return '[]+[]'
      case '0':
         return '+[]'
      case '1':
         return '+_true_'
      case '2':
         return '_true_+_true_'
      case '3':
         return '_true_+_true_+_true_'
      case '4':
         return '_2_+_2_'
      case '5':
         return '_2_+_3_'
      case '6':
         return '_2_+_4_'
      case '7':
         return '_2_+_5_'
      case '8':
         return '_2_+_6_'
      case '9':
         return '_2_+_7_'
      default:
         return undefined
   }
}

function mappingLevelHasKey (level, key) {
   return level(key) !== undefined
}

function mapKeyResultToJSF (result) {
   return result.replaceAll(/_([^_]|\\_)*_/g, match => mapKeyToJSF(match.slice(1, -1)))
}

function mapKeyToJSF (key) {
   for (let i = 0; i < MAPPINGS.length; i++) {
      if (mappingLevelHasKey(level, key)) {
         return mapKeyResultToJSF(MAPPINGS[i](key))
      }
   }
}

// O(n*(n+ParseText))
// The `loose` param is for when a match is not expected to complete
// So like 3.5, a match of "3" is ok.
function ParseTextWithAlternative (text, grammar, alternative, loose) {
   let possMatches = [[text]]
   possMatches[0].done = false

   // Checks if the text nodes could possibly match before deeper searching
   {
      let textIndex = 0
      for (let i = 0; i < alternative.length; i++) {
         if (typeof alternative[i] === "string") {
            let nodeIndex = text.indexOf(alternative[i], textIndex)
            if (nodeIndex === -1) {
               return null
            }
            // If the start node is a string but doesn't match the start
            if (nodeIndex !== 0 && i === 0) {
               return null
            }

            textIndex = nodeIndex + alternative[i].length
         }
      }
      
      // Or if the last node is a string but doesn't reach the end...
      // just read the conditional
      const lastAlternative = alternative[alternative.length - 1]
      if (typeof lastAlternative === "string" &&
          text.lastIndexOf(lastAlternative) + lastAlternative.length !== text.length &&
          loose === false)
      {
         return null
      }
   }

   for (let i = 0; i < alternative.length; i++) {
      if (possMatches.length === 0) {
         return null
      }
      
      const part = alternative[i]
      if (typeof part === "string") {
         let done = false
         possMatches = possMatches.filter(
            match => match.done === false &&
                     match[match.length - 1].slice(0, part.length) === part
         ).map(
            match => {
               const matchedText = [
                  match[match.length - 1].slice(0, part.length),
                  match[match.length - 1].slice(part.length)
               ]
               
               matchedText[0].parseNode = part
               
               const result = match.slice(0, -1).concat(matchedText)
               if (result[result.length - 1] === '') {
                  result.pop()
                  done = true
               }
               
               return result
            }
         ).filter(match => match.length)
         
         if (done) {
            possMatches.done = true
            if (i === alternative.length - 1) {
               break
            }
         }
      } else if (typeof part === "symbol") {
         for (let j = 0; j < possMatches.length; j++) {
            const possMatch = possMatches[j]
            
            const remainingText = possMatches[j].pop()
            const parseNode = ParseText(remainingText, grammar, part.description, true)

            if (parseNode === null) {
               possMatches.splice(j, 1)
               j--
            } else {
               possMatch.push(parseNode)
               if (parseNode.done) {
                  possMatch.done = true
                  
                  // Ugh, you know what?
                  // found a match
                  // Too much nesting bad
                  if (i === alternative.length - 1) {
                     break
                  }
               }
            }
         }
      }
   }

   // possMatches = possMatches.filter(match => match.done)

   if (possMatches.length === 0) {
      return null
   } else if (possMatches.length === 1) {
      if (possMatches.done === true) {
         possMatches[0].done = true
      } else {
         possMatches.done ??= possMatches[0].true
      }
      return possMatches[0]
   } else {
      console.error("Ambiguous grammar!!!", possMatches, text, grammar, alternative)
      throw possMatches
   }
}

// O(n*(ParseTextWithAlternative))
function ParseText (text, grammar, productionName, loose=true) {
   const passs = []
   const fails = []
   for (const alternative of grammar[productionName]) {
       let temp = ParseTextWithAlternative(text, grammar, alternative, loose)
       if (temp !== null) {
          temp.parseNode = grammar[productionName]
          temp.alternative = alternative

          if (temp.done) {
             passs.push(temp)
          } else {
             fails.push(temp)
          }
       }
   }

   if (passs.length === 1) {
      return passs[0]
   } else if (passs.length > 1) {
      throw ["AAA ambiguous grammar", passs, fails]
   } else if (fails.length === 1 && loose) {
      return fails[0]
   } else if (fails.length > 1) {
      throw ["Incompletion???", fails]
   }
   return null
}

function parseNumeric (numericString) {
   // sep Parameter optimized away
   // I have for some reason decided to store the grammar as follows:
   // grammar:
   //   production:
   //     alternative:
   //       part
   // Which is accurate but makes for really complicated code
   // There's definitely a better way
   
   // string something something string
   // check whether the rest of it matches, so
   // string something something string:
       // something something string
   // really slow
   const NumericGrammar = {
      // Added my own grammar node since prefix minus or pluses are probably in some other place
      _Numeric: [
         [Symbol('NumericLiteral')],
         ['+', Symbol('NumericLiteral')],
         ['-', Symbol('NumericLiteral')]],
      NumericLiteralSeparator: [
         ['_']],
      NumericLiteral: [
         [Symbol('DecimalLiteral')],
         [Symbol('DecimalBigIntegerLiteral')],
         [Symbol('NonDecimalIntegerLiteral')],
         [Symbol('NonDecimalIntegerLiteral'), Symbol('BigIntLiteralSuffix')]],
      DecimalBigIntegerLiteral: [ // Changed
         [Symbol('DecimalIntegerLiteral'), Symbol('BigIntLiteralSuffix')]],
      NonDecimalIntegerLiteral: [
         [Symbol('BinaryIntegerLiteral')],
         [Symbol('OctalIntegerLiteral')],
         [Symbol('HexIntegerLiteral')]],
      BigIntLiteralSuffix: [
         ['n']],
      DecimalLiteral: [
         [Symbol('DecimalIntegerLiteral'), '.'],
         [Symbol('DecimalIntegerLiteral'), '.', Symbol('DecimalDigits')],
         [Symbol('DecimalIntegerLiteral'), '.', Symbol('ExponentPart')],
         [Symbol('DecimalIntegerLiteral'), '.', Symbol('DecimalDigits'), Symbol('ExponentPart')],
         ['.', Symbol('DecimalDigits')],
         ['.', Symbol('DecimalDigits'), Symbol('ExponentPart')],
         [Symbol('DecimalIntegerLiteral')],
         [Symbol('DecimalIntegerLiteral'), Symbol('ExponentPart')]],
      DecimalIntegerLiteral: [
         ['0'],
         [Symbol('NonZeroDigit')],
         [Symbol('NonZeroDigit'), Symbol('DecimalDigits')],
         [Symbol('NonZeroDigit'), Symbol('NumericLiteralSeparator'), Symbol('DecimalDigits')]],
      DecimalDigits: [
         [Symbol('DecimalDigit')],
         [Symbol('DecimalDigit'), Symbol('DecimalDigits')],
         [Symbol('DecimalDigit'), Symbol('NumericLiteralSeparator'), Symbol('DecimalDigits')]],
      DecimalDigit: [
         ['0'], ['1'], ['2'], ['3'], ['4'], ['5'], ['6'], ['7'], ['8'], ['9']],
      NonZeroDigit: [
         ['1'], ['2'], ['3'], ['4'], ['5'], ['6'], ['7'], ['8'], ['9']],
      ExponentPart: [
         [Symbol('ExponentIndicator'), Symbol('SignedInteger')]],
      ExponentIndicator: [
         ['e'], ['E']],
      SignedInteger: [
         [Symbol('DecimalDigits')],
         ['+', Symbol('DecimalDigits')],
         ['-', Symbol('DecimalDigits')]],
      BinaryIntegerLiteral: [
         ['0b', Symbol('BinaryDigits')],
         ['0B', Symbol('BinaryDigits')]],
      BinaryDigits: [
         [Symbol('BinaryDigit')],
         [Symbol('BinaryDigit'), Symbol('BinaryDigits')],
         [Symbol('BinaryDigit'), Symbol('NumericLiteralSeparator'), Symbol('BinaryDigits')]],
      BinaryDigit: [
         ['0'], ['1']],
      OctalIntegerLiteral: [
         ['0o', Symbol('OctalDigits')],
         ['0O', Symbol('OctalDigits')]],
      OctalDigits: [
         [Symbol('OctalDigit')],
         [Symbol('OctalDigit'), Symbol('OctalDigits')],
         [Symbol('OctalDigit'), Symbol('NumericLiteralSeparator'), Symbol('OctalDigits')]],
      OctalDigit: [
         ['0'], ['1'], ['2'], ['3'], ['4'], ['5'], ['6'], ['7']],
      HexIntegerLiteral: [
         ['0x', Symbol('HexDigits')],
         ['0X', Symbol('HexDigits')]],
      HexDigits: [
         [Symbol('HexDigit')],
         [Symbol('HexDigit'), Symbol('HexDigits')],
         [Symbol('HexDigit'), Symbol('NumericLiteralSeparator'), Symbol('HexDigits')]],
      HexDigit: [
         ['0'], ['1'], ['2'], ['3'], ['4'], ['5'], ['6'], ['7'], ['8'], ['9'],
         ['a'], ['b'], ['c'], ['d'], ['e'], ['f'],
         ['A'], ['B'], ['C'], ['D'], ['E'], ['F']],
   }

   // O(n^4); O(n^3) if data was already organized (no replacing)
   for (const productionName in NumericGrammar) {
      NumericGrammar[productionName].name = productionName
      if (NumericGrammar[productionName].every(alternative => alternative.every(part => typeof part === "string"))) {
         for (const productionName2 in NumericGrammar) {
            const production = NumericGrammar[productionName2]
            for (let i = 0; i < production.length; i++) {
               const alternative = production[i]
               const index = alternative.findIndex(part => part.description === productionName)
               
               if (index !== -1) {
                  production.splice(i, 1)
                  i--
                  for (const propStringAlternative of NumericGrammar[productionName]) {
                     const alternativeAlternative = alternative.slice() // pun
                     alternativeAlternative.splice(index, 1, ...propStringAlternative)
                     production.push(alternativeAlternative)
                  }
               }
            }
         }
         delete NumericGrammar[productionName]
      }
   }

   // O(n^3)
   for (const productionName in NumericGrammar) {
      const production = NumericGrammar[productionName]
      for (const alternative of production) {
         for (let i = alternative.length - 1; i >= 1; i--) {
            // I have finally figured out the... unfortunate best way to
            // whitespace complicated if statements
            if (typeof alternative[i] === "string" &&
                typeof alternative[i - 1] === "string")
            {
                alternative.splice(i - 1, 2, alternative[i - 1] + alternative[i])
            }
         }
      }
   }
   
   return ParseText(numericString, NumericGrammar, '_Numeric')
}

function StaticSemantics (semantics, parseNode) {
   const parseNodeType = parseNode.parseNode
   const indexOfAlternative = parseNodeType.indexOf(parseNode.alternative)
   return semantics[parseNodeType.name][indexOfAlternative](parseNode)
}

function getNumericMV (parseTree) {
   const IntegerExponentMV = (numeric, exponent) => {
      if (exponent === '-0') {
         exponent = '0'
      }

      if (exponent[0] === '-') {
         // 3* 10^-2
         // 10^-2 -> .01
         // .01 replaced with .01 * number
         // number.length === 1

         let start = '.' + '0'.repeat(-exponent)
         if (numeric.length < start.length) {
            // .01 ->  .03
            return start.slice(0, numeric.length) + numeric
         } else {
            // .01, 314 -> 3.14 with 314
            // .01, 300 -> 3.00 with 300
            // .01, 3 000 -> 30.00 with 3 000
            // .01, 3 141 000 -> 31410.00
            return `${
               numeric.slice(0, 1 + (numeric.length - start.length))
            }.${
               numeric.slice(1 + (numeric.length - start.length))
            }`     
         }
      } else {
         return numeric + '0'.repeat(exponent)
      }
   }

   const NumericExponentMV = (numeric, decimal, exponent) => {
      // String concatenation
      return IntegerExponentMV(numeric + decimal, exponent + decimal.length)
   }
   
   // Use by adding a prefix: '0b' + string beforehand
   const ToDecimal = (string) => {
      return BigInt(string).toString()
   }

   // One semantic for each alternative... but after the fact. Super inefficient
   // Everything is a string so it's string concatenation and math like adding digits to a number is easier
   const NumericMV = {
      _Numeric: [
         (parseTree => MVSemantics(parseTree[0])),
         (parseTree => MVSemantics(parseTree[0])),
         (parseTree => '-' + MVSemantics(parseTree[1]))],
      NumericLiteral: [
         (parseTree => MVSemantics(parseTree[0]))],
      NonDecimalIntegerLiteral: [
         (parseTree => MVSemantics(parseTree[0])),
         (parseTree => MVSemantics(parseTree[0])),
         (parseTree => MVSemantics(parseTree[0]))],
      DecimalLiteral: [
         (parseTree => MVSemantics(parseTree[0])),
         (parseTree => MVSemantics(parseTree[0]) + '.' + MVSemantics(parseTree[1])),
         (parseTree => IntegerExponentMV(MVSemantics(parseTree[0]), MVSemantics(parseTree[2]))),
         (parseTree => NumericExponentMV(MVSemantics(parseTree[0]), MVSemantics(parseTree[2]), MVSemantics(parseTree[3]))),
         (parseTree => '.' + MVSemantics(parseTree[1])),
         (parseTree => NumericExponentMV(0, MVSemantics(parseTree[1]), MVSemantics(parseTree[2]))),
         (parseTree => MVSemantics(parseTree[0])),
         (parseTree => IntegerExponentMV(MVSemantics(parseTree[0]), MVSemantics(parseTree[2])))],
      DecimalIntegerLiteral: [
         (parseTree => '0'), // The grammar is changed remember?
         (parseTree => '1'),
         (parseTree => '2'),
         (parseTree => '3'),
         (parseTree => '4'),
         (parseTree => '5'),
         (parseTree => '6'),
         (parseTree => '7'),
         (parseTree => '8'),
         (parseTree => '9'),
         (parseTree => '1' + MVSemantics(parseTree[1])), // 1 DecimalDigits
         (parseTree => '2' + MVSemantics(parseTree[1])),
         (parseTree => '3' + MVSemantics(parseTree[1])),
         (parseTree => '4' + MVSemantics(parseTree[1])),
         (parseTree => '5' + MVSemantics(parseTree[1])),
         (parseTree => '6' + MVSemantics(parseTree[1])),
         (parseTree => '7' + MVSemantics(parseTree[1])),
         (parseTree => '8' + MVSemantics(parseTree[1])),
         (parseTree => '9' + MVSemantics(parseTree[1])),
         (parseTree => '1' + MVSemantics(parseTree[1])), // 1_ DecimalDigits
         (parseTree => '2' + MVSemantics(parseTree[1])),
         (parseTree => '3' + MVSemantics(parseTree[1])),
         (parseTree => '4' + MVSemantics(parseTree[1])),
         (parseTree => '5' + MVSemantics(parseTree[1])),
         (parseTree => '6' + MVSemantics(parseTree[1])),
         (parseTree => '7' + MVSemantics(parseTree[1])),
         (parseTree => '8' + MVSemantics(parseTree[1])),
         (parseTree => '9' + MVSemantics(parseTree[1]))],
      DecimalDigits: [
         (parseTree => '0'),
         (parseTree => '1'),
         (parseTree => '2'),
         (parseTree => '3'),
         (parseTree => '4'),
         (parseTree => '5'),
         (parseTree => '6'),
         (parseTree => '7'),
         (parseTree => '8'),
         (parseTree => '9'),
         (parseTree => MVSemantics(parseTree[1])), // 0 DecimalDigits
         (parseTree => '1' + MVSemantics(parseTree[1])), // 1 DecimalDigits
         (parseTree => '2' + MVSemantics(parseTree[1])),
         (parseTree => '3' + MVSemantics(parseTree[1])),
         (parseTree => '4' + MVSemantics(parseTree[1])),
         (parseTree => '5' + MVSemantics(parseTree[1])),
         (parseTree => '6' + MVSemantics(parseTree[1])),
         (parseTree => '7' + MVSemantics(parseTree[1])),
         (parseTree => '8' + MVSemantics(parseTree[1])),
         (parseTree => '9' + MVSemantics(parseTree[1])),
         (parseTree => MVSemantics(parseTree[1])), // 0_ DecimalDigits
         (parseTree => '1' + MVSemantics(parseTree[1])), // 1_ DecimalDigits
         (parseTree => '2' + MVSemantics(parseTree[1])),
         (parseTree => '3' + MVSemantics(parseTree[1])),
         (parseTree => '4' + MVSemantics(parseTree[1])),
         (parseTree => '5' + MVSemantics(parseTree[1])),
         (parseTree => '6' + MVSemantics(parseTree[1])),
         (parseTree => '7' + MVSemantics(parseTree[1])),
         (parseTree => '8' + MVSemantics(parseTree[1])),
         (parseTree => '9' + MVSemantics(parseTree[1]))],
      ExponentPart: [
         (parseTree => MVSemantics(parseTree[1])),
         (parseTree => MVSemantics(parseTree[1]))],
      SignedInteger: [
         (parseTree => MVSemantics(parseTree[0])),
         (parseTree => MVSemantics(parseTree[1])),
         (parseTree => '-' + MVSemantics(parseTree[1]))],
      BinaryIntegerLiteral: [
         (parseTree => ToDecimal('0b' + MVSemantics(parseTree[1]))),
         (parseTree => ToDecimal('0b' + MVSemantics(parseTree[1])))],
      BinaryDigits: [
         (parseTree => '0'),
         (parseTree => '1'),
         (parseTree => MVSemantics(parseTree[1])), // 0 BinaryDigits
         (parseTree => '1' + MVSemantics(parseTree[1])),
         (parseTree => MVSemantics(parseTree[1])), // 0_ BinaryDigits
         (parseTree => '1' + MVSemantics(parseTree[1]))],
      OctalIntegerLiteral: [
         (parseTree => ToDecimal('0o' + MVSemantics(parseTree[1]))),
         (parseTree => ToDecimal('0o' + MVSemantics(parseTree[1])))],
      OctalDigits: [
         (parseTree => '0'),
         (parseTree => '1'),
         (parseTree => '2'),
         (parseTree => '3'),
         (parseTree => '4'),
         (parseTree => '5'),
         (parseTree => '6'),
         (parseTree => '7'),
         (parseTree => MVSemantics(parseTree[1])), // 0 OctalDigits
         (parseTree => '1' + MVSemantics(parseTree[1])),
         (parseTree => '2' + MVSemantics(parseTree[1])),
         (parseTree => '3' + MVSemantics(parseTree[1])),
         (parseTree => '4' + MVSemantics(parseTree[1])),
         (parseTree => '5' + MVSemantics(parseTree[1])),
         (parseTree => '6' + MVSemantics(parseTree[1])),
         (parseTree => '7' + MVSemantics(parseTree[1])),
         (parseTree => MVSemantics(parseTree[1])), // 0_ OctalDigits
         (parseTree => '1' + MVSemantics(parseTree[1])),
         (parseTree => '2' + MVSemantics(parseTree[1])),
         (parseTree => '3' + MVSemantics(parseTree[1])),
         (parseTree => '4' + MVSemantics(parseTree[1])),
         (parseTree => '5' + MVSemantics(parseTree[1])),
         (parseTree => '6' + MVSemantics(parseTree[1])),
         (parseTree => '7' + MVSemantics(parseTree[1]))],
      HexIntegerLiteral: [
         (parseTree => ToDecimal('0x' + MVSemantics(parseTree[1]))),
         (parseTree => ToDecimal('0x' + MVSemantics(parseTree[1])))],
      HexDigits: [
         (parseTree => '0'),
         (parseTree => '1'),
         (parseTree => '2'),
         (parseTree => '3'),
         (parseTree => '4'),
         (parseTree => '5'),
         (parseTree => '6'),
         (parseTree => '7'),
         (parseTree => '8'),
         (parseTree => '9'),
         (parseTree => 'a'),
         (parseTree => 'b'),
         (parseTree => 'c'),
         (parseTree => 'd'),
         (parseTree => 'e'),
         (parseTree => 'f'),
         (parseTree => 'A'),
         (parseTree => 'B'),
         (parseTree => 'C'),
         (parseTree => 'D'),
         (parseTree => 'E'),
         (parseTree => 'F'),
         (parseTree => MVSemantics(parseTree[1])), // 0 OctalDigits
         (parseTree => '1' + MVSemantics(parseTree[1])),
         (parseTree => '2' + MVSemantics(parseTree[1])),
         (parseTree => '3' + MVSemantics(parseTree[1])),
         (parseTree => '4' + MVSemantics(parseTree[1])),
         (parseTree => '5' + MVSemantics(parseTree[1])),
         (parseTree => '6' + MVSemantics(parseTree[1])),
         (parseTree => '7' + MVSemantics(parseTree[1])),
         (parseTree => '8' + MVSemantics(parseTree[1])),
         (parseTree => '9' + MVSemantics(parseTree[1])),
         (parseTree => 'a' + MVSemantics(parseTree[1])),
         (parseTree => 'b' + MVSemantics(parseTree[1])),
         (parseTree => 'c' + MVSemantics(parseTree[1])),
         (parseTree => 'd' + MVSemantics(parseTree[1])),
         (parseTree => 'e' + MVSemantics(parseTree[1])),
         (parseTree => 'f' + MVSemantics(parseTree[1])),
         (parseTree => 'A' + MVSemantics(parseTree[1])),
         (parseTree => 'B' + MVSemantics(parseTree[1])),
         (parseTree => 'C' + MVSemantics(parseTree[1])),
         (parseTree => 'D' + MVSemantics(parseTree[1])),
         (parseTree => 'E' + MVSemantics(parseTree[1])),
         (parseTree => 'F' + MVSemantics(parseTree[1])),
         (parseTree => MVSemantics(parseTree[1])), // 0_ OctalDigits
         (parseTree => '1' + MVSemantics(parseTree[1])),
         (parseTree => '2' + MVSemantics(parseTree[1])),
         (parseTree => '3' + MVSemantics(parseTree[1])),
         (parseTree => '4' + MVSemantics(parseTree[1])),
         (parseTree => '5' + MVSemantics(parseTree[1])),
         (parseTree => '6' + MVSemantics(parseTree[1])),
         (parseTree => '7' + MVSemantics(parseTree[1])),
         (parseTree => '8' + MVSemantics(parseTree[1])),
         (parseTree => '9' + MVSemantics(parseTree[1])),
         (parseTree => 'a' + MVSemantics(parseTree[1])),
         (parseTree => 'b' + MVSemantics(parseTree[1])),
         (parseTree => 'c' + MVSemantics(parseTree[1])),
         (parseTree => 'd' + MVSemantics(parseTree[1])),
         (parseTree => 'e' + MVSemantics(parseTree[1])),
         (parseTree => 'f' + MVSemantics(parseTree[1])),
         (parseTree => 'A' + MVSemantics(parseTree[1])),
         (parseTree => 'B' + MVSemantics(parseTree[1])),
         (parseTree => 'C' + MVSemantics(parseTree[1])),
         (parseTree => 'D' + MVSemantics(parseTree[1])),
         (parseTree => 'E' + MVSemantics(parseTree[1])),
         (parseTree => 'F' + MVSemantics(parseTree[1]))],
   }

   const MVSemantics = parseTree => StaticSemantics(NumericMV, parseTree)
   return MVSemantics(parseTree)
}

function getNumericValue(parseTree) {
   const MV = getNumericMV(parseTree)
   const NumericValue = {
      _Numeric: [
         (parseTree => getNumericValue(parseTree[0])),
         (parseTree => getNumericValue(parseTree[0])),
         (parseTree => -getNumericValue(parseTree[1]))],
      NumericLiteral: [
         (parseTree => Number(getNumericMV(parseTree[0]))),
         (parseTree => Number(getNumericMV(parseTree[0]))),
         (parseTree => BigInt(getNumericMV(parseTree[0])))],
      DecimalBigIntegerLiteral: [
         (parseTree => 0n),
         (parseTree => 1n),
         (parseTree => 2n),
         (parseTree => 3n),
         (parseTree => 4n),
         (parseTree => 5n),
         (parseTree => 6n),
         (parseTree => 7n),
         (parseTree => 8n),
         (parseTree => 9n),
         (parseTree => BigInt('1' + getNumericMV(parseTree[1]))),
         (parseTree => BigInt('2' + getNumericMV(parseTree[1]))),
         (parseTree => BigInt('3' + getNumericMV(parseTree[1]))),
         (parseTree => BigInt('4' + getNumericMV(parseTree[1]))),
         (parseTree => BigInt('5' + getNumericMV(parseTree[1]))),
         (parseTree => BigInt('6' + getNumericMV(parseTree[1]))),
         (parseTree => BigInt('7' + getNumericMV(parseTree[1]))),
         (parseTree => BigInt('8' + getNumericMV(parseTree[1]))),
         (parseTree => BigInt('9' + getNumericMV(parseTree[1]))),
         (parseTree => BigInt('1' + getNumericMV(parseTree[1]))),
         (parseTree => BigInt('2' + getNumericMV(parseTree[1]))),
         (parseTree => BigInt('3' + getNumericMV(parseTree[1]))),
         (parseTree => BigInt('4' + getNumericMV(parseTree[1]))),
         (parseTree => BigInt('5' + getNumericMV(parseTree[1]))),
         (parseTree => BigInt('6' + getNumericMV(parseTree[1]))),
         (parseTree => BigInt('7' + getNumericMV(parseTree[1]))),
         (parseTree => BigInt('8' + getNumericMV(parseTree[1]))),
         (parseTree => BigInt('9' + getNumericMV(parseTree[1])))]
   }
   return StaticSemantics(NumericValue, parseTree)
}

function numericToJSF (jsCode) {
   let resultingParse = parseNumeric(jsCode)
   if (resultingParse === null) {
      return 'Lol NaN'
   }

   const Value = getNumericValue(resultingParse)

   console.warn('Huh?', jsCode, resultingParse, Value)
   return 'Lol NaN'
}

// My device is tracked
export function toJSF (jsCode) {
   let result = numericToJSF(jsCode)
   if (result !== 'Lol NaN') {
      return result
   }
   
   // Unable to convert !
   return undefined
}
