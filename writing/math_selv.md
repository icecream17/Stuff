# Trying to get AI to prove something

The AI is not very good at analysis, it seems. I didn't realize I needed to write Continue 2 until I tried to explain how to do it myself.

## Prompt 1

Let `(I poly R)` be the polynomial algebra over the commutative ring `R`, with `I` being the set of variables. The base set of the polynomial are the finitely supported functions of the form `((variables -> powers) -> coefficients)` i.e. `((I -> nonnegative integers) -> R)`. `(variables -> powers)` can be understood as a "bag of variables". Let `eval(P)`, where `P` is a polynomial, convert P into a function `((variables -> assignments) -> evaluation of P with assignments)` i.e. `((I -> R) -> R)`. Let `(I var R)(x)` where `x in I` convert a variable into the polynomial (in `(I poly R)`) of that variable. Let `(scalarToVector (I poly R))(r)` where `r in R` convert a constant into the polynomial of that constant. Finally let `(select J from I; R)(F)` convert a polynomial in `(I poly R)` into `(J poly (I-J poly R))`; in other words it selects certain variables outwards to potentially be evaluated first. It does this by converting F from a polynomial in `(I poly R)` to `(I poly (J poly (I-J poly R)))` [by composing F with  `scalarToVector`. `scalarToVector` converts `R -> (I-J poly R) -> (J poly (I-J poly R))`, then this is composed with F (which is in the form `bags -> R`) thus creating `bags -> (J poly (I-J poly R))`] Taking this new polynomial `H`, we have`eval(H)(A)` where `A(i in I) = if i in J then (J var (I-J poly R)))(i) else (scalarToVector (J poly (I-J poly R)))((I-J var R)(i))`, thus `(select J from I; R)(F) = eval(H)(A)` is defined.

Prove in detail, step by step, using the definitions explicitly, that given some assignments `A_1(i in J) -> R` and `A_2(i in I-J) -> R`, that `eval(eval((select J from I; R)(F))(A_1))(A_2) = eval(F)(A_1 union A_2)`

## Continue 2

Indeed one can see how the definition works on a higher level, but that's not enough detail to prove it to satisfaction right now. Essentially the issue is representable with a commutative diagram in the category of sets; the two paths are provably going to a value in the same end structure `R`, but it is not explicitly obvious that the resulting values in `R` would be equal, because `((variables -> assignments) -> evaluation)` is not a homomorphism.

The first step would be to expand `eval((select J from I; R)(F))(A_1)` into `eval(eval(F lifted to J poly I-J poly R)(i in I |-> if i in J, corresponding variable of J poly I-J poly R, else "constant" (I-J poly R) in J poly I-J poly R))(A_1)`. I see we cannot really manipulate the evals other than abstractly, so we'll have to expand those too. We can manipulate sums and products, after all. Let `(I m> R)` be the set of functions `I -> R` and `((I m> R) s> R)` be the "power structure" of functions `((I m> R) -> R)` where `(I m> R)` is like an index set, and addition and multiplication are defined component wise.

Let `sum_T(F)` be the sum of multiple values in a structure `T`, and `prod_T(F)` be the product of multiple values in a structure `T`. Given the above `s>` structure, we can sum and product the `((variables -> assignments) -> evaluations)`s directly. For brevity the `_T` will be omitted since the structure can be deduced. Incidentally, `(x in S |-> y)` defines a function `f(x in S) = y`. Given a function `(indices -> T)`, where the set of indices is finite and `T` is commutative so we don't worry about order and just pretend the indices are like the integer indices, the sum or product of that function is the addition or multiplication of each element in the order of the indices.

`eval(P)` is in full `(I eval R)(P) = (sum (b in (variables -> powers) |-> P(b) scalar times (product (i in I |-> (a in (variables -> assignments) |-> a(i)^b(i))))`. It can be shown that the structures of the product and the sum within this equation are `((I m> R) s> R)`.

So, expanding the evals, produce a final complicated equality, and prove accordingly.

## Comment 2

```
Goal: eval(eval((select J from I; R)(F))(A_1))(A_2) = eval(F)(A_1 union A_2)

(select J from I; R)(F)
= eval(F lifted to I poly J poly I-J poly R)(i in I |-> if i in J, corresponding variable of J poly I-J poly R, else "constant" (I-J poly R) in J poly I-J poly R)
= (sum (b in (variables I -> powers) |-> (F lifted to I poly J poly I-J poly R)(b) scalar times
                                       (product (i in variables I |-> (a in (variables -> assignments J poly I-J poly R) |-> a(i)^b(i))))
  (i in I |-> if i in J, corresponding variable of J poly I-J poly R, else "constant" (I-J poly R) in J poly I-J poly R)



eval(F)(A_1 union A_2) =
  (sum (b in (variables I -> powers) |-> F(b) scalar times
                                         (product (i in variables I |-> (a in (variables I -> assignments R) |-> a(i)^b(i))))
  (A_1 union A_2)


ok evlsvval but evlsvvval and pwsgsum is needed
```

