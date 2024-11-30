// Run at https://js.do/celiasnt/log

const [safekeep, restore] = (() => {
   const unbound1 = Array.prototype.at
   const unbound2 = String.prototype.at

   return [() => {
      Array.prototype.at = function at (...args) {
         if (new.target !== undefined) throw TypeError("not a constructor");
         return unbound1.call(this, ...args)
      }
      String.prototype.at = function at (...args) {
         if (new.target !== undefined) throw TypeError("not a constructor");
         return unbound2.call(this, ...args)
      }
   }, () => {
      Array.prototype.at = unbound1
      String.prototype.at = unbound2
   }]
})();

const INTENTIONAL_PLUSPLUS = Symbol("++ was intentional :smile:")
const CANNOT_INDEX = Symbol("Cannot index!")
// String.prototype[CANNOT_INDEX] = false // unnecessary

const JSF = new Proxy({}, {
   get(target, key, receiver) {
      if (key in target) return Reflect.get(target, key, receiver);
      throw Error(`${key} is not in JSF!`)
   },
   set(obj, prop, value) {
      if (value.includes("++") && !value[INTENTIONAL_PLUSPLUS]) throw Error("unintentional plusplus!: " + value);
      safekeep()
      console.log(value.length, prop, eval(value))
      restore()
      return Reflect.set(obj, prop, value)
   }
})

const preventIndex = s => {s[CANNOT_INDEX] = true; return s}
const addNumber = (key, s) => JSF[key] = preventIndex(`+${JSF[s]}`)
const addNot = (key, s) => JSF[key] = preventIndex(`!${JSF[s]}`)
const addParen = key => JSF[`(${key})`] = `(${JSF[key]})`
const addBracket = key => JSF[`[${key}]`] = `[${JSF[key]}]`
const addSum = (key, ...parts) => JSF[key] = preventIndex(parts.map(k => JSF[k]).join("+"))
const addGet = (key, object, property) => {if (JSF[property][CANNOT_INDEX]) throw Error("cannot index");return JSF[key] = `${JSF[object]}[${JSF[property]}]`}
const addCall = (key, f, arg) => JSF[key] = `${JSF[f]}(${JSF[arg]})`
const addCall0 = (key, f) => JSF[key] = `${JSF[f]}()`
const addString = key => addSum(`"${key}"`, key, "[]")
const addWord = (...parts) => addSum(`"${parts.join("")}"`, ...parts.map(k => `"${k}"`))

// 2
JSF["[]"] = "[]"

// 3
addNumber(0, "[]")
addNot(false, "[]")

// 4
addNot(true, false)

// 5
addNumber(1, true)
addParen(0)
addBracket(0)
addBracket(false)
addSum('""', "[]", "[]")

// 6
addGet(undefined, "[]", "[]")
addNumber(NaN, "[false]")
addString(0)
addString(false)
addBracket(true)

// 7
addString(true)
addParen('""')
addParen(1)
addBracket(1)

// 8
addString(1)
addParen(NaN)
addBracket(NaN)
addParen('"false"')
addBracket('"false"')
addBracket(undefined)

// 9
addSum(2, true, true)
addParen('"true"')
addBracket('"true"')
addString(undefined)
addString(NaN)
addSum('"00"', 0, "[0]")
addSum('"0false"', "[0]", "false")

// 11
addSum('"10"', 1, "[0]")
addParen('"undefined"')
addBracket('"undefined"')
addParen('"NaN"')
addBracket('"NaN"')
addParen(2)
addBracket(2)

// 12
addSum('"falseundefined"', "[false]", undefined)
addString(2)

// 13
addGet('"f"', '("false")', 0)
addSum('"11"', 1, "[1]")
addParen('"10"')

// 14
addSum(3, 2, true)
addGet('"t"', '("true")', 0)
addParen('"falseundefined"')

// 15
addSum('"20"', 2, "[0]")
addGet('"a"', '("false")', 1)
addSum('"undefinedundefined"', undefined, '[undefined]')

