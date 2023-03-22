# Almost

Based on https://www.youtube.com/watch?v=EymVXkPWxyc

> Fermat's Last Theorem states that no three positive integers $a$, $b$, and $c$
> satisfy $a^n + b^n = c^n$ for any integer value of $n$ greater than 2.
>
> https://en.wikipedia.org/wiki/Fermat%27s_Last_Theorem

We have

- a is an integer > 0
- b is an integer > 0
- c is an integer > 0
- n is an integer > 2
- a^n + b^n = c^n

If a, b, c, n satisfies the above conditions, it is notated here as (a b c FLT n)

## Without loss of generality, let $a \le b$

Since addition is commutative
- b^n + a^n = c^n

$a \le b$ or $b \le a$. so (a b c FLT n) or (b a c FLT n) satisfies this property.

## a < b

If a = b, then c^n = a^n + a^n = 2 * a^n

So c = 2^(1/n) * a

But 2^(1/n) is irrational.

## a < b < c

`a` and `b` are positive, so their sum is greater than both.

(This ignores the powers, which don't affect anything. Dealing with them is left as an exercise to the reader.)

## And now: $a > n$

$$ \text{We have: } a, b, c \in \mathbf{N}, a \le b < c, 2 < c $$

```math
\begin{align}
a^n + b^n &= c^n \\
\\
a^n &= c^n - b^n \\
    &= (c-b) \sum_{i=1}^{n}c^{n-i}b^{i-1} \\
    &> (c-b) \sum_{i=1}^{n}a^{n-i}a^{i-1} \\
    &= (c-b) \sum_{i=1}^{n}a^{n-1} \\
    &= (c-b) na^{n-1} \\
\\
a &> (c-b) n \\
  &> n
\end{align}
```

In the sum, instead of replacing `c` and `b` with `a`, replacing with `b` gets

$$
\begin{align}
a^n &> (c-b) nb^{n-1} \\
    &> nb^{n-1} \\
a   &> (c-b)^{\frac{1}{n}} n^{\frac{1}{n}} b^{\frac{n-1}{n}}
\end{align}
$$

Note that c-b is at least 1. Looking at desmos, [this is an extremely close bound](https://www.desmos.com/calculator/5ypr2kxbfu).

An ever closer bound is

```math
\begin{align}
a^n &= c^n - b^n \\
    &= (c-b) \sum_{i=1}^{n}c^{n-i}b^{i-1} \\
    &= (c-b) \sum_{i=1}^{n}{\frac{c}{b}}^{n-i}b^{n-i}b^{i-1} \\
    &= (c-b) \sum_{i=1}^{n}{\frac{c}{b}}^{n-i}b^{n-1} \\
    &= (c-b) nb^{n-1} \sum_{i=1}^{n}{\frac{c}{b}}^{n-i} \\
    &> (c-b) nb^{n-1} n \\
    &= (c-b) b^{n-1} n^2 \\
\end{align}
```

c > b, so $\frac{c}{b} \ne 1$

Therefore, based on https://www.math.cmu.edu/~mlavrov/arml/13-14/sums-01-26-14.pdf

$$
\begin{align}
\sum_{i=1}^{n}{\frac{c}{b}}^{n-i} &= \sum_{i=0}^{n-1}{\frac{c}{b}}^{i} \\
                                  &= \frac{{\frac{c}{b}}^n - 1}{\frac{c}{b} - 1} \\
                                  &= \frac{b{\frac{c}{b}}^n - b}{c-b}
\end{align}
$$

And an even stricter bound is

```math
\begin{align}
a^n &= c^n - b^n \\
    &= ... \\
    &= (c-b) nb^{n-1} \sum_{i=1}^{n}{\frac{c}{b}}^{n-i} \\
    &= (c-b) nb^{n-1} \frac{b{\frac{c}{b}}^n - b}{c-b} \\
    &= nb^{n-1}b({\frac{c}{b}}^n - 1) \\
    &= nb^n({\frac{c}{b}}^n - 1)
\end{align}
```

