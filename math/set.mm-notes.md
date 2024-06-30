# set.mm-notes

## Alternate proofs

bicomd: bicom1 syl
neg0: df-neg 0cn subidi eqtri

## Alternate definition of cgt

See https://js.do/celiasnt/altcgt for some proofs, but basically
here's an alternate definition of combinatorial games:

Fgen = rec((x ∈ V ↦ (𝒫 x × 𝒫 x)), ∅)
Fg = { x | ∃y ∈ ω x ∈ (Fgen’y) }

Although it is equivalent to ~ df-pg

### Definition of cgt addition

Much later, I realize that ~ df-setrecs is actually really nice

Here's a definition of addition:

```
+pg = setrecs (
  ( p e. _V |->
    { <. <. u , v >. , y >. | E. a E. b E. c E. d (
      <. u , v >. = <. <. a , b >. , <. c , d >. >. /\
      y = <. ( ran ( z e. a |-> ( z f v ) ) u. ran ( z e. c |-> ( z f u ) ) ) ,
             ( ran ( z e. b |-> ( z f v ) ) u. ran ( z e. d |-> ( z f u ) ) ) >. /\
      ( ( A. z e. a <. z , v >. e. dom p /\
          A. z e. b <. z , v >. e. dom p ) /\
        ( A. z e. c <. z , u >. e. dom p /\
          A. z e. d <. z , u >. e. dom p ) )
    ) }
  )
)
```

### Proof 0A = 0

We have A0 = 0 and 0 + A = A + 0 = 0, so all that remains is 0A = 0

Also, `0a = 0` was proven for reals as follows:

If 0a is not 0, it has an inverse (non-zero reals have an inverse), so we get:

1. (0a)x = 1
2. 2(0a)x = 2
3. 2(0a)x = (0a)x (because 2(0) = 0)

A contradiction!

Unfortunately, non-zero _complex_ numbers do not necessarily have an inverse at the moment.

However, we do have `_i _i _i _i = 1`, so numbers of the form `_i r` have an inverse.

We know `0A = a + _i b`, and `0A has inverse -> 0A = 0`

If either `a` or `b` is `0`, `0A` would have an inverse, so `a` and `b` are non-zero and have inverse.

Finally, `0A = 0` if `0i = 0` since `0A = 0r + 0is`

Now...

```
                                           0i  = a +          ib
                           -a  +           0i  =              ib
                         i(-a) +         i(0i) =             iib
                         i(-a) +           0i  =           (-1)b
 (b^-1)(-1) +  (b^-1)(-1)i(-a) + (b^-1)(-1)0i  = (b^-1)(-1)(-1)b
 (b^-1)(-1) +  (b^-1)(-1)i(-a) +           0i  = 1
0(b^-1)(-1) + 0(b^-1)(-1)i(-a) +          00i  = 01
          0 +           0i(-a) +           0i  = 0

0i(-a)  + 0i     = 0
0(i(-a) +  i)    = 0
0(i(-a) +  i(1)) = 0
0(i(-a  +  1))   = 0

If (-a + 1) has an inverse:
  0i(-a + 1)((-a + 1)^-1) = 0i = 0

So (-a + 1) is 0, and a = 1
```

```
0i = 1 + ib
0i + i(-b) = 1
00i + 0i(-b) = 01
0i + 0i(-b) = 0
0(i(1 + -b)) = 0

Similarly b = 1
```

```
0i = 1 + i1
   = 1 + i

iii0i = iii(1 + i)
      = iii + iiii
      = -i + 1
iii0i = 0i
   0i = -i + 1

0i + 0i = (1 + i) + (-i + 1)
        = 1 + 1
0i(1 + 1) = 1(1 + 1)
0i(1 + 1)((1 + 1)^-1) = 1(1 + 1)((1 + 1)^-1)
0i = 1
00i = 0i = 01 = 0
0i = 0
```

Quite an involved proof but it's provable!