// 16
addGet('"r"', '("true")', 1)
addGet('"u"', '("undefined")', 0)
addGet('"N"', '("NaN")', 0)

// 17
addString(3)
addSum('"12"', 1, "[2]")
addSum('"21"', 2, "[1]")
addSum('"100"', '"10"', '(0)') // Concatenating numbers is inefficient. Prefer NaN

// 18
addGet('"n"', '("undefined")', 1)

// 19
addGet('"l"', '("false")', 2)
addSum(4, 3, true)

// 20
addSum('"30"', 3, "[0]")

// 21
addSum('"22"', 2, "[2]")

// 22
addGet('"d"', '("undefined")', 2)

// 23
addSum('"1000"', '"100"', '(0)')

// 24
addGet('"s"', '("false")', 3)
addSum(5, 4, true)

// 25
addGet('"e"', '("true")', 3)

// 27
addGet('"i"', '("falseundefined")', '"10"')

// 29
addSum(6, 5, true)

// 30
addString('"at"', '"a"', '"t"')

// 34
addGet('[]["at"]', '[]', '"at"')
addSum(7, 6, true)

// 39
addGet('("")["at"]', '("")', '"at"')
addSum(8, 7, true)

// 44
addSum(9, 8, true)

// 45
addSum('"1e10"', 1, '"e"', '("10")')

// 47
addParen('"1e10"')

// 48
addNumber('10000000000', '("1e10")')

// 49
addSum('"1e20"', 1, '"e"', '(2)', '(0)')

// 51
addSum('"1e21"', 1, '"e"', '(2)', '(1)')
addSum('"1e100"', 1, '"e"', '(1)', '(0)', '(0)')

// 52
addWord(..."is")

// 53
addParen('"1e21"')
addParen('"1e100"')

// 54
addNumber(1e+21, '("1e21")')
addNumber(1e+100, '("1e100")')

// 57
addSum('"1e1000"', 1, '"e"', '(1)', '(0)', '(0)', '(0)')
addSum('"11e20"', 1, '[1]', '"e"', '(2)', '(0)')
addString(1e+21)
addString(1e+100)

// 59
addParen('"1e1000"')
addParen('"11e20"')

// 60
addNumber(Infinity, '("1e1000")')
addNumber(1.1e+21, '("11e20")')

// 61
addSum('"isNaN"', '"is"', '(NaN)')

// 63
addString(Infinity)
addString(1.1e+21)

// 64
addWord(..."flat")

// 65
addParen('"Infinity"')
addParen('"1.1e+21"')


64: "flat"
    "f"+"l"+"a"+"t"

70: "I"
    (Infinity+[])[0]

70: "+"
     ("1e+21")[2]
     ("1e+100")[2]

72: "."
     ("1.1e+21")[1]

81: "fill"
    "f"+"i"+"l"+"l"

83: "find"
    "f"+"i"+"n"+"d"

84: "y"
    (NaN+[Infinity])["10"]
    (true+[Infinity])["11"]

86: "seal"
    "s"+"e"+"a"+"l"

110: "return"
     "r"+"e"+"t"+"u"+"r"+"n"

119: "filter"
     "f"+"i"+"l"+"t"+"e"+"r"

155: "entries"
     "e"+"n"+"t"+"r"+"i"+"e"+"s"

161: []["entries"]()
     []["entries"]()

164: "[object Array Iterator]"
     []["entries"]()+[]

171: "["
     ("[object Array Iterator]")[0]

173: "o"
     ("[object Array Iterator]")[1]

177: "b"
     ("[object Array Iterator]")[2]

180: "c"
     (false+[]["entries"]())["10"]

182: "j"
     ("[object Array Iterator]")[3]

183: " "
     (true+[]["entries"]())["11"]
     (NaN+[]["entries"]())["10"]

185: "A"
     (NaN+[]["entries"]())["11"]

187: "of"
     "o"+"f"

189: "]"
     ("[object Array Iterator]")["22"]

194: ".0000001"
     "."+(0)+(0)+(0)+(0)+(0)+(0)+(1)

