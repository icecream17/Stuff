# Proving the solutions to flow free levels

> Trademarks are owned by their respective companies.

Not only am I going to provide solutions to flow free levels,
I'm going to prove I found _all_ of them.

> This is for educational purposes only.
>
> Before looking at any solution, try to solve whatever level you're stuck on first.

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

Not to mention that a path from A to B is different from its reverse (a path from B to A)

I'm not sure if anyone has invented a structure that makes these "different" paths equal,
so I guess I get to name it.

> A __road__ from A to B, is a set of two paths, one from A to B, and its reverse from B to A
>
> And remember that _a path cannot cross itself_.
>
> So really, in some definitions of path we're actually using _simple paths_:
>
> ```mm
> reverseWalk = ( w e. U. ran Walks |-> <.
>   ( reverse ` ( 1st ` w ) ) ,
>   ( ( n e. dom ( 2nd ` w ) |-> ( # ` ( 2nd ` w ) ) - n ) o. ( 2nd ` w ) )
> >. )
> 
> Roads = ( g e. _V |-> ( a e. ( Vtx ` g ) , b e. ( Vtx ` g ) |->
>   { c | E! x e. c ( x e. ( a ( SPathsOn ` g ) b ) /\ c = { x , ( reverseWalk ` x ) } ) } ) )
> ```

I'd say flows are really _roads_ because it doesn't matter what direction you go in.

Some puzzles have upwards of 16 flows, so there would be a lot of "different solutions"
that are just paths flipped around without this.

### Definition of solution

And finally, the function that takes a graph and some corresponding endpoints and outputs
the set of flow free solutions:

```mm
$( A walk is a sequence of edges and a sequence of vertices $)
VtxWalk = ( g e. _V |-> ( w e. ( Walks ` g ) |-> ran ( 2nd ` w ) ) )

