# fundamental types

These are the core types in js.

Along the way, syntax for "the ActualTypes language" will be introduced

## types are sets

```ts
let variable: type = value
```

Types are notated similarly to TypeScript. However they are sets.

Therefore, set notation with a comma-separated list of values can be used:
`{{ a, b, c, ..., n }}` is the type that is the set of values `{ a, b, c, ..., n }`

`|` is the operator for the union of types, `&` is the operator for the intersection of types,
and `\-` is the operator for the set difference of types (which kinda corresponds to `Exclude` in TypeScript)

Operator precedence:

1. `\-`
1. `&`
1. `|`

Parentheses can always be used to break operator precedence.

## language types

Language types are types that a javascript developer can directly manipulate, in contrast to
specification types which are used internally in the specification.

### the undefined value

`undefined` is a value in javascript.

The undefined type is notated `{{ undefined }}`

When declaring a value represented by a keyword, the following syntax is used:

```acts
declare value undefined
```

### the null value

`null` is a value, its type is notated `{{ null }}`

```acts
declare value null
```

A value is nullish iff it is `null` or `undefined`.

We define the `nullish` type using the usual typescript syntax

```acts
type nullish = {{ null, undefined }}
```

### the boolean type

`true` and `false` are two values which collectively form the `bool` type

```acts
declare value true
declare value false
type bool = {{ true, false }}
```

### the string type

> The _String type_ is the set of all ordered sequences of zero or more 16-bit
> unsigned integer values ("elements") up to a maximum length of 2^53 - 1 elements.
> - <https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-string-type>

At this point we introduce a few more notations.

#### functions

```
[ infix | prefix ]? (name | _)::<(name (where condition)? | value name (in type | where condition)?),> where condition = expression
```

Functions are defined with generic type syntax. Their argument names are in `::<>`, which is also how these functions are called.
This can be changed with the keywords `prefix` or `infix` when there is one or two arguments respectively.

```acts
prefix not::<value A in bool> = A in {{ false }}
infix and::<value A, value B> where A in bool where B in bool = not false in {{ A, B }}
infix or::<value A, value B> where A in bool and B in bool = true in {{ A, B }}
infix eq::<value A, value B> = A in {{ B }}
```

Here, the `in` operator is magically defined such that `value in type` when the value is in the set that is the type.

Arguments are unrestricted types by default, but they can become values with the `value` keyword.

The `in` syntax for restricting values is also intuitive. There is also the `where` syntax which also restricts the domain (possible arguments).

Finally, after the equals sign is the expression that the result evaluates to.

#### class abstractions

A class abstraction is notated as such: `{{ variable | condition }}`

```acts
axiom <value A>: A in {{ B | condition }} eq (_::<value B> = condition)::<A>

infix \- <A, B>: {{ x | x in A and not x in B }}
infix & <A, B>: {{ x | x in A and x in B }}
infix | <A, B>: {{ x | x in A or x in B }}
```

It is the set of all values where, if that value replaced the variable in the condition, that value would be true.

So for example, `{{ x | x in boolean or x in nullish }}` is the same as `boolean | nullish`.

`value in type` iff the value is an element of the set that is the type.

Logcial operators between boolean expressions (`and`, `not`, `or`) are self explanatory.

Note that the result of boolean expressions are the actual boolean values.

Operator precedence:

1. `not`
1. `and`
1. `or`

#### real numbers

We have

```acts

```