200: "1e-7"
     +(".0000001")+[]

213: "-"
     ("1e-7")[2]

230: "sort"
     "s"+"o"+"r"+"t"

236: "call"
     "c"+"a"+"l"+"l"

247: "bind"
     "b"+"i"+"n"+"d"

279: "slice"
     "s"+"l"+"i"+"c"+"e"

280: "create"
     "c"+"r"+"e"+"a"+"t"+"e"

289: "reduce"
     "r"+"e"+"d"+"u"+"c"+"e"

306: []["flat"]["call"]
     []["flat"]["call"]
// Shortest code equivalent to []["split"]

320: "Array"
     "A"+"r"+"r"+"a"+"y"

322: "[object Iterator Helper]"
     []+[]["entries"]()["filter"]([]["at"])

326: ","
     ([]+[]["flat"]["call"]("false"))[1]

338: "includes"
     "i"+"n"+"c"+"l"+"u"+"d"+"e"+"s"

340: "p"
     ("[object Iterator Helper]")["20"]

344: "H"
     (NaN+[]["entries"]()["filter"]([]["at"]))["20"]

373: "isArray"
     "is"+"Array"

403: "join"
     "j"+"o"+"i"+"n"

428: "split"
     "s"+"p"+"l"+"i"+"t"

432: []["entries"]()["filter"]([]["at"])["return"]()
     []["entries"]()["filter"]([]["at"])["return"]()

435: "[object Object]"
     []+[]["entries"]()["filter"]([]["at"])["return"]()

440: "repeat"
     "r"+"e"+"p"+"e"+"a"+"t"

456: "O"
      (NaN+[]["entries"]()["filter"]([]["at"])["return"]())["11"]

509: "toArray"
     "t"+"o"+"Array"

554: "drop"
     "d"+"r"+"o"+"p"

585: "concat"
     "c"+"o"+"n"+"c"+"a"+"t"

620: "splice"
     "s"+"p"+"l"+"i"+"c"+"e"

626: "replace"
     "r"+"e"+"p"+"l"+"a"+"c"+"e"

677: "[u-y]"
     "["+"u"+"-"+"y"+"]"

834: "constructor"
     "c"+"o"+"n"+"s"+"t"+"r"+"u"+"c"+"t"+"o"+"r"

844: Array
     []["constructor"]

847: Number
     (0)["constructor"]

847: Boolean
     (false)["constructor"]

849: String
     ("")["constructor"]

852: "replaceAll"
     "replace"+"A"+"l"+"l"

855: "pop"
     "p"+"o"+"p"

876: Function
     []["at"]["constructor"]

997: Iterator
     []["entries"]()["constructor"]

1187: "prototype"
      "p"+"r"+"o"+"t"+"o"+"t"+"y"+"p"+"e"

1268: Object
      []["entries"]()["filter"]([]["at"])["return"]()["constructor"]

3560: ["length",0]
      Object["entries"](Array["of"]["bind"](Number)())

3565: "length"
      ["length",0][0]

3579: "h"
      (false+["length",0])["10"]

3581: "g"
      "length"[3]

3694: "assign"
      "a"+"s"+"s"+"i"+"g"+"n"

3808: "isInteger"
      "is"+"I"+"n"+"t"+"e"+"g"+"e"+"r"

3844: "search"
      "s"+"e"+"a"+"r"+"c"+"h"

3905: "substring"
      "s"+"u"+"b"+"s"+"t"+"r"+"i"+"n"+"g"

3962: "push"
      "p"+"u"+"s"+"h"

5306: []["concat"]()["reduce"](Object["assign"])
      []["concat"]()["reduce"](Object["assign"])

// [A]["concat"](B)["reduce"](Object["assign"])
// is the same as A[0] = A, A[1] = B
//
// If B is a string, A[index] = B[index] starting from index 2
// Returns A

11050: "m"
       [[]["at"]]["concat"]([]["flat"]["call"](Number+[])["sort"]()["join"](""))["reduce"](Object["assign"])[[]["at"][1]["slice"](1)["search"]("n")]