$( The vertices of a road are the vertices in the paths of the road $)
VtxRoad = ( g e. _V |-> ( r e. ran ( Roads ` g ) |-> U. ( ( VtxWalk ` g ) " r ) ) )

$( Informally, `Ffs` takes a graph ` g ` and a set of ordered pairs of vertices ` e ` ,
   and outputs the sets where

   1. Every ordered pair ` < start, end > ` in ` e `
      corresponds to a unique road in ` s ` from ` start ` to ` end ` ,
      i.e. all pairs of colors are connected by flows
   2. No two roads have a vertex in common
      i.e. two different roads cannot overlap (the condition for same roads is guaranteed above)
   3. All the vertices in the roads of ` s ` =
      all the vertices in ` g `
      i.e. the whole board must be covered by flows
$)
Ffs = ( g e. _V , e e. ~P ( ( Vtx ` g ) X. ( Vtx ` g ) ) |->
  { s | (
    ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) /\
    A. a e. s A. b e. s ( ( ( VtxRoad ` g ) ` a ) i^i ( ( VtxRoad ` g ) ` b ) ) = (/) /\
    U. ( ( VtxRoad ` g ) " s ) = ( Vtx ` g )
  ) } )
```

A rectangle is a common type of graph so it will be useful to define.

Horrifyingly, a graph in Metamath is a set of vertices... and _indexed_ edges!

In a row of a grid, there are rowlength - 1 connections. <sup>Ignoring 0</sup>

In a column, there are columnlength - 1 connections.

So in total there are `( w - 1 ) * w + ( h - 1 ) * h` connections.

```mm
RectGraph = ( w e. NN , h e. NN |->
  <. { <. a , b >. | ( a e. NN0 /\ b e. NN0 /\ ( a < w /\ b < h ) ) } ,
     ( i e. ( 0 ..^ ( ( w * ( w - 1 ) ) + ( h * ( h - 1 ) ) ) ) |->
       if ( i e. ( 0 ..^ ( w * ( w - 1 ) ) ) ,
          { <. ( i mod ( w - 1 ) ), ( |_ ` ( i / ( w - 1 ) ) ) >. , <. ( ( i mod ( w - 1 ) ) + 1 ) , ( |_ ` ( i / ( w - 1 ) ) ) >. } ,
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
solcp1 = ( ( 5 RectGraph 5 ) Ffs {
  <. <. 0 , 0 >. , <. 1 , 4 >. >. ,
  <. <. 1 , 3 >. , <. 2 , 0 >. >. ,
  <. <. 2 , 1 >. , <. 2 , 4 >. >.
} u. {
  <. <. 3 , 3 >. , <. 4 , 0 >. >. ,
  <. <. 3 , 4 >. , <. 4 , 1 >. >.
} ) )
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

### Proofs

#### misc

```mm
recgrex $p RectGraph e. _V $=
df-recgr   RectGraph = ( w e. NN , h e. NN |->
  <. { <. a , b >. | ( a e. NN0 /\ b e. NN0 /\ ( a < w /\ b < h ) ) } ,
     ( i e. ( 0 ..^ ( ( w * ( w - 1 ) ) + ( h * ( h - 1 ) ) ) ) |->
       if ( i e. ( 0 ..^ ( w * ( w - 1 ) ) ) ,
          { <. ( i mod ( w - 1 ) ), ( |_ ` ( i / ( w - 1 ) ) ) >. , <. ( ( i mod ( w - 1 ) ) + 1 ) , ( |_ ` ( i / ( w - 1 ) ) ) >. } ,
          { <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) >. ,
            <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) + 1 ) >. } ) ) >. )
nnex        NN e. _V
nnex        NN e. _V
mpt2ex      ( w e. NN , h e. NN |->
  <. { <. a , b >. | ( a e. NN0 /\ b e. NN0 /\ ( a < w /\ b < h ) ) } ,
     ( i e. ( 0 ..^ ( ( w * ( w - 1 ) ) + ( h * ( h - 1 ) ) ) ) |->
       if ( i e. ( 0 ..^ ( w * ( w - 1 ) ) ) ,
          { <. ( i mod ( w - 1 ) ), ( |_ ` ( i / ( w - 1 ) ) ) >. , <. ( ( i mod ( w - 1 ) ) + 1 ) , ( |_ ` ( i / ( w - 1 ) ) ) >. } ,
          { <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) >. ,
            <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) + 1 ) >. } ) ) >. ) e. _V
eqeltri     RectGraph e. _V

fovex $p ( F : ( A B C ) --> D -> F e. _V ) $=
ovex     ( A B C ) e. _V
fex      ( ( F : ( A B C ) --> D /\ ( A B C ) e. _V ) -> F e. _V )
mpan2    ( F : ( A B C ) --> D -> F e. _V )

$( Wish there was mpdid so I could do com34 mpdid 3impd instead of
   com24 mpdi com23 3impd $)
$( Can be generalized by adding a hypothesis and replacing
   pm2.43d with mpdi $)
iswlkALTlem.1 $e ( ( ph /\ ps /\ ch ) -> ( th <-> ( ps /\ et /\ ze ) ) $.
iswlkALTlem.2 $e ( et -> ch ) $.
iswlkALTlem   $p ( ph -> ( ( ps /\ et /\ ze ) -> th ) ) $=
iswlkALTlem.2    ( et -> ch )
iswlkALTlem.1    ( ( ph /\ ps /\ ch ) -> ( th <-> ( ps /\ et /\ ze ) )
biimprd          ( ( ph /\ ps /\ ch ) -> ( ( ps /\ et /\ ze ) -> th ) )
3expd            ( ( ph /\ ps /\ ch ) -> ( ps -> ( et -> ( ze -> th ) ) ) )
3exp             ( ph -> ( ps -> ( ch -> ( ps -> ( et -> ( ze -> th ) ) ) )
com34            ( ph -> ( ps -> ( ps -> ( ch -> ( et -> ( ze -> th ) ) ) )
pm2.43d          ( ph -> ( ps -> ( ch -> ( et -> ( ze -> th ) ) )
com24            ( ph -> ( et -> ( ch -> ( ps -> ( ze -> th ) ) )
mpdi             ( ph -> ( et -> ( ps -> ( ze -> th ) )
com23            ( ph -> ( ps -> ( et -> ( ze -> th ) )
3impd            ( ph -> ( ( ps /\ et /\ ze ) -> th ) )

wksfval.v $e V = ( Vtx ` G ) $.
wksfval.i $e I = ( iEdg ` G ) $.
iswlkALT $p ( G e. W ->
  ( F ( Walks ` G ) P <-> ( F e. Word dom I /\ P : ( 0 ... ( # ` F ) ) --> V /\ A. k e. ( 0 ..^ ( # ` F ) ) if- ( ( P ` k ) = ( P ` ( k + 1 ) ) , ( I ` ( F ` k ) ) = { ( P ` k ) } , { ( P ` k ) , ( P ` ( k + 1 ) ) } C_ ( I ` ( F ` k ) ) ) ) ) )
$=
wksfval.v   V = ( Vtx ` G )
wksfval.i   I = ( iEdg ` G )
wlkprop     ( F ( Walks ` G ) P -> ( F e. Word dom I /\ P : ( 0 ... ( # ` F ) ) --> V /\ A. k e. ( 0 ..^ ( # ` F ) ) if- ( ( P ` k ) = ( P ` ( k + 1 ) ) , ( I ` ( F ` k ) ) = { ( P ` k ) } , { ( P ` k ) , ( P ` ( k + 1 ) ) } C_ ( I ` ( F ` k ) ) ) ) )
iswlk       ( ( G e. W /\ F e. Word dom I /\ P e. _V ) ->
  ( F ( Walks ` G ) P <-> ( F e. Word dom I /\ P : ( 0 ... ( # ` F ) ) --> V /\ A. k e. ( 0 ..^ ( # ` F ) ) if- ( ( P ` k ) = ( P ` ( k + 1 ) ) , ( I ` ( F ` k ) ) = { ( P ` k ) } , { ( P ` k ) , ( P ` ( k + 1 ) ) } C_ ( I ` ( F ` k ) ) ) ) ) )
fovex       ( P : ( 0 ... ( # ` F ) ) --> V -> P e. _V )
iswlkALTlem ( G e. W -> ( ( F e. Word dom I /\ P : ( 0 ... ( # ` F ) ) --> V /\ A. k e. ( 0 ..^ ( # ` F ) ) if- ( ( P ` k ) = ( P ` ( k + 1 ) ) , ( I ` ( F ` k ) ) = { ( P ` k ) } , { ( P ` k ) , ( P ` ( k + 1 ) ) } C_ ( I ` ( F ` k ) ) ) ) -> F ( Walks ` G ) P ) )
impbid2     ( G e. W ->
  ( F ( Walks ` G ) P <-> ( F e. Word dom I /\ P : ( 0 ... ( # ` F ) ) --> V /\ A. k e. ( 0 ..^ ( # ` F ) ) if- ( ( P ` k ) = ( P ` ( k + 1 ) ) , ( I ` ( F ` k ) ) = { ( P ` k ) } , { ( P ` k ) , ( P ` ( k + 1 ) ) } C_ ( I ` ( F ` k ) ) ) ) ) )
```

#### ovrecgr

```mm

$d a b w h W $.
$d a b w h H $.
$d w h i $.
ovrecgrlem $p
   ( ( w = W /\ h = H ) ->
      <. { <. a , b >. | ( a e. NN0 /\ b e. NN0 /\ ( a < w /\ b < h ) ) } ,
         ( i e. ( 0 ..^ ( ( w * ( w - 1 ) ) + ( h * ( h - 1 ) ) ) ) |->
           if ( i e. ( 0 ..^ ( w * ( w - 1 ) ) ) ,
              { <. ( i mod ( w - 1 ) ), ( |_ ` ( i / ( w - 1 ) ) ) >. , <. ( ( i mod ( w - 1 ) ) + 1 ) , ( |_ ` ( i / ( w - 1 ) ) ) >. } ,
              { <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) >. ,
                <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) + 1 ) >. } ) ) >. =
      <. { <. a , b >. | ( a e. NN0 /\ b e. NN0 /\ ( a < W /\ b < H ) ) } ,
         ( i e. ( 0 ..^ ( ( W * ( W - 1 ) ) + ( H * ( H - 1 ) ) ) ) |->
           if ( i e. ( 0 ..^ ( W * ( W - 1 ) ) ) ,
              { <. ( i mod ( W - 1 ) ), ( |_ ` ( i / ( W - 1 ) ) ) >. , <. ( ( i mod ( W - 1 ) ) + 1 ) , ( |_ ` ( i / ( W - 1 ) ) ) >. } ,
              { <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) >. ,
                <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) + 1 ) >. } ) ) >. )
$=
breq2
   ( w = W -> ( a < w <-> a < W ) )
breq2
   ( h = H -> ( b < h <-> b < H ) )
anbi12d
   ( ( w = W /\ h = H ) -> ( ( a < w /\ b < h ) <-> ( a < W /\ b < H ) ) )
3anbi3d
   ( ( w = W /\ h = H ) -> ( ( a e. NN0 /\ b e. NN0 /\ ( a < w /\ b < h ) ) <->
                             ( a e. NN0 /\ b e. NN0 /\ ( a < W /\ b < H ) ) ) )
opabbidv
   ( ( w = W /\ h = H ) -> { <. a , b >. | ( a e. NN0 /\ b e. NN0 /\ ( a < w /\ b < h ) ) } =
                           { <. a , b >. | ( a e. NN0 /\ b e. NN0 /\ ( a < W /\ b < H ) ) } )
id
   ( w = W -> w = W )
oveq1
   ( w = W -> ( w - 1 ) = ( W - 1 ) )
oveq12d
   ( w = W -> ( w * ( w - 1 ) ) = ( W * ( W - 1 ) ) )
id
   ( h = H -> h = H )
oveq1
   ( h = H -> ( h - 1 ) = ( H - 1 ) )
oveq12d
   ( h = H -> ( h * ( h - 1 ) ) = ( H * ( H - 1 ) ) )
anim12i
   ( ( w = W /\ h = H ) -> ( ( w * ( w - 1 ) ) = ( W * ( W - 1 ) ) /\ ( h * ( h - 1 ) ) = ( H * ( H - 1 ) ) ) )
opeq12
   ( ( ( w * ( w - 1 ) ) = ( W * ( W - 1 ) ) /\ ( h * ( h - 1 ) ) = ( H * ( H - 1 ) ) ) ->
     ( ( w * ( w - 1 ) ) + ( h * ( h - 1 ) ) ) = ( ( W * ( W - 1 ) ) + ( H * ( H - 1 ) ) ) )
syl
   ( ( w = W /\ h = H ) -> ( ( w * ( w - 1 ) ) + ( h * ( h - 1 ) ) ) = ( ( W * ( W - 1 ) ) + ( H * ( H - 1 ) ) ) )
opeq2d
   ( ( w = W /\ h = H ) -> ( 0 ..^ ( ( w * ( w - 1 ) ) + ( h * ( h - 1 ) ) ) ) = ( 0 ..^ ( ( W * ( W - 1 ) ) + ( H * ( H - 1 ) ) ) ) )
adantr
   ( ( w = W /\ h = H ) -> ( w * ( w - 1 ) ) = ( W * ( W - 1 ) ) )
opeq2d
   ( ( w = W /\ h = H ) -> ( 0 ..^ ( w * ( w - 1 ) ) ) = ( 0 ..^ ( W * ( W - 1 ) ) ) )
eleq2d
   ( ( w = W /\ h = H ) -> ( i e. ( 0 ..^ ( w * ( w - 1 ) ) ) <-> i e. ( 0 ..^ ( W * ( W - 1 ) ) ) ) )
oveq1
   ( w = W -> ( w - 1 ) = ( W - 1 ) )
oveq2d
   ( w = W -> ( i mod ( w - 1 ) ) = ( i mod ( W - 1 ) ) )
oveq1d
   ( w = W -> ( ( i mod ( w - 1 ) ) + 1 ) = ( ( i mod ( W - 1 ) ) + 1 ) )
oveq2d
   ( w = W -> ( i / ( w - 1 ) ) = ( i / ( W - 1 ) ) )
fveq2d
   ( w = W -> ( |_ ` ( i / ( w - 1 ) ) ) = ( |_ ` ( i / ( W - 1 ) ) ) )
opeq12d
   ( w = W -> <. ( i mod ( w - 1 ) ), ( |_ ` ( i / ( w - 1 ) ) ) >. = <. ( i mod ( W - 1 ) ), ( |_ ` ( i / ( W - 1 ) ) ) >. )
opeq12d
   ( w = W -> <. ( ( i mod ( w - 1 ) ) + 1 ) , ( |_ ` ( i / ( w - 1 ) ) ) >. = <. ( ( i mod ( W - 1 ) ) + 1 ) , ( |_ ` ( i / ( W - 1 ) ) ) >. )
preq12d
   ( w = W -> { <. ( i mod ( w - 1 ) ), ( |_ ` ( i / ( w - 1 ) ) ) >. , <. ( ( i mod ( w - 1 ) ) + 1 ) , ( |_ ` ( i / ( w - 1 ) ) ) >. } =
              { <. ( i mod ( W - 1 ) ), ( |_ ` ( i / ( W - 1 ) ) ) >. , <. ( ( i mod ( W - 1 ) ) + 1 ) , ( |_ ` ( i / ( W - 1 ) ) ) >. } )
adantr
   ( ( w = W /\ h = H ) -> { <. ( i mod ( w - 1 ) ), ( |_ ` ( i / ( w - 1 ) ) ) >. , <. ( ( i mod ( w - 1 ) ) + 1 ) , ( |_ ` ( i / ( w - 1 ) ) ) >. } =
                           { <. ( i mod ( W - 1 ) ), ( |_ ` ( i / ( W - 1 ) ) ) >. , <. ( ( i mod ( W - 1 ) ) + 1 ) , ( |_ ` ( i / ( W - 1 ) ) ) >. } )
id
   ( w = W -> w = W )
oveq12d
   ( w = W -> ( w * ( w - 1 ) ) = ( W * ( W - 1 ) ) )
oveq2d
   ( w = W -> ( i - ( w * ( w - 1 ) ) ) = ( i - ( W * ( W - 1 ) ) ) )
adantr
   ( ( w = W /\ h = H ) -> ( i - ( w * ( w - 1 ) ) ) = ( i - ( W * ( W - 1 ) ) ) )
oveq1
   ( h = H -> ( h - 1 ) = ( H - 1 ) )
adantl
   ( ( w = W /\ h = H ) -> ( h - 1 ) = ( H - 1 ) )
oveq12d
   ( ( w = W /\ h = H ) -> ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) = ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) )
fveq12d
   ( ( w = W /\ h = H ) -> ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) = ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) )
oveq12d
   ( ( w = W /\ h = H ) -> ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) = ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) )
oveq1d
   ( ( w = W /\ h = H ) -> ( ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) + 1 ) = ( ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) + 1 ) )
opeq12d
   ( ( w = W /\ h = H ) -> <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) >. =
                           <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( h - 1 ) ) ) , ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) >. )
opeq12d
   ( ( w = W /\ h = H ) -> <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) + 1 ) >. =
                           <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) + 1 ) >. )
preq12d
   ( ( w = W /\ h = H ) ->
     { <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) >. ,
       <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) + 1 ) >. } =
     { <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) >. ,
       <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) + 1 ) >. } )
