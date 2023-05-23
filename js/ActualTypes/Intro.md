# JS Types

<!--
12345678901234567890123456789012345678901234567890123456789012345678901234567890
-->

TypeScript does not aim to be completely accurate,
rather it tries to be as helpful as possible.

But if you were to try to make types "as accurate as possible",
what would they be like?

Using [the EcmaScript specification](https://tc39.es/ecma262/multipage/),
it is not only possible to create super accurate types but theoretically,
prove what js code does (instead of mere testing).

## Sets, types, and values

A set is a collection of (unique, unordered, and unindexed) elements.

For example, the set of `2` and `3` looks like: `{ 2, 3 }`

The set of all primes is `{ 2, 3, 5, 7, 11, 13, 17, ... }`

And the set with no elements is `{}`

Since elements are unique, `{ 2, 3 } = { 2, 3, 3 }`, and since they're
unordered, `{ 2, 3 } = { 3, 2 }`

Types can be thought of as sets of values. For example, the `number` type is
the set of all javascript numbers, and the `null` type has only one element:
`{ null }`

> https://en.wikipedia.org/wiki/Set_(abstract_data_type)
> https://en.wikipedia.org/wiki/Set_(mathematics)

## Prelude

Euclid would start from a few postulates and construct several theorems about
what is now as Euclidean Geometry. The foundations of mathematics begins with
very very very simple things, like addition, the `+` sign.

Today, mathematicians have all of history's knowledge to use. New proofs build
upon less new proofs, and those proofs are built upon older proofs, which
depend on yet more proofs, and down the line until the super simple assumptions
which are so obvious they don't need proof.

But notice that [Euclid's _Elements_ don't start with numbers, but rather with points and lines](http://aleph0.clarku.edu/~djoyce/elements/bookI/bookI.html).
And other fields like physics, number theory, and calculus sprang about, all
with their different foundations. There wasn't really any given set of
assumptions that would prove all of mathematics.

And so the attempts to reduce math to _logic_ and _set theory_ began.

And in 1901, Bertrand Russell discovered a contradiction in unrestricted set
theory:

> Say you can make ` R `, the set of exactly all sets that **don't** contain
> themselves.
>
> Is ` R ` in ` R `?

And thus began type theory.