//                          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^                             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                          sorts characters in Number.toString                                             index []["at"] at [index 1 before "n"]
//     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//     Object.assign([]["at"], sorted characters), returns []["at"]
//
// This strategy cannot be used for "v" since there may be an arbitrary amount of "u", so adding 1 doesn't work for v like subtracting 1 does for m.
//
// This sets many properties on []["at"]
// If "m" is used twice, after the first time this is shorter:
//
// 3960: "m" (saves 7090)
// []["at"][[]["at"][1]["slice"](1)["search"]("n")]
//
// At three times or more it is worthwhile to instead assign "m" to []["at"][1]:
//
// 16397: "m"
// [[]["at"]]["concat"]("m")["reduce"](Object["assign"])[1]
//
// 41: "m"
// []["at"][1]
//
// 11050+3960+3960 > 16397+41+41
//           18970 > 16479        (2491 + 3919n save)
//
// Eventually it would be fastest to assign it to Array.prototype

m1:
11110: "trim"
       "t"+"r"+"i"+"m"

m1:
11111: "name"
       "n"+"a"+"m"+"e"

m1:
11275: "some"
       "s"+"o"+"m"+"e"

m1:
11407: "map"
       "m"+"a"+"p"

m1:
11751: "fromAsync"
       "from"+"A"+"s"+"y"+"n"+"c"

m1:
11965: "B"
       Boolean["name"][0]

m1:
11967: "S"
       String["name"][0]

m1:
11994: "F"
       Function["name"][0]

m1:
12131: "isSealed"
       "i"+"s"+"S"+"e"+a"+l"+"e"+"d"

m1:
12151: "toString"
       "t"+"o"+String["name"]

m1:
12174: "isFinite"
       "is"+"F"+"i"+"n"+"i"+"t"+"e"

m1:
12192: "k"
       (+(2+[0]))["toString"](2+[1])

m1:
12208: "v"
       (+(3+[1]))["toString"](3+[2])

m1:
12217: "w"
       (+(3+[2]))["toString"](3+[3])

m1:
12218: "q"
       (+(2+[1]+[2]))["toString"](3+[1])[1]

m1:
12222: "x"
       (+(1+[0]+[1]))["toString"](3+[4])[1]

m1:
12247: "z"
       (+(3+[5]))["toString"](3+[6])

m1:
12249: "take"
       "t"+"a"+"k"+"e"

m1:
12312: "values"
       "v"+"a"+"l"+"u"+"e"+"s"

m1:
12318: "index"
       "i"+"n"+"d"+"e"+"x"

m1:
12325: "valueOf"
       "v"+"a"+"l"+"u"+"e"+"O"+"f"

m1:
12328: "keys"
       "k"+"e"+"y"+"s"

m1:
12345: "reverse"
       "r"+"e"+"v"+"e"+"r"+"s"+"e"

m1:
12356: "freeze"
       "f"+"r"+"e"+"e"+"z"+"e"

m1:
12362: "every"
       "e"+"v"+"e"+"r"+"y"

m1:
12410: "padStart"
       "p"+"a"+"d"+"S"+"t"+"a"+"r"+"t"

m1:
12411: "toSorted"
       "t"+"o"+"S"+"o"+"r"+"t"+"e"+"d"

m1:
12578: "U"
       (NaN+[]["entries"]()["toString"]["call"]())["11"]

m1:
12775: "toSpliced"
       "t"+"o"+"S"+"p"+"l"+"i"+"c"+"e"+"d"

m1:
13356: "indexOf"
       "index"+"O"+"f"

m1:
13475: "lastIndexOf"
       "l"+"a"+"s"+"t"+"I"+"n"+"d"+"e"+"x"+"O"+"f"

m1:
14571: "match"
       "m"+"at"+"c"+"h"

m1:
14797: "matchAll"
       "match"+"A"+"l"+"l"

m1:
15561: "isSafeInteger"
       "i"+"s"+"S"+"a"+"f"+"e"+"I"+"n"+"t"+"e"+"g"+"e"+"r"