ifbieq12d
   ( ( w = W /\ h = H ) ->
     if ( i e. ( 0 ..^ ( w * ( w - 1 ) ) ) ,
       { <. ( i mod ( w - 1 ) ), ( |_ ` ( i / ( w - 1 ) ) ) >. , <. ( ( i mod ( w - 1 ) ) + 1 ) , ( |_ ` ( i / ( w - 1 ) ) ) >. } ,
       { <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) >. ,
         <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) + 1 ) >. } ) =
     if ( i e. ( 0 ..^ ( W * ( W - 1 ) ) ) ,
       { <. ( i mod ( W - 1 ) ), ( |_ ` ( i / ( W - 1 ) ) ) >. , <. ( ( i mod ( W - 1 ) ) + 1 ) , ( |_ ` ( i / ( W - 1 ) ) ) >. } ,
       { <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) >. ,
         <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) + 1 ) >. } ) )
mpteq12dv
   ( ( w = W /\ h = H ) ->
     ( i e. ( 0 ..^ ( ( w * ( w - 1 ) ) + ( h * ( h - 1 ) ) ) ) |->
       if ( i e. ( 0 ..^ ( w * ( w - 1 ) ) ) ,
          { <. ( i mod ( w - 1 ) ), ( |_ ` ( i / ( w - 1 ) ) ) >. , <. ( ( i mod ( w - 1 ) ) + 1 ) , ( |_ ` ( i / ( w - 1 ) ) ) >. } ,
          { <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) >. ,
            <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) + 1 ) >. } ) ) =
     ( i e. ( 0 ..^ ( ( W * ( W - 1 ) ) + ( H * ( H - 1 ) ) ) ) |->
       if ( i e. ( 0 ..^ ( W * ( W - 1 ) ) ) ,
          { <. ( i mod ( W - 1 ) ), ( |_ ` ( i / ( W - 1 ) ) ) >. , <. ( ( i mod ( W - 1 ) ) + 1 ) , ( |_ ` ( i / ( W - 1 ) ) ) >. } ,
          { <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) >. ,
            <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) + 1 ) >. } ) ) )
