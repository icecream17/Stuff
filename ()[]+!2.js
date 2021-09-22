length: name
        shorthand 1
        shorthand 2
        shorthand 3
        ...

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

6: "0"
   0+[]

6: "false"
   false+[]

7: "true"
   true+[]

7: NaN
   +undefined

8: "1"
   1+[]

9: 2
   true+true

9: "undefined"
   undefined+[]

10: "NaN"
    NaN+[]

11: "10"
   1+[0]

12: "falseundefined"
    [false]+undefined

13: "f"
    ("false")[0]

14: 3
    true+true+true

14: "t"
    ("true")[0]

15: "a"
    ("false")[1]

15: "11"
    1+[1]

16: "u"
    ("undefined")[0]

16: "r"
    ("true")[1]

17: "N"
    ("NaN")[0]

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

34: 7
    true+true+true+true+true+true+true

39: 8
    true+true+true+true+true+true+true+true

44: 9
    true+true+true+true+true+true+true+true+true

60: Infinity
    +(1+"e"+("1000"))

64: "flat"
    "f"+"l"+"a"+"t"

68: []["flat"]
    []["flat"]

70: "I"
    (Infinity+[])[0]

81: "fill"
    "f"+"i"+"l"+"l"

83: "find"
    "f"+"i"+"n"+"d"

84: "y"
    (true+[Infinity])["11"]

114: "filter"
     "f"+"i"+"l"+"t"+"e"+"r"

131: "1000000000000000000000"
     1+[0]+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)
     1+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0]]]]]]]]]]]]]]]]]]]]]

133: "1100000000000000000000"
     1+[1]+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0)
     1+[1+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0+[0]]]]]]]]]]]]]]]]]]]]]

139: "1e+21"
     (+("1000000000000000000000"))+[]

141: "1.1e+21"
     (+("1100000000000000000000"))+[]

150: "."
     ("1.1e+21")[1]

152: "+"
     ("1e+21")[2]

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

182: "j"
     ("[object Array Iterator]")[3]

183: "c"
     (false+"[object Array Iterator]")["10"]

186: "A"
     (true+"[object Array Iterator]")["11"]

189: "]"
     ("[object Array Iterator]")["22"]

194: ".0000001"
     "."+(0)+(0)+(0)+(0)+(0)+(0)+(1)

200: "1e-7"
     +(".0000001")+[]

211: "-"
     "1e-7"[2]

840: "constructor"
     "c"+"o"+"n"+"s"+"t"+"r"+"u"+"c"+"t"+"o"+"r"

844: Array
     []["constructor"]

847: Number
     (0)["constructor"]

847: Boolean
     (false)["constructor"]

850: String
     ("0")["constructor"]
     ("false")["constructor"]

910: Function
     []["flat"]["constructor"]

997: Object
     []["entries"]()["constructor"]

Footnotes: {
   [1]: Array.prototype.flat.toString()
        // aka String([].flat)

        // This is implementation-defined
        // Thanks https://github.com/tc39/ecma262/issues/2488
        // There can be any positive integer amount of whitespace between, before, and after any of these tokens:
        // `function` `flat` `(` `)` `{` `[` `native` `code` `]` `}`

        // (where whitespace is defined in the specification - see source)

        // So you can't assume that it will always look like some sensible string like
        // "function flat() { [native code] }"

        // But if you're targeting specific browsers then you could make "c" and "o" with
        // ([]["flat"]+[])[3]
        // ([]["flat"]+[])[6]
        // or similar
   [2]: String.prototype.bold
        // This is a legacy property, and it isn't guaranteed to be implemented unless the implementation has to run legacy code.
        // Which is most implementations (and every implementation I know). But still, not guaranteed to exist.

        // But with the methods bold, fontcolor, italics, and sub, we get the following characters:
        // <>/"
}

/**
// If we can make a string
function can (s) {
    return s.split('').every(char => "abecdflijnorstuyANI[]+-".includes(char))
}

// Properties of an object we can get
function canProps (o) {
    return Object.getOwnPropertyNames(o).filter(key => can(key))
}
*/