m1:
15569: "with"
       "w"+"i"+"t"+"h"

m1:
15910: "groupBy"
       "g"+"r"+"o"+"u"+"p"+"B"+"y"

// saves 7090
m2:
16062: "trimStart"
       "trim"+"S"+"t"+"a"+"r"+"t"

m2:
16508: "normalize"
       "n"+"o"+"r"+"m"+"a"+"l"+"i"+"z"+"e"

m1:
16610: "hasOwn"
       "h"+"a"+"s"+"O"+"w"+"n"

m2:
17393: "toFixed"
       "t"+"o"+"F"+"i"+"x"+"e"+"d"

m2:
17441: "isFrozen"
       "is"+"F"+"r"+"o"+"z"+"e"+"n"

m3:
27690: "{"
       [("")["at"]]["concat"]([]["flat"]["call"]([]["at"]+"z")["sort"]()["join"](""))["reduce"](Object["assign"])[1+("")["at"][1]["lastIndexOf"]("z")]

// Similar to "m", but I doubt I'll ever use "{" so I won't calculate further usages. For convenience, I use ("")["at"],
// which is a different but still global object from []["at"]
//
// []["at"][[]["flat"]["call"]("z"+[]["at"][1])["sort"]()["join"]("")["lastIndexOf"]("z")]
//                             1   ^^^^^^^^^^^                                 2     3
// would work but only once, as long as the third usage of m comes before the "^^^..." but at least one usage happens before.


Footnotes: {
   [1]: Array.prototype.at.toString()
        // aka String([].at)

        // This is implementation-defined
        // Thanks https://github.com/tc39/ecma262/issues/2488
        // There can be any positive integer amount of whitespace or comments between, before, and after any of these tokens:
        // `function` `at` `(` `)` `{` `[` `native` `code` `]` `}`

        // (where whitespace is defined in the specification - see source)

        // So you can't assume that it will always look like some sensible string like
        // "function flat() { [native code] }"

        // But if you're targeting specific browsers then you could make "c" and "o" with
        // ([]["at"]+[])[3]
        // ([]["at"]+[])[6]
        // or similar
   
        // So current usage is far more complicated than one would think necessary
   [2]: String.prototype.bold
        // This is a legacy property, and it isn't guaranteed to be implemented unless the implementation has to run legacy code.
        // Which is most implementations (and every implementation I know). But still, not guaranteed to exist.

        // But with the methods bold, fontcolor, italics, and sub, we get the following characters:
        // <>/"
}

/**
false                      false
true                       tru
undefined                  ndi
NaN                        N
Infinity                   Iy
<numbers and exponents>    0123456789+-.
[object Array Iterator]    [objc A]
[object Iterator Helper]   Hp
[object Object]            O
<array toString>           ,
<"length" property>        gh
Number#toString            m
Boolean                    B
String                     S
Function                   F
<number toString>          kqvwxz
[object Undefined]         U
Number#toString            {

ABCDEFGHIJKLMNOPQRSTUVWXYZ
^^   ^ ^^   ^^^   ^ ^
abcdefghijklmnopqrstuvwxyz (Done!)

function ( ) { [ native code ] }
         x x x                 x

 !"#$%&'()*+,-./0-9:;<=>?@ A-Z [\]^_` a-z {|}~
^          ^^^^ ^^^        A-Z ^ ^    ^^^ ^
**/

// Things equivalent to String.prototype.split('')
// []["slice"]["call"]("test")
// []["flat"]["call"]("test") <least expensive

// Although for the slice case, it actually allows us to make a substring:
// []["slice"]["bind"]("test")(1)["join"]("")

// We can make a string of the characters in both strings (intersection):
// []["filter"]["bind"]("test A")(("")["includes"]["bind"]("test B"))["join"]("")

// We can even sort the characters
// []["flat"]["bind"]("test")()["sort"]()