opeq12d
   ( ( w = W /\ h = H ) ->
      <. { <. a , b >. | ( a e. NN0 /\ b e. NN0 /\ ( a < w /\ b < h ) ) } ,
         ( i e. ( 0 ..^ ( ( w * ( w - 1 ) ) + ( h * ( h - 1 ) ) ) ) |->
           if ( i e. ( 0 ..^ ( w * ( w - 1 ) ) ) ,
              { <. ( i mod ( w - 1 ) ), ( |_ ` ( i / ( w - 1 ) ) ) >. , <. ( ( i mod ( w - 1 ) ) + 1 ) , ( |_ ` ( i / ( w - 1 ) ) ) >. } ,
              { <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) >. ,
                <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) + 1 ) >. } ) ) >. =
      <. { <. a , b >. | ( a e. NN0 /\ b e. NN0 /\ ( a < W /\ b < H ) ) } ,
         ( i e. ( 0 ..^ ( ( W * ( W - 1 ) ) + ( H * ( H - 1 ) ) ) ) |->
           if ( i e. ( 0 ..^ ( W * ( W - 1 ) ) ) ,
              { <. ( i mod ( W - 1 ) ), ( |_ ` ( i / ( W - 1 ) ) ) >. , <. ( ( i mod ( W - 1 ) ) + 1 ) , ( |_ ` ( i / ( W - 1 ) ) ) >. } ,
              { <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) >. ,
                <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) + 1 ) >. } ) ) >. )

