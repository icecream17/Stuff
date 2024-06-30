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
