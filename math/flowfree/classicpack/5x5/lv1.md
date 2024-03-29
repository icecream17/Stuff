# Proving the solutions to flow free levels

> Trademarks are owned by their respective companies.

Not only am I going to provide solutions to flow free levels,
I'm going to prove I found _all_ of them.

> This is for educational purposes only.
>
> Before looking at any solution, try to solve whatever level you're stuck on first.

[Proofs used in this document](https://github.com/icecream17/Stuff/blob/master/math/flowfree/classicpack/5x5/lv1.mm)

## Construction

### Definition of flow

The instructions on how to play are best provided by the in-game help:

> Drag to connect matching colors with pipe, creating a flow.
>
> Pair all colors, and cover the entire board with pipe to solve each puzzle.
>
> But watch out, pipes will break if they cross or overlap!

...and by actually playing flow free.

Now that you know the rules, how will they be defined?

Each level will be represented with a
[graph](https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)).

> In mathematics, and more specifically in graph theory,
> a **graph** is a structure amounting to a set of objects
> in which some pairs of the objects are in some sense "related".
>
> The objects correspond to mathematical abstractions called _vertices_ (also called _nodes_ or _points_)
> and each of the related pairs of vertices is called an _edge_ (also called _link_ or _line_).
> Typically, a graph is depicted in diagrammatic form as a set of dots or circles for the vertices,
> joined by lines or curves for the edges.

Here the relation is "connected"; e.g., squares "connect" with their
orthgonal adjacencies.

So the graph of a 5x5 grid might look like:

```txt
/ - / - / - / - /
|   |   |   |   |
/ - / - / - / - /
|   |   |   |   |
/ - / - / - / - /
|   |   |   |   |
/ - / - / - / - /
|   |   |   |   |
/ - / - / - / - /
```

So here, the `/` represents squares and `|` and `-` are connections.

Flows kinda correspond to __paths__ which go from one matching color to another.

The matching colors are the _endpoints_.

Unfortunately, the construction of paths are pretty complex:

> A __walk__ is a finite or infinite sequences of edges which joins a sequence of vertices<br>
> A __trail__ is a walk in which all edges are distinct<br>
> A __path__ is a trail in which all vertices are distinct<br>
> https://en.wikipedia.org/wiki/Path_(graph_theory)

I originally made it even more complex by saying that a path from A to B would be different
from a path from B to A, and defining what a two-way path would be.

Some puzzles have upwards of 16 flows, so I thought there would be a lot of supposedly "different"
solutions that are just paths flipped around. But instead I'll implicitly define that only
the path from A to B is valid.

### Definition of solution

Flow free solutions ;)

```mm
$( Informally, ` Ffs ` takes a graph ` g ` and a set of ordered pairs of
   corresponding vertices ` e ` , and outputs the sets ` s ` where

   1. The first and last value of every path = e
   2. Different paths don't overlap
   3. Vertices in all paths combined = All vertices

$)
df-ffs $a |- Ffs = ( g e. _V |-> ( e e. ~P ( ( Vtx ` g ) X. ( Vtx ` g ) ) |->
  { s e. ~P ( SPaths ` g ) | (
    ( p e. s |-> <. ( ( 2nd ` p ) ` 0 ) , ( lastS ` ( 2nd ` p ) ) >. ) : s -1-1-onto-> e /\
    A. a e. s A. b e. s ( a = b \/ ( ( VtxWalk ` a ) i^i ( VtxWalk ` b ) ) = (/) ) /\
    U. ( VtxWalk " s ) = ( Vtx ` g )
  ) } ) ) $.
```

### Rectangular graphs

A rectangle is a very common type of graph in Flow Free so it will be useful to define.

Horrifyingly, a graph in Metamath is a set of vertices... and _indexed_ edges!

In a row of a grid, there are rowlength - 1 connections. <sup>Ignoring 0</sup>

In a column, there are columnlength - 1 connections.

So in total there are `( w - 1 ) * w + ( h - 1 ) * h` connections.

```mm
RectGraph = ( w e. NN , h e. NN |->
  <. { <. a , b >. | ( a e. NN0 /\ b e. NN0 /\ ( a < w /\ b < h ) ) } ,
     ( i e. ( 0 ..^ ( ( w * ( w - 1 ) ) + ( h * ( h - 1 ) ) ) ) |->
       if ( i e. ( 0 ..^ ( w * ( w - 1 ) ) ) ,
          { <. ( i mod ( w - 1 ) ) , ( |_ ` ( i / ( w - 1 ) ) ) >. , <. ( ( i mod ( w - 1 ) ) + 1 ) , ( |_ ` ( i / ( w - 1 ) ) ) >. } ,
          { <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) >. ,
            <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) + 1 ) >. } ) ) >. )