$d a b w h W $.
$d a b w h H $.
$d w h i $.
ovrecgr $p
  ( ( W e. NN /\ H e. NN ) -> ( A RectGraph B ) =
    <. { <. a , b >. | ( a e. NN0 /\ b e. NN0 /\ ( a < W /\ b < H ) ) } ,
       ( i e. ( 0 ..^ ( ( W * ( W - 1 ) ) + ( H * ( H - 1 ) ) ) ) |->
         if ( i e. ( 0 ..^ ( W * ( W - 1 ) ) ) ,
            { <. ( i mod ( W - 1 ) ), ( |_ ` ( i / ( W - 1 ) ) ) >. , <. ( ( i mod ( W - 1 ) ) + 1 ) , ( |_ ` ( i / ( W - 1 ) ) ) >. } ,
            { <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) >. ,
              <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) + 1 ) >. } ) ) >. )
$=
ovrecgrlem
   ( ( w = W /\ h = H ) ->
      <. { <. a , b >. | ( a e. NN0 /\ b e. NN0 /\ ( a < w /\ b < h ) ) } ,
         ( i e. ( 0 ..^ ( ( w * ( w - 1 ) ) + ( h * ( h - 1 ) ) ) ) |->
           if ( i e. ( 0 ..^ ( w * ( w - 1 ) ) ) ,
              { <. ( i mod ( w - 1 ) ), ( |_ ` ( i / ( w - 1 ) ) ) >. , <. ( ( i mod ( w - 1 ) ) + 1 ) , ( |_ ` ( i / ( w - 1 ) ) ) >. } ,
              { <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) >. ,
                <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) + 1 ) >. } ) ) >. =
      <. { <. a , b >. | ( a e. NN0 /\ b e. NN0 /\ ( a < W /\ b < H ) ) } ,
         ( i e. ( 0 ..^ ( ( W * ( W - 1 ) ) + ( H * ( H - 1 ) ) ) ) |->
           if ( i e. ( 0 ..^ ( W * ( W - 1 ) ) ) ,
              { <. ( i mod ( W - 1 ) ), ( |_ ` ( i / ( W - 1 ) ) ) >. , <. ( ( i mod ( W - 1 ) ) + 1 ) , ( |_ ` ( i / ( W - 1 ) ) ) >. } ,
              { <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) >. ,
                <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) + 1 ) >. } ) ) >. )
df-recgr
   RectGraph = ( w e. NN , h e. NN |->
     <. { <. a , b >. | ( a e. NN0 /\ b e. NN0 /\ ( a < w /\ b < h ) ) } ,
        ( i e. ( 0 ..^ ( ( w * ( w - 1 ) ) + ( h * ( h - 1 ) ) ) ) |->
          if ( i e. ( 0 ..^ ( w * ( w - 1 ) ) ) ,
             { <. ( i mod ( w - 1 ) ), ( |_ ` ( i / ( w - 1 ) ) ) >. , <. ( ( i mod ( w - 1 ) ) + 1 ) , ( |_ ` ( i / ( w - 1 ) ) ) >. } ,
             { <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) >. ,
               <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) + 1 ) >. } ) ) >. )
ovex
   <. { <. a , b >. | ( a e. NN0 /\ b e. NN0 /\ ( a < W /\ b < H ) ) } ,
      ( i e. ( 0 ..^ ( ( W * ( W - 1 ) ) + ( H * ( H - 1 ) ) ) ) |->
        if ( i e. ( 0 ..^ ( W * ( W - 1 ) ) ) ,
           { <. ( i mod ( W - 1 ) ), ( |_ ` ( i / ( W - 1 ) ) ) >. , <. ( ( i mod ( W - 1 ) ) + 1 ) , ( |_ ` ( i / ( W - 1 ) ) ) >. } ,
           { <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) >. ,
             <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) + 1 ) >. } ) ) >. e. _V
