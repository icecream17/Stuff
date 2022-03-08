# JS Types

TypeScript does not aim to be completely accurate, rather it wants to be as helpful as possible.

But if you were to try to make types "as accurate as possible", what would they be like?

Based on [the EcmaScript specification](https://tc39.es/ecma262/multipage/)

## Overview

Syntax will be introduced as we go along,
but this guide assumes you have some experience with TypeScript's syntax:

```ts
// Just some general examples
// More on all of these later

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

The variable `hmm` can either be `true` or `false`.

Its "set of possible values" === `{ true, false }` === `boolean`.

Now the reason I bring up set theory is that it makes clear some types and operators:

```ts
// This is the empty set, {}
never

// Set of everything except the empty set
unknown

// https://en.wikipedia.org/wiki/Truth_function#Table_of_binary_truth_functions
// Introducing "not", logical negation
not T === set of everything that is not T
not never === unknown
not unknown === never
not not T === T

// Note that sets don't have duplicates.
// Introducing "and", conjunction
A       === set of everything that is an element of A
A and B === set of everything that is an element of both A and B
A & B   === A and B

// For better understanding
// See the venn diagrams on wikipedia

// "or", disjunction
// { ...A, ...B }     where A and B are sets
A or B === A | B

// "xor", exclusive disjunction
// { ...A, ...B } & ( not A | not B )
A xor B // A or B but not both

// "elof", true where A is an element of B, false otherwise.
A elof B

// "is", TODO I have no idea what this is anymore
A is B

// Note that singular values are also sets, the set of themself.
0 elof number

// See where this is going? (This one is sometimes true and sometimes false)
1|2 elof 2|3
```

### More types and operators

Done with theory

``ts

// set of numbers (Double-precision floating-point numbers, where there's just one NaN)
// 2^64 - 2^53 + 3 elements (because 2^53 + 2 would be NaN)
number

// floating-point integer
numint

// the integers
bigint

// ecma262: the set of all ordered sequences of zero or more 16-bit unsigned ints,
// up to a maximum length of 2^53 - 1 elements.
string

// set of non-string property keys
symbol

// { true, false }
boolean
```

js operators are just like normal, there's not all of them, and some are escaped:

```ts
A ? B : C
A <binop> B
   where <binop> ===
     &&
     ||
     ??
     \&
     \^
     \|
     !=
     ==
     !==
     ===
     <=
     >=
     \<
     \>
     <<
     >>
     >>>
     *
     /
     %
     **

<unaryop> A
     +
     -
     !          // ToBoolean<A> is false ? true : false


// Primitive values (undefined, null, string, symbol, number, bigint)
undefined
null
"string"
102
904n
Symbol("23")

// Symbols and objects are unique but there can be multiple references to the same one.
Symbol("23") !== Symbol("23")
Symbol.iterator === Symbol.iterator

// To lessen floating point ambiguity, you can use this utility function:
function represent(num: number) {
   let power = 1n;
   for (; !Number.isInteger(num); power++) num += num;

   return `${num}/2^${power}`
}

// Which gives representations like:
1351079888211149/2^53 // 0.1 + 0.2
5404319552844595/2^55 // 0.3

// Some types are implementation defined or host defined or somehow intrinsic
envdepndt
intrinsic

// define types:
type /* name <generics>? */ = /* type */

// define functions:

// just like typescript
function name (): 0;

// but note arrow functions are different than non-arrow functions! 
() => 0

// If it doesn't matter then (:> just... ugh)
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
        // Also I can't tell if these are arrow functions or not.
        // After researching, I'm ... sigh. Let's use ->

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
        string symbol never unknown
  | TODO
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
// abrupt because of ReturnIfAbrupt(https://tc39.es/ecma262/multipage/global-object.html#sec-hostensurecancompilestrings)
// I don't think it gets any wider than this!
type EvalReturn = abrupt | unknown // | throws SyntaxError | undefined

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
  
  // Eval was hard enough. I don't feel like going through ToNumber.
  builtin isFinite: TODO
}
```

## Footnotes

### Set

Datatype: an unindexed unordered collection of unique things
Contrast with array, an indexed collection of possibly non-unique things

I use math notations {roster, set builder} 

https://en.wikipedia.org/wiki/Set_(abstract_data_type)
https://en.wikipedia.org/wiki/Set_(mathematics)
