# JSFuck, but even harder!?

How much can you do if your javascript implementation is completely evil?

This file will explain all the progress I've made

## What is JSFuck

> __JSFuck__ is an esoteric subset of the JavaScript language that uses only six distinct characters in the source code. The characters are `+`, `!`, `(`, `)`, `[`, and `]`.
> - https://esolangs.org/wiki/JSFuck

## The characters

All the characters are super useful.

For starters, the characters `[]` are not only used to [create an array](https://tc39.es/ecma262/#sec-array-initializer-runtime-semantics-evaluation)
but also to [access properties](https://tc39.es/ecma262/#sec-property-accessors) `[].flat --> []["flat"]`

`()` is used to call functions and to group things (although grouping can also be done by an array: `[value][0]`)

`+` is both a binary operator (which does [numeric addition and string concatenation](https://tc39.es/ecma262/#sec-addition-operator-plus))
and a unary operator which does [number conversion](https://tc39.es/ecma262/#sec-unary-plus-operator)!

`!` just does [boolean conversion/negation](https://tc39.es/ecma262/#sec-logical-not-operator).
Other [more powerful characters have been suggested for boolean conversion](https://github.com/aemkei/jsfuck#booleans), but here `!` is used.

## The beginning

<details>
  <summary><code>+[]</code> gets <code>0</code></summary>

> `[]` is converted to a number, so `0`. But if you want unnecessary detail:
>
> Since `[]` is an object, `ToNumber([])` is `ToNumber(ToPrimitive([], number))`\
> `ToPrimitive` with flag `number` calls `valueOf` then `toString`.
> 
> Since `[].valueOf` comes from `Object.prototype.valueOf` which returns `ToObject(this value)` (an object), 
> `[].toString` is called, and `Array.prototype.toString` returns `this.join()` which returns `""` for an empty array.
>
> And strings are turned into numbers by trying to parse it as a `StringNumericLiteral` (if errors, NaN)
>
> And the `StringNumberValue` of a `StringNumberLiteral` only consisting of optional whitespace is __+0__ (positive zero, because javascript numbers are double precision.)

</details>

<details>
  <summary><code>![]</code> gets <code>false</code>, and therefore <code>!![]</code> gets <code>true</code></summary>

  `ToBoolean(some object)` gets __true__

</details>

<details>
  <summary><code>[][[]]</code> gets <code>undefined</code></summary>

  `[][[]]` is the same as `[][""]` because there's string conversion.

</details>

And `+undefined` gets `NaN`

## Simple numbers

`+true` gets `1`

`1+1` gets `2`

And so, now we can get any positive integer by just adding enough... `1`

But that's soooo inefficient, it's screaming for optimization:

`!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![]`\
`aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`

Luckily we can _[add the digits together as a string](converting-to-strings)_: `ToString(1) + ToString(0) --> "1" + "0" --> "10"`\
and _convert that into a number_: `+"10" --> 10`

Wow\
`+(+!![]+[+[]])`

## Strings

### Converting to strings

`a + b`:

1. If both `a` and `b` are numbers, numeric addition happens
2. Else the arguments are converted to strings and string concatenation happens

Wow, if you add an array to something, that's basically the same as converting it to a string!

So now all of the following strings are possible:

- `"0"` (and all the other digits)
- `"false"`
- `"true"`
- `"undefined"`
- `"NaN"`

### Get a specific character in a string

Get the 1st letter of `"false"` like so: `"false"[0]`\
Get the 2nd letter of `"false"` like so: `"false"[1]`\
And so on

No need to repeat for all the other characters.

So yeah, we can get any character in `false`, `true` `undefined`, and `NaN`, as well as the digits 0 to 9.

Summary: `falstrundiN0123456789`

## More number shenanigans

You can turn the string `"1e100"` into a number, and then back into a string, getting `"1e+100"`.\
The plus sign doesn't seem to be very useful but it still counts!

Slightly more useful is `+"1e1000"`, which in javascript is `Infinity`. So that gives two more characters: `Iy`

"11e20" becomes `1.1e+21` giving `.`

".0000001" becomes `1e-7` giving `-`

Summary: `+-.0123456789falsetrundiyNI`

## Barely possible

Strings and numbers are maxed out

The only thing to do now is access methods like `[]["flat"]`

I wrote something that checks if we can make a certain string:

```js
let canChars = "+-.0123456789INadefilnrstuy"

function canMakeProperty(str) {
    for (const char of str)
        if (!canChars.includes(char))
            return false

    return true
}
```

And something that returns all the properties we can access:

```js
function props(obj) {
    const poss = Object.getOwnPropertyNames(obj).filter(prop => canMakeProperty(prop))
    const prototypeOf = Object.getPrototypeOf(obj)
    if (prototypeOf !== null)
        return { poss, proto: props(prototypeOf) }
    else
        return { poss }
}
```

I checked an array `[]`, a boolean `false`, a number `0`, a string `""`, and a function `[]["fill"]`:

```rust
props([])
| proto.poss: fill find entries filter flat at
props("")
| proto.poss: at

All other `poss` arrays were empty.
```

Unbelievably, every possible method here is currently useless. Except one

`[]["entries"]() + []` becomes `"[object Array Iterator]"`

Summary: ` +-.0123456789AIN[]abcdefijlnorstuy`
New: ` A[]bcjo`

## Constructor

Now that there's `c` and `o`, we can access `Array`, `String`, `Number` etc., by doing `[]["constructor"]`

## Challenge

At this point, you could do `Number+[]` to access "m" or something. And even run arbitrary code with `Function(arbitrary code)()`

Unfortunately this is where "completely evil javascript implementation" comes in. 

> 3. If _func_ is a [built-in function object](https://tc39.es/ecma262/#sec-built-in-function-objects),
> return an [implementation-defined](https://tc39.es/ecma262/#implementation-defined) String source code representation of _func_.
> This function must have the syntax of a _[NativeFunction](https://tc39.es/ecma262/#prod-NativeFunction)_
>
> https://tc39.es/ecma262/#sec-function.prototype.tostring

Implementations don't _have_ to return `"function String() { [native code] }"`.\
They're allowed to put any whitespace they want! \*at the beginning, between the tokens, or after the tokens.

<details>
  <summary>Definition of whitespace</summary>

  Whitespace is defined as `U+0009 TAB` `U+000B VT` `U+000C FF` `U+FEFF ZWNBSP` or any Unicode "Space Separator" code point:

  - Space (SP)
  - No-Break Space (NBSP)
  - Ogham Space Mark
  - En Quad
  - Em Quad
  - En Space
  - Em Space
  - Three-Per-Em Space
  - Four-Per-Em Space
  - Six-Per-Em Space
  - Figure Space
  - Punctuation Space
  - Thin Space
  - Hair Space
  - Narrow No-Break Space (NNBSP)
  - Medium Mathematical Space (MMSP)
  - Ideographic space

  `"\t\v\f\ufeff\u0020\u00a0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000"` looks like `	﻿                　` in markdown.
</details>

As for executing arbitrary code using `Function`, that's basically the same as `eval`.

Using https://tc39.es/ecma262/#sec-hostensurecancompilestrings browsers can comply with content security policies.

The only other way to get `"m"` from `Number` is `Number.name`, which... requires `"m"`.

Another unsupported thing of note is that there are many legacy features like `"".bold` which only exist in implementations because of legacy usage.

The section is called [Additional ECMAScript Features for Web Browsers](https://tc39.es/ecma262/#sec-additional-ecmascript-features-for-web-browsers),
and it says "Programmers should not use or assume the existence of these features and behaviours when writing new ECMAScript code"

So that's the challenge - make as many more characters as possible! So far I've only got ",O", but hopefully others can figure something out.

## Current possible

Array

1. isArray
2. of

Array.prototype

1. constructor
2. at
3. concat
4. entries
5. fill
6. filter
7. find
8. flat
9. includes
10. join
11. reduce
12. slice
13. sort

Boolean.prototype, Number.prototype, Object.prototype

1. constructor

Function.prototype
> Note: [Function#caller is deprecated](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/caller)

1. constructor
2. bind
3. call

Number

1. isNaN
2. NaN

Object

1. is
2. seal
3. create
4. entries

String.prototype

1. constructor
2. at
3. concat
4. includes
5. slice

## Comma

`[[]]["concat"]([[]])+[]`

## "O"

`("00"+[]["entries"]()["constructor"]())["10"]`

## Calling a function with 2 arguments

(or really arg1, arg2, 1, \[arg1, arg2])

`[arg1]["concat"](arg2)["reduce"](func)`