ovmpt2a
  ( ( W e. NN /\ H e. NN ) -> ( A RectGraph B ) =
    <. { <. a , b >. | ( a e. NN0 /\ b e. NN0 /\ ( a < W /\ b < H ) ) } ,
       ( i e. ( 0 ..^ ( ( W * ( W - 1 ) ) + ( H * ( H - 1 ) ) ) ) |->
         if ( i e. ( 0 ..^ ( W * ( W - 1 ) ) ) ,
            { <. ( i mod ( W - 1 ) ), ( |_ ` ( i / ( W - 1 ) ) ) >. , <. ( ( i mod ( W - 1 ) ) + 1 ) , ( |_ ` ( i / ( W - 1 ) ) ) >. } ,
            { <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) >. ,
              <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) + 1 ) >. } ) ) >. )
```

#### ovffs

```mm

$d s e $.
$d s E $.
ovffslem1 $p
  ( e = E -> ( ( G e. _V -> ( G Ffs e ) =
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) } ) <-> ( G e. _V -> ( G Ffs E ) =
    { s | (
      ( E ~~ s /\ A. c e. E E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) } ) ) )
$=
oveq2
  ( e = E -> ( G Ffs e ) = ( G Ffs E ) )
breq1
  ( e = E -> ( e ~~ s <-> E ~~ s ) )
raleq
  ( e = E -> ( A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) <->
               A. c e. E E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) )
anbi12d
  ( e = E -> (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) <->
      ( E ~~ s /\ A. c e. E E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) )
  ) )
3anbi1d
  ( e = E -> (
    (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) <->
    (
      ( E ~~ s /\ A. c e. E E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) ) )
abbidv
  ( e = E ->
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) } =
    { s | (
      ( E ~~ s /\ A. c e. E E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) } )
eqeq12d
  ( e = E -> ( ( G Ffs e ) =
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) } <-> ( G Ffs E ) =
    { s | (
      ( E ~~ s /\ A. c e. E E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) } ) )
imbi2d
  ( e = E -> ( ( G e. _V -> ( G Ffs e ) =
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) } ) <-> ( G e. _V -> ( G Ffs E ) =
    { s | (
      ( E ~~ s /\ A. c e. E E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) } ) ) )

$d s g $.
$d s G $.
$d r g $.
$d r G $.
$d c g $.
$d c G $.
ovffslem2 $p
  ( g = G -> ( ( e e. ~P ( ( Vtx ` g ) X. ( Vtx ` g ) ) -> ( g Ffs e ) =
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` g ) ` a ) i^i ( ( VtxRoad ` g ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` g ) " s ) = ( Vtx ` g )
    ) } ) <-> ( e e. ~P ( ( Vtx ` G ) X. ( Vtx ` G ) ) -> ( G Ffs e ) =
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) } ) ) )
$=
fveq2
  ( g = G -> ( Vtx ` g ) = ( Vtx ` G ) )
sqxpeqd
  ( g = G -> ( ( Vtx ` g ) X. ( Vtx ` g ) ) = ( ( Vtx ` G ) X. ( Vtx ` G ) ) )
pweqd
  ( g = G -> ~P ( ( Vtx ` g ) X. ( Vtx ` g ) ) = ~P ( ( Vtx ` G ) X. ( Vtx ` G ) ) )
eleq2d
  ( g = G -> ( e e. ~P ( ( Vtx ` g ) X. ( Vtx ` g ) ) <->
               e e. ~P ( ( Vtx ` G ) X. ( Vtx ` G ) ) ) )
oveq2
  ( g = G -> ( g Ffs e ) = ( G Ffs e ) )
fveq2
  ( g = G -> ( Roads ` g ) = ( Roads ` G ) )
oveqd
  ( g = G -> ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) = ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) )
eleq2d
  ( g = G -> ( r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) <->
               r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) )
reubidv
  ( g = G -> ( E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) <->
               E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) )
ralbidv
  ( g = G -> ( A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) <->
               A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) )
anbi2d
  ( g = G -> (
    ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) <->
    ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) ) )
fveq2
  ( g = G -> ( VtxRoad ` g ) = ( VtxRoad ` G ) )
fveq1d
  ( g = G -> ( ( VtxRoad ` g ) ` a ) = ( ( VtxRoad ` G ) ` a ) )
fveq1d
  ( g = G -> ( ( VtxRoad ` g ) ` b ) = ( ( VtxRoad ` G ) ` b ) )
ineq12d
  ( g = G -> ( ( ( VtxRoad ` g ) ` a ) i^i ( ( VtxRoad ` g ) ` b ) ) =
             ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) )
eqeq1d
  ( g = G -> ( ( ( ( VtxRoad ` g ) ` a ) i^i ( ( VtxRoad ` g ) ` b ) ) = (/) <->
               ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) ) )
imaeq1d
  ( g = G -> ( ( VtxRoad ` g ) " s ) = ( ( VtxRoad ` G ) " s ) )
unieqd
  ( g = G -> U. ( ( VtxRoad ` g ) " s ) = U. ( ( VtxRoad ` G ) " s ) )
eqeq12d
  ( g = G -> ( U. ( ( VtxRoad ` g ) " s ) = ( Vtx ` g ) <->
               U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G ) ) )
3anbi123d
  ( g = G -> ( (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` g ) ` a ) i^i ( ( VtxRoad ` g ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` g ) " s ) = ( Vtx ` g )
    ) <-> (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) ) )
abbidv
  ( g = G ->
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` g ) ` a ) i^i ( ( VtxRoad ` g ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` g ) " s ) = ( Vtx ` g )
    ) } =
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) } )
eqeq12d
  ( g = G -> (
    ( g Ffs e ) = { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` g ) ` a ) i^i ( ( VtxRoad ` g ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` g ) " s ) = ( Vtx ` g )
    ) } <->
    ( G Ffs e ) = { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) } ) )
imbi12d
  ( g = G -> ( ( e e. ~P ( ( Vtx ` g ) X. ( Vtx ` g ) ) -> ( g Ffs e ) =
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` g ) ` a ) i^i ( ( VtxRoad ` g ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` g ) " s ) = ( Vtx ` g )
    ) } ) <-> ( e e. ~P ( ( Vtx ` G ) X. ( Vtx ` G ) ) -> ( G Ffs e ) =
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) } ) ) )

