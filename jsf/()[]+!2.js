// length: name
//         shorthand 1
//         shorthand 2
//         shorthand 3
//         ...

// Common unmentioned alternatives (shorthands):
// a+[] === []+a
// [b]+(c) === [b]+[c]

// Add an underscore before every /[0-9]+:/g to make this valid javascript

3: 0
   +[]

3: false
   ![]

4: true
   !![]

5: 1
   +true

6: undefined
   [][[]]

6: NaN
   +[false]

6: "0"
   0+[]

6: "false"
   false+[]

7: "true"
   true+[]

7: ("")
   ([]+[])

8: "1"
   1+[]

9: 2
   true+true

9: "undefined"
   undefined+[]

9: "00"
   0+[0]

9: "NaN"
    NaN+[]

11: "10"
    1+[0]

12: "falseundefined"
    [false]+undefined

12: "2"
    2+[]

13: "f"
    ("false")[0]

13: "11"
    1+[1]

14: 3
    true+true+true

14: "t"
    ("true")[0]

15: "20"
    2+[0]

15: "a"
    ("false")[1]

16: "u"
    ("undefined")[0]

16: "r"
    ("true")[1]

16: "N"
    ("NaN")[0]

16: "undefinedundefined"
    []+undefined+undefined

17: "3"
    3+[]

17: "12"
    1+[2]

17: "100"
    [1]+"00"

18: "n"
    ("undefined")[1]

19: "l"
    ("false")[2]

19: 4
    true+true+true+true

21: "22"
    2+[2]

22: "d"
    ("undefined")[2]

23: "1000"
    1+[0+[0+[0]]]
    1+[0]+(0)+(0)

23: "undefinedundefinedundefined"
    []+undefined+undefined+undefined

24: "s"
    ("false")[3]

24: 5
    true+true+true+true+true

25: "e"
    ("true")[3]

27: "i"
    ("falseundefined")["10"]

29: 6
    true+true+true+true+true+true

30: "at"
    "a"+"t"

34: []["at"]
    []["at"]

34: 7
    true+true+true+true+true+true+true

39: 8
    true+true+true+true+true+true+true+true

44: 9
    true+true+true+true+true+true+true+true+true

45: "1e10"
    1+"e"+("10")

48: 10000000000
    +(1+"e"+("10"))

49: "1e20"
    1+"e"+(2)+(0)

51: "1e100"
    1+"e"+(1)+(0)+(0)

51: "1e21"
    1+"e"+(2)+(1)

51: "undefinedundefinedundefinedundefinedundefinedundefined"
    []+undefined+undefined+undefined+undefined+undefined+undefined

52: "is"
    "i"+"s"

55: "100000000000000000000"
    +("1e20")+[]

57: "1e+100"
    +("1e100")+[]

57: "1e+21"
    +("1e21")+[]

57: "11e20"
    "11"+"e"+(2)+(0)

60: Infinity
    +(1+"e"+("1000"))

63: "1.1e+21"
    +("11e20")+[]

63: "isNaN"
    "is"+(NaN)

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

239: "call"
     "c"+"a"+"l"+"l"

247: "bind"
     "b"+"i"+"n"+"d"

282: "slice"
     "s"+"l"+"i"+"c"+"e"

283: "create"
     "c"+"r"+"e"+"a"+"t"+"e"

292: "reduce"
     "r"+"e"+"d"+"u"+"c"+"e"

339: ","
     ([]+[]["flat"]["bind"]("false")())[1]

341: "includes"
     "i"+"n"+"c"+"l"+"u"+"d"+"e"+"s"

373: "isArray"
     "is"+"A"+"r"+"r"+"a"+"y"

403: "join"
     "j"+"o"+"i"+"n"

591: "concat"
     "c"+"o"+"n"+"c"+"a"+"t"

840: "constructor"
     "c"+"o"+"n"+"s"+"t"+"r"+"u"+"c"+"t"+"o"+"r"

844: Array
     []["constructor"]

847: Number
     (0)["constructor"]

847: Boolean
     (false)["constructor"]

849: String
     ("")["constructor"]

876: Function
     []["at"]["constructor"]

997: Object
     []["entries"]()["constructor"]

1002: "[object Object]"
      []+Object()

1023: "O"
      (NaN+Object())["11"]

Footnotes: {
   [1]: Array.prototype.at.toString()
        // aka String([].at)

        // This is implementation-defined
        // Thanks https://github.com/tc39/ecma262/issues/2488
        // There can be any positive integer amount of whitespace between, before, and after any of these tokens:
        // `function` `at` `(` `)` `{` `[` `native` `code` `]` `}`

        // (where whitespace is defined in the specification - see source)

        // So you can't assume that it will always look like some sensible string like
        // "function flat() { [native code] }"

        // But if you're targeting specific browsers then you could make "c" and "o" with
        // ([]["at"]+[])[3]
        // ([]["at"]+[])[6]
        // or similar
   
        // We do have the "filter" function and a way to split strings into arrays of characters,
        // but currently I haven't found a function that filters away everything except the characters we want.
        // And even if we can remove whitespace, comments are allowed.
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
[object Array Iterator]    [objc A]
[object Object]            O
[[]]["concat"][[]]+[]      ,
<numbers and exponents>    0123456789+-.

etaoinshrdclumwfgy [bjkpqvxz]
       x     xx x     xxxxxx
**/

// Things equivalent to String.prototype.split('')
// []["slice"]["bind"]("test")()
// []["flat"]["bind"]("test")()

// Although for the slice case, it actually allows us to make a substring:
// []["slice"]["bind"]("test")(1)["join"]("")

// We can make a string of the characters in both strings:
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
   Function.prototype.bind,  // Makes a function "bound". Sets the "bound this value".
                             // When a bound function is called the "this value" is set to the "bound this value".
                             // Function.prototype.apply now doesn't do anything.
   Function.prototype.call,
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
   [].slice, // Returns array containing elements from start to end. start can be negative.
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
   [].at,
   "".concat, // ToString(this value) + ToString(arg)
   "".includes, // true or false
   "".slice, // Same as array.slice, but returns a string
   "".at,
   Object.is,
   Object.seal,
   Object.create,
   Object.entries,
   Number.isNaN,
   Number.NaN, // Currently useless
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
   ",": 339,
   "O": 1023,
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
function howLong (s) {
   return s.split('').map(char => chars[char]).reduce((accum, curr) => accum + curr) + s.length - 1
}
