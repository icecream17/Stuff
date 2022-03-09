# JS Types

<!--
12345678901234567890123456789012345678901234567890123456789012345678901234567890
-->

TypeScript does not aim to be completely accurate,
rather it tries to be as helpful as possible.

But if you were to try to make types "as accurate as possible",
what would they be like?

Based on [the EcmaScript specification](https://tc39.es/ecma262/multipage/)

## Overview

This guide assumes you are familiar with TypeScript and its syntax.

TypeScript isn't powerful enough to describe Javascript's true types,
but it gets a decent way there, so the _just invented_ TrueTS
is based off of TypeScript.

Syntax will be introduced as we go along.

```ts
// Just some general examples
// More on all of these later

// TrueTS is made of type and variable declarations

// type: alias
type OffBit = 0
type OnBit<UnusedGeneric> = 1

// type: object shape
// generics, more property types not shown
interface Unnecessary {
   value: OffBit
}

// variable: object shape
const currentPoints: Unnecessary = {
   value: 0
}

// variable: function
// arrows, stars, async, and more not shown
// function <generics> (params): return type
function example<T>(arg: T): T

// variable: class
// generics, fields, methods not shown
class CustomMap extends WeirdProxyThing implements RandomWorkaroundInterface {}

// variables become type declarations using "declare"
// type: function
declare function example<T>(arg: T): T
```

### Set theory

A variable's type === its [set](Set) of possible values

```js
const hmm = Number.isNaN(something)
```

So here, the variable `hmm` can either be `true` or `false`.

Its "set of possible values" === `{ true, false }` === `boolean`.

Now the reason I bring up set theory is that it makes some things
so much easier to think about:

```ts
// This is the empty set, {}
never

// Set of everything except the empty set
unknown

// Introducing "not", logical negation
not T === set of everything that is not T
not never === unknown
not unknown === never
not not T === T

// Introducing "and", conjunction
A       === set of everything that is an element of A
A and B === set of everything that is an element of both A and B
A & B   === A and B

// For better understanding
// See the venn diagrams on wikipedia
// https://en.wikipedia.org/wiki/Truth_function#Table_of_binary_truth_functions

// "or", disjunction
// { ...A, ...B }     where A and B are sets
A or B === A | B

// "xor", exclusive disjunction
// { ...A, ...B } & not ( A & B )
A xor B // A or B but not both

// "elof", true where A is an element of B, false otherwise.
A elof B

// "is", same as "elof"
// So I guess "elof" is used for emphasizing the set theory.
A is B

// "is exactly", whether A and B are exactly the same sets
A is exactly B

// Note that singular values are also sets, they're called singletons.
0 elof 0

// See where this is going? (This one is sometimes true and sometimes false)
1|2 elof 2|3
```

### Primitive types

Now that theory is done, let's introduce the primitive types:

```ts
// Singleton types
undefined
null

// { true, false }
boolean

// singleton numbers
NaN
Infinity
-Infinity

// set of numbers, specifically double-precision floating-point numbers
// where all NaNs are the same
// 2^64 - 2^53 + 3 elements (2^53 - 2 would be NaN)
number

// floating-point integer
numint

// the integers (arbitrary precision)
bigint

// ecma262:
// the set of all ordered sequences of zero or more 16-bit unsigned ints,
// up to a maximum length of 2^53 - 1 elements.
string

// set of non-string property keys
symbol

// Primitive values
undefined
null
"string"
102
904n
Symbol("23")

// Symbols and objects are unique...
Symbol("23") !== Symbol("23")

// but there can be multiple references to the same one.
Symbol.iterator === Symbol.iterator

// To lessen floating point ambiguity, you can use this utility function:
function represent(num: number) {
   const sign = num > 0 || Object.is(num, 0) ? "+" : "-"
   if (num === 0) return `${sign}0`

   let power = 0n;
   for (; !Number.isInteger(num); power++) num += num;
   for (; Number.isInteger(num / 2); power--) num /= 2;

   if (power === 0n) return `${sign}${num}`;

   const expOp = power > 0n ? "/" : "*"
   if (power > 0n) power = -power
   if (power === 1n) return `${sign}${num}${expOp}2`
   return `${sign}${num}${expOp}2**${power}`
}

// Which gives representations like:
+3602879701896397/2**55 // 0.1
+3602879701896397/2**54 // 0.2
+5404319552844595.5/2**54 // 0.1 + 0.2 (actual)

+5404319552844596/2**54 // 0.1 + 0.2 (ecmascript uses RoundTiesToEven)
+5404319552844595/2**54 // 0.3
```

### Error handling

Beyond primitive types, beyond objects and functions, are specification types:

Luckily I don't have to explain them.

The specification guarantees that specification and implementation defined
functions always return or throw (not break or continue)

So the only addition to TypeScript is that functions can throw:

```ts
function notImplemented(): throws "Not implemented!"
```

And when referencing or calling something throws, it bubbles up:

```ts
a.b // Say this is `throws false`
a.b is false // `throws false`
a.b ? true : false // `throws false`
someBool ? a.b : true // `throws false | true`
```

Edit: I actually do have to explain lists and specification fields.

Lists are ordered collections of values, similar to Arrays:
```ts
《 arg1, arg2 》
```

Specification fields are like properties but only the specification
can directly access them.

```ts
{
   [[Get]](P, T): V
   [[Prototype]]: Object:: // short for Object.prototype
}
```

The "has" keyword checks if something has a property or field:
```ts
example has "toString"
example has Symbol.iterator
example has [[Prototype]]

// It can also define the set of values where "val has propertyOrField" is true:
has "valueOf"
has Symbol.toStringTag
has [[Call]]
```

### Yet another group of syntaxes

Type coercion (the next section) is so complicated that multiple new syntaxes
need to be introduced!

First is "match", similar to "switch...case" but without fallthrough:

It's shorthand for conditionals.

```rust
// Taken almost directly from rust, evaluates to the first matched arm
// Also similar to set-builder notation
match val {
   undefined => "undefined"
   boolean => "boolean"
   string => "string"
   number => "number"
   symbol => "symbol"
   bigint => "bigint"
   null => "object"
   object => val has [[Call]] ? "function" : "object"
}

// Oh I forgot to explain conditionals
condition ? A : B
// if condition then A else B

// If that match statement was done using conditionals, yikes
// Note that functions are just objects that have [[Call]]
\function = object & has [[Call]]

// And constructors have [[Construct]] as well
\constructor

// Many JS operators are supported
new Boolean(7)
```

Second is "temp", the temporary variable.
"temp" is scoped to the current expression and optionally ends
with an unescaped comma operator followed by another expression.

```ts
type Example<T> =
   temp = T + 1,
   temp is string
      ? temp = "doesn't affect upper temp"
      : 2
```

There can be multiple temp variables, as long as they start with :

```ts
temp1 = A.b
temp2 = B.b
```

And third are the prototype shorthands
```ts
Object:: // is short for Object.prototype
Object::toString // is short for Object.prototype.toString
Object {} // is short for { [[Prototype]]: Object:: }
```

And fourth are regexes.

### Type coercion

JS is famous for its type coercion.

```ts
type NumberZero = 0 | -0
type Zero = 0 | -0 | 0n
type Nullish = undefined | null
type Falsy = undefined | null | false | Zero | NaN | ""
type Truthy = not Falsy
type Primitive = not object
type PropertyKey = string | symbol

type Get<O: object, P: PropertyKey> = O.[[Get]](P, O)
type GetV<V, P: PropertyKey> = Get<ToObject<V>, P>
type GetMethod<V, P> =
   (temp = GetV<V, P>) is Nullish
      ? undefined
      : IsCallable<temp> ? temp : throws TypeError
type Call<F, This, Args =《 》> =
   IsCallable<F> ? F.[[Call]](This, Args) : throws TypeError

// Probably designed "and" wrong...
type IsCallable<V> = V is \function

type ToBoolean<V> = V is Truthy

type ToNumber<V> = match V {
   undefined => NaN
   null | false => 0
   true => 1
   number => V
   string => _StringToNumber<V>
   bigint | symbol => throws TypeError
   object => ToNumber<ToPrimitive<V>>
}

type _StringToNumber<S: string> = _TrimmedStringToNumber<S.trim()>
type _TrimmedStringToNumber<S: string> = _ParseSign<S, _PositiveTrimmedStringToNumber>
type _ParseSign<S: string, Inner<S2: string>> =
   _StartsWith<S, "-">
      ? -Inner<S.slice(1)>
      : Inner<_StartsWith<S, "+"> ? S.slice(1) : S>
type _PositiveTrimmedStringToNumber<S: string> = match S {
   "" => 0
   "Infinity" => Infinity
   _IntStr => numint
   S is _OtherNumberStr => number & not NaN & not Infinity & not -Infinity & not numint
   string => NaN
}
type _NumberString = `${"" | "-"}${"Infinity" | _IntStr | _OtherNumberStr }`
type _StartsWith<S, C: string> = S is `${C}${string}`
type _Multi<C: string, Max=2^53-1, Count = 0> = Count >= Max ? "" : C | `${C}${_Times<C, Max, Count+1>}`
type _Base<F: string, C: string> = string & `0${F}${_Multi<C>}`
type _BinStr = _Base<"b" xor "B", "0" | "1">
type _OctStr = _Base<"o" xor "O", one of "0" "1" "2" "3" "4" "5" "6" "7">
type _HexStr = _Base<"x" xor "X", one of "0" "1" "2" "3" "4" "5" "6" "7" "8" "9" "a" "b" "c" "d" "e" "f" "A" "B" "C" "D" "E" "F">
type _DecStr = _Multi<one of "0" "1" "2" "3" "4" "5" "6" "7" "8" "9"> = `${numint}`
type _IntStr = _DecStr | _BinStr | _OctStr | _HexStr | _DecStr + "." + _Multi<"0">
type _OtherNumberStr = (`${"" | _DecStr}${"" | "." + _DecStr}` and not "") + ("" | ("e" | "E") + _DecStr)

type ToNumeric<V> =
   temp = ToPrimitive<V>,
   temp is bigint ? temp : ToNumber<V>

type ToObject<V> = match V {
   undefined | null => throws TypeError
   boolean => Boolean { [[BooleanData]]: V }
   number => Number { [[NumberData]]: V }
   string => String { [[StringData]]: V }
   symbol => Symbol { [[SymbolData]]: V }
   bigint => BigInt { [[BigIntData]]: V } 
   object => V
}

type ToPrimitive<V, Preferred: "number" | "string" | "default" = "default"> =
   V is object
      ? temp = GetMethod<V, Symbol.toPrimitive>,
        temp is undefined 
         ? _OrdinaryToPrimitive<V, Preferred>
         : temp = Call<temp, V,《Preferred》>,
           temp is object ? throws TypeError : temp
      : V

type _CallIfMethodElse<O, P, E> =
   temp = Get<O, P>,
   IsCallable<temp> ? Call<temp, O> : E
type _ToPrim<A, B> =
   temp = _CallIfMethodElse<O, A, _CallIfMethodElse<O, B, throws TypeError>>,
   temp is object
      ? throws TypeError
      : temp
type _OrdinaryToPrimitive<V, P> =
   P is "string"
      ? _ToPrim<"toString", "valueOf">
      : _ToPrim<"valueOf", "toString">
```

### JS operators

TrueTS supports most javascript operators, although some are escaped:

```ts
// ternary conditional
A ? B : C

// the above is implicitly
ToBoolean<A> ? B : C

// binary operators
// numeric operators are as such:
//   temp1 = ToNumeric<A>,
//   temp2 = ToNumeric<B>,
//   temp1 is number & temp2 is bigint ? throws TypeError :
//   temp2 is number & temp1 is bigint ? throws TypeError : temp1 op temp2

A <binop> B
   where <binop> ===
     \,
     &&        // A ? B : A
     ||        // A ? A : B
     ??        // A is Nullish ? B : A
     \&
     \^        // bitwise xor is escaped for consistency
     \|
     !=
     ==
     !==       // !(A === B)
     ===       // A is B && B is A ? (A is not NaN) | (A is object | symbol) : A is NumberZero && B is NumberZero
     <=
     >=
     \<
     \>
     <<
     >>
     >>>       // bigint, throws TypeError
     +         // temp1 = ToPrimitive<A>, temp2 = ToPrimitive<B>, temp1 is string or temp2 is string ? `${ToString<temp1>}${ToString<temp2>}` : numeric code above
     -
     *
     /         // bigint, if B is 0n, throws RangeError
     %         // bigint, if B is 0n, throws RangeError
     **        // bigint, if B < 0n, throws RangeError
     \in
     \instanceof

\void   // A\,undefined
\typeof // See match intro
+A
-A
~A
!A.     // ToBoolean<A> is false ? true : false

// Special, same as JS, maybe not the same as TS.
A.prop
A["prop"]
A(arg)
new A(arg)

// There's the "sets" and "to" keyword
sets x.name to "bacon " + x.name

// The comma operator exists and has the lowest precedence:
sets x.value to 0\, "success"

// The bacon one evaluates to `bacon ${x.name}` so this isn't necessary:
sets x.name to "bacon " + x.name\, `bacon ${x.name}`

// Now for the assignments:
A <binop> B
   cases
   \=   set A to B
   <>=  set A to A <> B
           where <> is one of: ** * / % + - << >> >>> \& \^ \|
           but bitwise before equals is unescaped.
   &&=  A ? set A to B : A
   ||=  A ? A : set A to B
   ??=  A is Nullish ? set A to B : A
```

### More grammar explanation

```ts
// Some types are implementation defined or host defined or somehow intrinsic
envcustom
intrinsic

// define types:
type /* name <generics>? */ = /* type */

// define functions:

// just like typescript
function name (): 0;

// but note arrow functions are different than non-arrow functions!
// Well, the only difference is that <ThisMode> is %lexical%
// So for example Function::bind doesn't change what `this` is.
() => 0

// If it doesn't matter then (:> looks terrible)
() -> 0

// If it captures some variables write those down as well
// These are equal:
type test = typeof (()=>{let a = 5;return()=>a})()
type test = ()|a: 5| => a

// async and/or generator 
async function* name (): AsyncGenerator<...>
async () => AsyncGenerator<...>; // Arrow functions cannot generator functions


// This is an empty object
{}

// Define properties like so
{
   one: 0
   "has space or d1git": 0
   [Symbol(4)]: 0
   
   func(): 0
   arrowFunc: () => 0
   get ter(): 0
   set ter(_): void
   async * generator(): AsyncGenerator<...>
   
   // Specification fields not viewable unless there's some method
   <Prototype>: Object.prototype // Property access is different
   
   #privateprop: 0
}

// Instead of Something.prototype
Something::

// Instead of defining <Prototype>
Something:: {}

// By default <Prototype> is Object
{}
Object {}

// Forgot to mention arrays
[]
Array {} // No reason to use this

// Some functions change stuff
function defineProperty<O, P, V>(obj: O, prop: P, { value: V }) {
  set O.p to V
}: O

// Classes are the same syntax as objects but with class at the start
class A {}

// and possibly extends
class A extends B {}

// where B is null | Constructor

// Oh yeah, forgot the set theory operators:
0 | 1
{d:2,o:2} & {r:2,d:2}
{d:2,o:2} xor {r:2,d:2}
not 0

// To clarify, imagine a type represents a set of All Possible Values
interface Number {
  isInteger(num: number): boolean
}

// See: MDN Object.defineProperty
// Oh properties can be configurable, enumerable, or writable; so
{
  non?configurable non?enumerable readonly|writable prop: 0
}

enumerable interface A {}

// IMPORTANT
// https://tc39.es/ecma262/multipage/ecmascript-standard-built-in-objects.html#sec-ecmascript-standard-built-in-objects

builtin // There's tons of unbelievable notes like below so this will be handy
        // Whether something is an arrow function or not will be found later

//    Unless otherwise specified in the description of a particular function,
//    if a built-in function or constructor described is given more arguments
//    than the function is specified to allow, the extra arguments are
//    evaluated by the call and then ignored by the function.
//    However, an implementation may define implementation specific behaviour
//    relating to such arguments as long as the behaviour is not the throwing
//    of a TypeError exception that is predicated simply on the presence of
//    an extra argument.

//    NOTE 1
//    Implementations that add additional capabilities to the set of built-in
//    functions are encouraged to do so by adding new functions rather than
//    adding new parameters to existing functions.


//    Every built-in Function object, including constructors, that is not
//    identified as an anonymous function has a name property whose value
//    is a String.
//    Unless otherwise specified, the name property of a built-in Function
//    object, if it exists, has the attributes { [[Writable]]: false,
//    [[Enumerable]]: false, [[Configurable]]: true }.

// Defaults:
// configurable
// enumerable if object or enumerable interface or enum, else nonenumerable
// writable

// See: https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type
eval(): abrupt | stuff // Interestingly, eval can have an abrupt completion that is not throw. So... what now?
                       // `try` stops error propagation but `catch` is not run. Weird.
                       // Luckily this is theoretical, no one would actually do that.
yourFunction(): throws "This will never happen"
```

### Grammar summary

```ts
Statement:
   | TypeDeclaration
   | VariableDeclaration

VariableDeclaration:
   | (var | let | const) Id ColonType? = (see ecmascript AssignmentExpression)

Id:
   see ecmascript BindingIdentifier

ColonType:
   | : Type

Type:
   | one of:
        undefined null true false boolean
        NaN Infinity number numint bigint
        string symbol object \function
        \constructor never unknown

   | not Type
   | Type SetTheoryBinop Type
   | TODO

SetTheoryBinop:
   | one of:
        and & xor or | elof is
```

## Utils

```ts
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

## Constants

```ts
intrinsic MODULE: boolean
intrinsic STRICT_MODE: MODULE ? true : boolean
intrinsic LEGACY_WEB: boolean // https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html#sec-additional-ecmascript-features-for-web-browsers
```

### Actual types (finally)

## globalThis

```ts
// I don't think it gets any wider than this!
type EvalReturn = throws unknown | unknown // | throws SyntaxError | undefined

interface globalThis {
  <Construct>: never
  <Call>: never
  <Prototype>: envdepndt extends Object
  globalThis: globalThis
  nonenumerable nonconfigurable Infinity: Infinity
  nonenumerable nonconfigurable NaN: NaN
  nonenumerable nonconfigurable undefined: undefined
  
  // Eval behaves like an arrow function
  // [eval.bind(7)('this'), (()=>this).bind(7)(), (function(){return this}).bind(7)()]
  builtin eval: (x: unknown) => x is string ? EvalReturn : x
  builtin isFinite(num: unknown) -> ToNumber<num> is not (NaN | Infinity | -Infinity)
  builtin isNaN(num: unknown) -> ToNumber<num> is NaN
  builtin parseFloat(str: unknown) -> ToString<num>.trimStart() is `${_NumberString}${string}` ? number & not NaN : NaN
}
```

## Footnotes

### Set

Datatype: an unindexed unordered collection of unique things
Contrast with array, an indexed collection of possibly non-unique things

I use roster, semantic, and maybe in the future set builder notation.

https://en.wikipedia.org/wiki/Set_(abstract_data_type)
https://en.wikipedia.org/wiki/Set_(mathematics)