$( Any solution is a set of roads (hard)
   The class of the roads of a graph is a set (easy)
   So the class of all the solutions is a set (easy) $)
$d y r s $.
$d y r c $.
$d y r g $.
$d f e $.
$d f s $.
$d v w c $.
$d s g $.
$d s e $.
ovffslem3 $p
  ( ( g e. _V /\ e e. ~P ( ( Vtx ` g ) X. ( Vtx ` g ) ) ) ->
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` g ) ` a ) i^i ( ( VtxRoad ` g ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` g ) " s ) = ( Vtx ` g )
    ) } e. _V )
$=
xpss
  ( ( Vtx ` g ) X. ( Vtx ` g ) ) C_ ( _V X. _V )
elpwi
  ( e e. ~P ( ( Vtx ` g ) X. ( Vtx ` g ) ) -> e C_ ( ( Vtx ` g ) X. ( Vtx ` g ) ) )
relss
  ( e C_ ( ( Vtx ` g ) X. ( Vtx ` g ) ) -> (
    ( Rel ( Vtx ` g ) X. ( Vtx ` g ) ) -> Rel e ) )
mpi
  ( e C_ ( ( Vtx ` g ) X. ( Vtx ` g ) ) -> Rel e )
syl
  ( e e. ~P ( ( Vtx ` g ) X. ( Vtx ` g ) ) -> Rel e )
simp1
  ( (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` g ) ` a ) i^i ( ( VtxRoad ` g ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` g ) " s ) = ( Vtx ` g )
    ) -> ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) )
df-reu
  ( E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) <->
    E! r ( r e. s /\ r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) )
elin
  ( r e. ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) <->
  ( r e. s /\ r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) )
eubii
  ( E! r r e. ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) <->
    E! r ( r e. s /\ r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) )
df-eu
  ( E! r r e. ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) <->
    E. y A. r ( r e. ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) <-> r = y ) )
3bitr2i
  ( E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) <->
    E. y A. r ( r e. ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) <-> r = y ) )
velsn
  ( r e. { y } <-> r = y )
bicomi
  ( r = y <-> r e. { y } )
bibi2i
  ( ( r e. ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) <-> r = y ) <->
    ( r e. ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) <-> r e. { y } ) )
albii
  ( A. r ( r e. ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) <-> r = y ) <->
    A. r ( r e. ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) <-> r e. { y } ) )
dfcleq
  ( ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) = { y } <->
    A. r ( r e. ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) <-> r e. { y } )
bitr4i
  ( A. r ( r e. ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) <-> r = y ) <->
    ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) = { y } )
vex
  y e. _V
ensn1
  { y } ~~ 1o
breq1
  ( ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) = { y } ->
  ( ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ~~ 1o <-> { y } ~~ 1o ) )
mpbiri
  ( ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) = { y } ->
    ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ~~ 1o )
sylbi
  ( A. r ( r e. ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) <-> r = y ) ->
    ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ~~ 1o )
eximi
  ( E. y A. r ( r e. ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) <-> r = y ) ->
    E. y ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ~~ 1o )
ax5e
  ( E. y ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ~~ 1o ->
    ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ~~ 1o )
syl
  ( E. y A. r ( r e. ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) <-> r = y ) ->
    ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ~~ 1o ) )
sylbi
  ( ( E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ->
    ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ~~ 1o ) )
ralimi
  ( A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ->
    A. c e. e ( s i^i ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ~~ 1o ) )
elrel
  ( ( Rel e /\ c e. e ) -> E. v E. w c = <. v , w >. )
fveq2
  ( c = <. v , w >. -> ( 1st ` c ) = ( 1st ` <. v , w >. ) )
fveq2
  ( c = <. v , w >. -> ( 2nd ` c ) = ( 2nd ` <. v , w >. ) )
vex
  v e. _V
vex
  w e. _V
op1st
  ( 1st ` <. v , w >. ) = v
op2nd
  ( 2nd ` <. v , w >. ) = w
syl6eq
  ( c = <. v , w >. -> ( 1st ` c ) = v )
syl6eq
  ( c = <. v , w >. -> ( 2nd ` c ) = w )
opeq12d
  ( c = <. v , w >. -> <. ( 1st ` c ) , ( 2nd ` c ) >. = <. v , w >. )
eqcom
  ( c = <. v , w >. <-> <. v , w >. = c )
biimpi
  ( c = <. v , w >. -> <. v , w >. = c )
eqtrd
  ( c = <. v , w >. -> <. ( 1st ` c ) , ( 2nd ` c ) >. = c )
exlimivv
  ( E. v E. w c = <. v , w >. -> <. ( 1st ` c ) , ( 2nd ` c ) >. = c )
syl
  ( ( Rel e /\ c e. e ) -> <. ( 1st ` c ) , ( 2nd ` c ) >. = c )