```

And finally, the solutions to level 1!

```txt
classicpack - level 1

A.B.D
..C.E
.....
.B.D.
.ACE.
```

As established by CodinGame, the top left is the origin `<. 0 , 0 >.`

```mm
ffscp1 = ( ( 5 RectGraph 5 ) Ffs {
  <. <. 0 , 0 >. , <. 1 , 4 >. >. ,
  <. <. 1 , 3 >. , <. 2 , 0 >. >. ,
  <. <. 2 , 1 >. , <. 2 , 4 >. >.
} u. {
  <. <. 3 , 3 >. , <. 4 , 0 >. >. ,
  <. <. 3 , 4 >. , <. 4 , 1 >. >.
} )
```

The obvious way to prove the unique solution is to start with something like

> the D at <4, 0> can only go to <3, 0>, so therefore a path starting with <4, 0> must go to <3, 0> next

In fact, the "only one possible path continuation" is the only strategy needed!

You don't even need to somehow "connect two ends of a path together".

> The first time "only one possible path continuation" does not solve by itself is level 16:
>
> ```txt
> DDD..
> DB.B.
> C....
> .DA.A
> ...CC
> ```

This is soo easy for human brains, but as you can probably tell by now,
with this formulation it's going to take quite a bit longer than most people would think.

### Step 1

Let's be a little more concrete about this first step:

> ```txt
> A.B.D
> ..C.E
> .....
> .B.D.
> .ACE.
> 
> A.BDD
> ..C.E
> .....
> .B.D.
> .ACE.
> ```

`D` had two neighbors, `.` and `E`. If we can prove that

- `D` can't be in the same path as `E`
- An edge containing `D` must be in the path containing `D`
- A path containing `D` must be in the solution

Then we prove that

- The solution must have a path with `D`, and that path has the edge `D, <3, 0>`

## extra

The condition that the entire board must be filled is important:

```txt
A....
B....
..CB.
.A...
....C

A....
..C..
..A..
.B..B
....C
```

I remember in the past, some flow free levels had room to spare like this,
but maybe they changed the levels?

```mm

hmm I think I can shorten the proof of isspathonpath
hyp             ⊢ 𝑉 = (Vtx‘𝐺)
isspthonpth     ⊢ (((𝐴 ∈ 𝑉 ∧ 𝐵 ∈ 𝑉) ∧ (𝐹 ∈ 𝑊 ∧ 𝑃 ∈ 𝑍)) → (𝐹(𝐴(SPathsOn‘𝐺)𝐵)𝑃 ↔ (𝐹(SPaths‘𝐺)𝑃 ∧ (𝑃‘0) = 𝐴 ∧ (𝑃‘(♯‘𝐹)) = 𝐵)))