// [arg1, arg2].reduce(function)
// Calls function with (arg1, arg2, 1, [arg1, arg2])
//
// So if a function only uses two arguments, this is a way to call that
// function with two arguments:
//   []["slice"]["bind"]("test")(1)["join"]("")
//
// Of course the other arguments can do something though
//   ["test1", "test2"].reduce([]["fill"]["bind"]([1, 2, 3]))   // > ["test1", 2, 3]

// A global array can be used to use multiple statements:
// [expr1,expr2,expr3]
//
// This could be useful to do some Object.assigns at the start

// This can be used to call some functions with 2 args
// But this is still quite limiting, for example "fill" can only set the first number.
const possibleObjects = [
   "", // Strings that contain any amount* of chars in any order
   true, false, NaN, undefined, Infinity,
   [], // Arrays can contain any amount* of possibleObjects in any order
       // because we can use Array.prototype.concat
   "constructor", // We can get something's constructor
                  // So far there's only values with the following constructors
                  // But first, some Function#properties.
   "prototype", // We can get something's prototype; but using an instance is better
   Function.prototype.bind,  // Makes a function "bound". Sets the "bound this value".
                             // When a bound function is called the "this value" is set to the "bound this value".
                             // Function.prototype.apply now doesn't do anything.
   Function.prototype.call,
   Function.prototype.length,
   Function.prototype.name, // Mostly useless because most methods are accessed by writing out the whole name: []["at"]
   Array, // Although it's a class, using it as a function is equivalent, except that NewTarget is always undefined.
          // Therefore newTarget is the active function object, which is set to the function whose [[Call]] or [[Construct]] is ...done.
          // aka Array
          // And so proto is always Array.prototype
          // The other way to make arrays, Array.of, _does_ support binding the this value.
          // As such we can define the "0" "1" etc. + "length" properties on a Number object.
          // Wait, I just did Array.of.bind(Object)("test") and got a Number???

          // If called with 0 args, it always returns just []
          // With 1 arg, returns either [arg1] or if typeof arg = number, sets array.length to number. (If valid number. Else error)
          // Note: Can't hav more than 1 arg since can't use comma.
          // Can only be called to make undefined[] or [possibleObjects]
   Number, // Converts to a number except it doesn't throw with BigInts. But BigInts can't be created right now. Same as +(value)
   Boolean, // Converts something to a boolean. Same as !!(value)
            // Booleans can't really do anything, but at least there's a lot of letters to access in "true" and "false".
   String, // Converts something to a string. Same as (value)+[]. Note that Symbols also can't be created right now.
   Function, // In this scenario, calling Function always throws an error
   Object, // Object() and Object(null) creates {}
           // Object(x) creates ToObject(object)
   0..toFixed,
   [].concat, // Used to combine two arrays - or push a value. (Returns new array though)
              // Note that usually something like 
              //    ([]+[]["flat"]["bind"]("false")())[1]
              // is shorter
              //
              // A = [], O = toObject(this value)
              // For each E of [O, ...args]
              //    If E[@@isConcatSpreadable] ?? IsArray(E)
              //       Add each element from E to A as long as that index exists and length isn't reached.
              //    Else
              //       Add E to A
              // Return A
   [].fill, // value=arg1, start=arg2, O=ToObject(this value) len=LengthOfArrayLike(O)
            //    Sets (each index from 0 to len) of O to value
   [].find, // O, len as in [].fill
            // If arg(element of O, index of element, O), return element
            // Return undefined

            // This has potential if there's a function that sometimes doesn't return a truthy value:
            // []["find"].bind("     function   Array   ( )  {     [ native    code]   } \uFEFF")(Boolean)
            // But I haven't found such a function yet.
   [].pop,
   [].push,
   [].slice, // Returns array containing elements from start to end. start can be negative.
   [].splice,
   [].sort, // Gets items from 0 to len
            // Sorts items from least to greatest.
            //    undefined > anything
            //    If arg exists, ToNumber(arg(x, y)) should return a negative value when x<y, 0 when x=y, and a positive value when x>y
            // Changes ToObject(this value)'s properties
   [].includes, // true or false
   [].join, // Joins elements by separator
            // +[]["join"].bind("000000")("9")
   [].entries, // CreateArrayIterator(ToObject(this value), key+value)
   [].filter, // Returns new array with the elements where ToBoolean(Arg(element, index, ToObject(this value))) is true
   [].flat, // Returns new array, FlattenIntoArray([], ToObject(this value), len, 0, ToIntegerOrInfinity(arg))
   [].reduce, // arg: (accum (last call), currentElement, index, ToObject(this value))
   [].some,
   [].toSorted,
   [].toSpliced,
   [].at,
   "".at,
   "".concat, // ToString(this value) + ToString(arg)
   "".includes, // true or false
   "".match,
   "".matchAll,
   "".slice, // Same as array.slice, but returns a string
   "".search, // Takes a regex. Returns the index of the first match.
              // If the arguent is not a regex, it is implicitly turned into one by new Regex(argument)!!!
              // How convenient is that?
              // We're of course passing in a string. What regexes are possible?
              // The string eventually ends up as `pattern` in `RegExpInitialize`:
              //    https://tc39.es/ecma262/multipage/text-processing.html#sec-regexpinitialize
              // If only "\" was possible
   "".substring,
   "".trim,
   "".trimEnd,
   {}.toString, // Almost every class has toString so I'm not duplicating this
   Object.is,
   Object.seal,
   Object.isSealed,
   Object.create,
   Object.entries, // Huge
   Object.assign,
   Number.isFinite,
   Number.isInteger,
   Number.isSafeInteger,
   Number.isNaN,
   Number.NaN, // Currently useless
   Number.parseFloat,
   Number.parseInt,
   Array.from,
   Array.isArray,
   Array.of,
]