df-ov
  ( ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) = ( ( Roads ` g ) ` <. ( 1st ` c ) , ( 2nd ` c ) >. )
fveq2d
  ( ( Rel e /\ c e. e ) -> ( ( Roads ` g ) ` <. ( 1st ` c ) , ( 2nd ` c ) >. ) = ( ( Roads ` g ) ` c ) )
syl5req
  ( ( Rel e /\ c e. e ) -> ( ( Roads ` g ) ` c ) = ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) )
df-en
  ( e ~~ s <-> E. f f : e -1-1-onto-> s )
alrimiv
  ( ph -> A. s ( (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` g ) ` a ) i^i ( ( VtxRoad ` g ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` g ) " s ) = ( Vtx ` g )
  ) -> ps ) )
ss2ab
  ( { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` g ) ` a ) i^i ( ( VtxRoad ` g ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` g ) " s ) = ( Vtx ` g )
    ) } C_ { s | ps } <-> A. s ( (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` g ) ` a ) i^i ( ( VtxRoad ` g ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` g ) " s ) = ( Vtx ` g )
    ) -> ps ) )


$d g G $.
$d g e $.
$d g s $.
$d g c $.
$d g a $.
$d g b $.
$d e G $.
$d e E $.
$d e s $.
$d e c $.
$d e a $.
$d e b $.
$( Could the dvar conditions in the lemmas be removed? $)
$( s e $)
$d s E $.
$( s g $)
$d s G $.
$d r g $.
$d r G $.
$( c g $)
$d c G $.
$( r g $)
$d r s $.
$d r c $.
$( s g $)
$( s e $)
ovffs $p
  ( ( G e. _V /\ E e. ~P ( ( Vtx ` G ) X. ( Vtx ` G ) ) ) -> ( G Ffs E ) =
    { s | (
      ( E ~~ s /\ A. c e. E E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) } )
$=
ovffslem1
  ( e = E -> ( ( G e. _V -> ( G Ffs e ) =
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) } ) <-> ( G e. _V -> ( G Ffs E ) =
    { s | (
      ( E ~~ s /\ A. c e. E E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) } ) ) )
ovffslem2
  ( g = G -> ( ( e e. ~P ( ( Vtx ` g ) X. ( Vtx ` g ) ) -> ( g Ffs e ) =
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` g ) ` a ) i^i ( ( VtxRoad ` g ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` g ) " s ) = ( Vtx ` g )
    ) } ) <-> ( e e. ~P ( ( Vtx ` G ) X. ( Vtx ` G ) ) -> ( G Ffs e ) =
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) } ) ) )
ovffslem3
  ( ( g e. _V /\ e e. ~P ( ( Vtx ` g ) X. ( Vtx ` g ) ) ) ->
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` g ) ` a ) i^i ( ( VtxRoad ` g ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` g ) " s ) = ( Vtx ` g )
    ) } e. _V )
df-ffs
  Ffs = ( g e. _V , e e. ~P ( ( Vtx ` g ) X. ( Vtx ` g ) ) |->
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` g ) ` a ) i^i ( ( VtxRoad ` g ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` g ) " s ) = ( Vtx ` g )
    ) } )
ovmpt4g
  ( ( g e. _V /\ e e. ~P ( ( Vtx ` g ) X. ( Vtx ` g ) ) /\
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` g ) ` a ) i^i ( ( VtxRoad ` g ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` g ) " s ) = ( Vtx ` g )
    ) } e. _V ) -> ( g Ffs e ) =
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` g ) ` a ) i^i ( ( VtxRoad ` g ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` g ) " s ) = ( Vtx ` g )
    ) } )
mpd3an3
  ( ( g e. _V /\ e e. ~P ( ( Vtx ` g ) X. ( Vtx ` g ) ) ) -> ( g Ffs e ) =
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` g ) ` a ) i^i ( ( VtxRoad ` g ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` g ) " s ) = ( Vtx ` g )
    ) } )
exp
  ( g e. _V -> ( e e. ~P ( ( Vtx ` g ) X. ( Vtx ` g ) ) -> ( g Ffs e ) =
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` g ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` g ) ` a ) i^i ( ( VtxRoad ` g ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` g ) " s ) = ( Vtx ` g )
    ) } ) )
vtoclga
  ( G e. _V -> ( e e. ~P ( ( Vtx ` G ) X. ( Vtx ` G ) ) -> ( G Ffs e ) =
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) } ) )
com12
  ( e e. ~P ( ( Vtx ` G ) X. ( Vtx ` G ) ) -> ( G e. _V -> ( G Ffs e ) =
    { s | (
      ( e ~~ s /\ A. c e. e E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) } ) )
vtoclga
  ( E e. ~P ( ( Vtx ` G ) X. ( Vtx ` G ) ) -> ( G e. _V -> ( G Ffs E ) =
    { s | (
      ( E ~~ s /\ A. c e. E E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) } ) )
impcom
  ( ( G e. _V /\ E e. ~P ( ( Vtx ` G ) X. ( Vtx ` G ) ) ) -> ( G Ffs E ) =
    { s | (
      ( E ~~ s /\ A. c e. E E! r e. s r e. ( ( 1st ` c ) ( Roads ` G ) ( 2nd ` c ) ) ) /\
      A. a e. s A. b e. s ( ( ( VtxRoad ` G ) ` a ) i^i ( ( VtxRoad ` G ) ` b ) ) = (/) /\
      U. ( ( VtxRoad ` G ) " s ) = ( Vtx ` G )
    ) } )

```

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

```