hyp             ⊢ 𝑉 = (Vtx‘𝐺)
isspthson       ⊢ (((𝐴 ∈ 𝑉 ∧ 𝐵 ∈ 𝑉) ∧ (𝐹 ∈ 𝑈 ∧ 𝑃 ∈ 𝑍)) → (𝐹(𝐴(SPathsOn‘𝐺)𝐵)𝑃 ↔ (𝐹(𝐴(TrailsOn‘𝐺)𝐵)𝑃 ∧ 𝐹(SPaths‘𝐺)𝑃)))
istrlson        ⊢ (((𝐴 ∈ 𝑉 ∧ 𝐵 ∈ 𝑉) ∧ (𝐹 ∈ 𝑈 ∧ 𝑃 ∈ 𝑍)) → (𝐹(𝐴(TrailsOn‘𝐺)𝐵)𝑃 ↔ (𝐹(𝐴(WalksOn‘𝐺)𝐵)𝑃 ∧ 𝐹(Trails‘𝐺)𝑃)))
?               ⊢ (((𝐴 ∈ 𝑉 ∧ 𝐵 ∈ 𝑉) ∧ (𝐹 ∈ 𝑈 ∧ 𝑃 ∈ 𝑍)) → (𝐹(𝐴(SPathsOn‘𝐺)𝐵)𝑃 ↔ ((𝐹(𝐴(WalksOn‘𝐺)𝐵)𝑃 ∧ 𝐹(Trails‘𝐺)𝑃) ∧ 𝐹(SPaths‘𝐺)𝑃)))
iswlkon         ⊢ (((𝐴 ∈ 𝑉 ∧ 𝐵 ∈ 𝑉) ∧ (𝐹 ∈ 𝑈 ∧ 𝑃 ∈ 𝑍)) → (𝐹(𝐴(WalksOn‘𝐺)𝐵)𝑃 ↔ (𝐹(Walks‘𝐺)𝑃 ∧ (𝑃‘0) = 𝐴 ∧ (𝑃‘(♯‘𝐹)) = 𝐵)))
?               ⊢ (((𝐴 ∈ 𝑉 ∧ 𝐵 ∈ 𝑉) ∧ (𝐹 ∈ 𝑈 ∧ 𝑃 ∈ 𝑍)) → (𝐹(𝐴(SPathsOn‘𝐺)𝐵)𝑃 ↔ (((𝐹(Walks‘𝐺)𝑃 ∧ (𝑃‘0) = 𝐴 ∧ (𝑃‘(♯‘𝐹)) = 𝐵) ∧ 𝐹(Trails‘𝐺)𝑃) ∧ 𝐹(SPaths‘𝐺)𝑃)))
?               ⊢ (((𝐴 ∈ 𝑉 ∧ 𝐵 ∈ 𝑉) ∧ (𝐹 ∈ 𝑈 ∧ 𝑃 ∈ 𝑍)) → (𝐹(𝐴(SPathsOn‘𝐺)𝐵)𝑃 ↔ (((𝐹(SPaths‘𝐺)𝑃 ∧ (𝑃‘0) = 𝐴 ∧ (𝑃‘(♯‘𝐹)) = 𝐵) ∧ 𝐹(Trails‘𝐺)𝑃) ∧ 𝐹(Walks‘𝐺)𝑃)))
isspth          ⊢ (𝐹(SPaths‘𝐺)𝑃 ↔ (𝐹(Trails‘𝐺)𝑃 ∧ Fun ◡𝑃))
?               ⊢ (𝐹(SPaths‘𝐺)𝑃 → 𝐹(Trails‘𝐺)𝑃)
trliswlk        ⊢ (𝐹(Trails‘𝐺)𝑃 → 𝐹(Walks‘𝐺)𝑃)
jccir           ⊢ (𝐹(SPaths‘𝐺)𝑃 → (𝐹(Trails‘𝐺)𝑃 ∧ 𝐹(Walks‘𝐺)𝑃))
?               ⊢ (𝐹(SPaths‘𝐺)𝑃 ↔ (𝐹(SPaths‘𝐺)𝑃 ∧ 𝐹(Trails‘𝐺)𝑃 ∧ 𝐹(Walks‘𝐺)𝑃))
?               ⊢ ((𝐹(SPaths‘𝐺)𝑃 ∧ (𝑃‘0) = 𝐴 ∧ (𝑃‘(♯‘𝐹)) = 𝐵) ↔ ((𝐹(SPaths‘𝐺)𝑃 ∧ (𝑃‘0) = 𝐴 ∧ (𝑃‘(♯‘𝐹)) = 𝐵) ∧ 𝐹(Trails‘𝐺)𝑃 ∧ 𝐹(Walks‘𝐺)𝑃))
df-3an          ⊢ ((𝐹(SPaths‘𝐺)𝑃 ∧ (𝑃‘0) = 𝐴 ∧ (𝑃‘(♯‘𝐹)) = 𝐵) ∧ 𝐹(Trails‘𝐺)𝑃 ∧ 𝐹(Walks‘𝐺)𝑃)) ↔ (((𝐹(SPaths‘𝐺)𝑃 ∧ (𝑃‘0) = 𝐴 ∧ (𝑃‘(♯‘𝐹)) = 𝐵) ∧ 𝐹(Trails‘𝐺)𝑃) ∧ 𝐹(Walks‘𝐺)𝑃))
?               ⊢ (((𝐴 ∈ 𝑉 ∧ 𝐵 ∈ 𝑉) ∧ (𝐹 ∈ 𝑈 ∧ 𝑃 ∈ 𝑍)) → (𝐹(𝐴(SPathsOn‘𝐺)𝐵)𝑃 ↔ (𝐹(SPaths‘𝐺)𝑃 ∧ (𝑃‘0) = 𝐴 ∧ (𝑃‘(♯‘𝐹)) = 𝐵))

as long as the 7 question marks don't take more than 17 (-1) steps

if not then at least 5 6 7 is shortened to

isspth          ⊢ (𝐹(SPaths‘𝐺)𝑃 ↔ (𝐹(Trails‘𝐺)𝑃 ∧ Fun ◡𝑃))
?               ⊢ (𝐹(SPaths‘𝐺)𝑃 → 𝐹(Trails‘𝐺)𝑃)

I can also shorten ~ iswlkg with ~ fex

```