/** Utils */

const chars = {
   "0": 6,
   "1": 8,
   "2": 12,
   "3": 17,
   "4": 22,
   "5": 27,
   "6": 32,
   "7": 37,
   "8": 42,
   "9": 47,
   "f": 13,
   "t": 14,
   "a": 15,
   "u": 16,
   "r": 16,
   "N": 16,
   "n": 18,
   "l": 19,
   "d": 22,
   "s": 24,
   "e": 25,
   "i": 27,
   "I": 70,
   "+": 70,
   ".": 72,
   "y": 84,
   "[": 171,
   "o": 173,
   "b": 177,
   "c": 180,
   "j": 182,
   " ": 183,
   "A": 185,
   "]": 189,
   "-": 213,
   ",": 326,
   "p": 340,
   "H": 344,
   "O": 456,
   "h": 3579,
   "g": 3581,
   "m": 11050,
   "B": 11965,
   "S": 11967,
   "F": 11994,
   "k": 12192,
   "v": 12208,
   "w": 12217,
   "q": 12218,
   "x": 12222,
   "z": 12247,
   "U": 12578,
   "{": 27690,
}

// If we can make a string
function can (s) {
    return s.split('').every(char => char in chars)
}

// Why we cannot make a string
function cannot (s) {
    return `${s}: ${s.split('').filter(char => !(char in chars))}`
}

// Properties of an object we can get
function canProps (o) {
    return Object.getOwnPropertyNames(o).map(key => can(key) ? key : cannot(key))
}

// How long it takes to make a string
// Strings with numbers can probably be optimized better though
// Often inaccurate for characters using "m"
function howLong (s) {
   return s.split('').map(char => chars[char]).reduce((accum, curr) => accum + curr) + s.length - 1
}

// Convert string into jsf-style build documentation
function formWord (s) {
   return s.split('').map(char => `"${char}"`).join("+")
}

const reachableObjects = [Boolean, Number, String, Function, Array, Object,
      Boolean.prototype, Number.prototype, String.prototype, Function.prototype, Array.prototype, Object.prototype,
      [].entries(), [].entries().constructor, [].entries().constructor.prototype, Object.getPrototypeOf([].entries()),
      [].entries().drop(0), Object.getPrototypeOf([].entries().drop(0))]
function logAllCanProps () {
   for (const object of reachableObjects) {
      console.log(canProps(object))
   }
}
