# False proofs of Fermat's Last Theorem

## arxiv

+ https://arxiv.org/abs/math/0309005
  p6: "The lengths of three borders of the triangle are respectively the lengths of the edges of three n-dimensional cubes"
  is false. You prove earlier in the paper that the relevant angle must be less than 90deg, and start even earlier with the
  **volumes** of the cubes not the edge lengths, so nothing in the paper could even imply this to be true.

  Even if this was fixed, the proof is so informally presented without clear logical steps that it is quite incomprehensible.

## icecream17

+ https://github.com/icecream17/Stuff/blob/main/fltalmost.md
  When $n, x, y, z \in \mathbb{N}$ with $2 < n$ and $x^n + y^n = z^n$, we have $n < x$. Extending this to rationals we get $(\frac{x}{z})^n + ... = 1^n$
  and therefore $n < \frac{x}{z}$ but $\frac{x}{z} < 1$. Of course, we can't extend this to rationals.
+ $x^4 + y^2 = z^4$ implies the characterization $x^2 = m^2 - n^2$ and $z^2 = m^2 + n^2$, and after multiplying we get
  $n^4 + (xz)^2 = m^4$. Notably, the multiplication works in general for any power. The incorrect proof assumed we could
  generalize the characterization too, and ultimately get $x^\text{even} + y^2 \ne z^\text{even}$ for odd $x$, which proves FLT. 
