$[ set.mm $]

$(
  I'm using metamath to prove things.
  Other choices would probably be much more practical but I haven't learned
  about them yet.

  In metamath, all syntactic tokens are preceded by dollar signs "$" except for
  labels:

  $[ <file> $]    - Include a file
   ( <text>  )    - A comment (can't be nested)
  ${ <    > $}    - A scope; $c $f $a $p are always in scope
  $c <tok>[] $.   - Declare constant math tokens
  $v <tok>[] $.   - Declare variable (math tokens)
  $f <type> <variable> $.
                  - Hypothesis that always applies when a variable is used
                    In practice this declares the type of the variable
  $e <type> <tok>[] $.
                  - Scoped hypothesis just like normal
  $d <variable>[] $.
                  - Distinct variable (dvar) condition

                    Say you're proving something, and there's an (in scope)
                    dvar condition on the statement you want to use:
                      $d ph x $.
                      $e ... $.
                      abbidv $p |- ( ph -> { x | ps } = { x | ch } ) $= ... $.

                    Variables of the same type are interchangable (substitutable)
                    and so, when using an instance of ~ abbidv, all occurances of
                    "ph" may be substituted with "ps".

                    But a dvar condition requires each variable to be substituted
                    with a disjoint set of variables (in the expression).

                    For example, if "ph" was substituted for "x = y", and
                    "x" was substituted with "x", we get
                      ph: x y
                      x: x

                    And since { x , y } and { x } are not disjoint sets,
                    this substitution is invalid.

                    Even if "ph" was "w = y", there must be an in scope dvar condition
                    on every pair of variables:
                      ph: w y
                      x: x
                    Requires:
                      $d w x $.
                      $d w y $.
                      yourtheorem $p ... $= ... $.

                    In practice, this dvar condition means "x is not in ph"
  <label> $a <type> <tok>[] $.
                  - Axiom (also used for syntax declarations)
  <label> $p <type> <tok>[] $= ( <labels> ) <compression letters>? $.
                  - Theorem

  Note that <type> is just any constant math token.
  In the largest metamath database, set.mm, the "types" are:
    wff     - well formed formula "whiff"
                variables are the greek letters:
                ph ps ch th et ...
    |-      - true wffs, (turnstile)
                same as above ^
    setvar  - represent sets; only substitutable with other setvars
                variables are the lowercase:
                a b c d e f g ...
    class   - represent classes; technically could be very long expressions:
                variables are the uppercase:
                A B C D E F G

  Proof checkers are really simple because out of all of mathematics,
  only substitution and dvar conditions are needed

  moving on
$)


$(
###############################################################################
  FLOW FREE
###############################################################################
$)

$(
#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#
  Pre solving
#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#

  Some definitions before anything about levels are ever proven

$)

$(
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  Utility theorems
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
$)

fvssunirneli $p |- ( W e. ( F ` G ) -> W e. U. ran F ) $=
  ( cfv crn cuni fvssunirn sseli ) BADAEFCABGH $.


$(
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  VtxWalk (Vertices of a walk)
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
$)

$c VtxWalk $.

cvtxwlk $a class VtxWalk $.

$( Function outputting the vertices of a walk.
   This is construction dependent; in Metamath, a walk is a sequence of edges
   and a sequence of vertices. $)
df-vtxwlk $a
  |- VtxWalk = ( w e. U. ran Walks |-> ran ( 2nd ` w ) ) $.


$(
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  Ffs (flow free solutions)
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
$)

$c Ffs $.

cffs $a class Ffs $.

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

${
  $d G g s $.
  $d G g e $.
  $d a g $.
  $d b g $.
  $d p g $.
  fvffs $p |- ( G e. _V -> ( Ffs ` G ) = ( e e. ~P ( ( Vtx ` G ) X. ( Vtx ` G ) ) |->
  { s e. ~P ( SPaths ` G ) | (
    ( p e. s |-> <. ( ( 2nd ` p ) ` 0 ) , ( lastS ` ( 2nd ` p ) ) >. ) : s -1-1-onto-> e /\
    A. a e. s A. b e. s ( a = b \/ ( ( VtxWalk ` a ) i^i ( VtxWalk ` b ) ) = (/) ) /\
    U. ( VtxWalk " s ) = ( Vtx ` G )
  ) } ) ) $=
    ( vg cv cvtx cfv cxp cpw cmpt cvtxwlk wceq wral w3a cspths crab fveq2 c0 wo
    cc0 c2nd clsw cop wf1o weq cin cima cuni cvv sqxpeqd pweqd eqeq2d rabeqbidv
    cffs 3anbi3d mpteq12dv df-ffs fvex xpex pwex mptex fvmpt ) GBAGHZIJZVGKZLZC
    HZAHDVJUCDHUDJZJVKUEJUFMUGZEFUHEHNJFHNJUIUAOUBFVJPEVJPZNVJUJUKZVGOZQZCVFRJZ
    LZSZMABIJZVTKZLZVLVMVNVTOZQZCBRJZLZSZMULUQVFBOZAVIVSWBWGWHVHWAWHVGVTVFBITZU
    MUNWHVPWDCVRWFWHVQWEVFBRTUNWHVOWCVLVMWHVGVTVNWIUOURUPUSAGCDEFUTAWBWGWAVTVTB
    IVAZWJVBVCVDVE $.
$}

${
  $d G e s $.
  $d E e s $.
  $d b e $.
  $d a e $.
  $d e p $.
  ffsval $p |- ( ( G e. _V /\ E C_ ( ( Vtx ` G ) X. ( Vtx ` G ) ) ) ->
    ( ( Ffs ` G ) ` E ) = { s e. ~P ( SPaths ` G ) | (
      ( p e. s |-> <. ( ( 2nd ` p ) ` 0 ) , ( lastS ` ( 2nd ` p ) ) >. ) : s -1-1-onto-> E /\
      A. a e. s A. b e. s ( a = b \/ ( ( VtxWalk ` a ) i^i ( VtxWalk ` b ) ) = (/) ) /\
      U. ( VtxWalk " s ) = ( Vtx ` G )
    ) } ) $=
    ( ve cvv wcel cvtx cfv wa cv cmpt wf1o cvtxwlk wceq wral w3a cspths cxp wss
    cc0 c2nd clsw cop weq cin c0 wo cima cuni cpw crab cffs fvffs adantr f1oeq3
    3anbi1d adantl rabbidv fvex xpex ssex elpwg syl ibir pwex rabex a1i fvmptd
    wb ) BHIZABJKZVNUAZUBZLZGACMZGMZDVRUCDMUDKZKVTUEKUFNZOZEFUGEMPKFMPKUHUIQUJF
    VRREVRRZPVRUKULVNQZSZCBTKZUMZUNZVRAWAOZWCWDSZCWGUNZVOUMZBUOKZHVMWMGWLWHNQVP
    GBCDEFUPUQVQVSAQZLWEWJCWGWNWEWJVLVQWNWBWIWCWDVSAVRWAURUSUTVAVPAWLIZVMVPWOVP
    AHIWOVPVLAVOVNVNBJVBZWPVCVDAVOHVEVFVGUTWKHIVQWJCWGWFBTVBVHVIVJVK $.
$}

$(
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  Rectangle graphs
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
$)

$c RectGraph $.

crecgr $a class RectGraph $.

df-recgr $a |- RectGraph = ( w e. NN , h e. NN |->
  <. { <. a , b >. | ( a e. NN0 /\ b e. NN0 /\ ( a < w /\ b < h ) ) } ,
    ( i e. ( 0 ..^ ( ( w * ( w - 1 ) ) + ( h * ( h - 1 ) ) ) ) |->
      if ( i e. ( 0 ..^ ( w * ( w - 1 ) ) ) ,
        { <. ( i mod ( w - 1 ) ) , ( |_ ` ( i / ( w - 1 ) ) ) >. , <. ( ( i mod ( w - 1 ) ) + 1 ) , ( |_ ` ( i / ( w - 1 ) ) ) >. } ,
        { <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) >. ,
          <. ( |_ ` ( ( i - ( w * ( w - 1 ) ) ) / ( h - 1 ) ) ) , ( ( ( i - ( w * ( w - 1 ) ) ) mod ( h - 1 ) ) + 1 ) >. } ) ) >. ) $.

${
  $d a b w h W $.
  $d a b w h H $.
  $d w W i $.
  $d h H i $.
  ovrecgr $p |- ( ( W e. NN /\ H e. NN ) -> ( W RectGraph H ) =
    <. { <. a , b >. | ( a e. NN0 /\ b e. NN0 /\ ( a < W /\ b < H ) ) } ,
       ( i e. ( 0 ..^ ( ( W * ( W - 1 ) ) + ( H * ( H - 1 ) ) ) ) |->
         if ( i e. ( 0 ..^ ( W * ( W - 1 ) ) ) ,
            { <. ( i mod ( W - 1 ) ) , ( |_ ` ( i / ( W - 1 ) ) ) >. , <. ( ( i mod ( W - 1 ) ) + 1 ) , ( |_ ` ( i / ( W - 1 ) ) ) >. } ,
            { <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) >. ,
              <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) + 1 ) >. } ) ) >. ) $=
    ( cv clt cc0 c1 cmin co ccj caddc cfzo cmo cdiv cfl cop oveq2d opeq12d wcel
    vw vh cn cn0 wbr wa w3a copab cfv cpr cif cmpt crecgr wceq bi2anan9 3anbi3d
    breq2 opabbidv id oveq1 oveq12d oveqan12d wb eleq2d adantr fveq2d ifbieq12d
    oveq1d preq12d mpteq12dv df-recgr opex ovmpt2a ) UBUCCBUDUDDFZUEUAZEFZUEUAZ
    VOUBFZGUFZVQUCFZGUFZUGZUHZDEUIZAHVSVSIJKZLKZWAWAIJKZLKZMKZNKZAFZHWGNKZUAZWL
    WFOKZWLWFPKZQUJZRZWOIMKZWQRZUKZWLWGJKZWHPKZQUJZXBWHOKZRZXDXEIMKZRZUKZULZUMZ
    RVPVRVOCGUFZVQBGUFZUGZUHZDEUIZAHCCIJKZLKZBBIJKZLKZMKZNKZWLHXRNKZUAZWLXQOKZW
    LXQPKZQUJZRZYEIMKZYGRZUKZWLXRJKZXSPKZQUJZYLXSOKZRZYNYOIMKZRZUKZULZUMZRUNVSC
    UOZWABUOZUGZWEXPXKUUAUUDWDXODEUUDWCXNVPVRUUBVTXLUUCWBXMVSCVOGURWABVQGURUPUQ
    USUUDAWKXJYBYTUUDWJYAHNUUBUUCWGXRWIXTMUUBVSCWFXQLUUBUTVSCIJVAZVBZUUCWABWHXS
    LUUCUTWABIJVAZVBVCSUUDWNYDXAXIYKYSUUBWNYDVDUUCUUBWMYCWLUUBWGXRHNUUFSVEVFUUB
    XAYKUOUUCUUBWRYHWTYJUUBWOYEWQYGUUBWFXQWLOUUESZUUBWPYFQUUBWFXQWLPUUESVGZTUUB
    WSYIWQYGUUBWOYEIMUUHVIUUITVJVFUUDXFYPXHYRUUDXDYNXEYOUUDXCYMQUUBUUCXBYLWHXSP
    UUBWGXRWLJUUFSZUUGVCVGZUUBUUCXBYLWHXSOUUJUUGVCZTUUDXDYNXGYQUUKUUDXEYOIMUULV
    ITVJVHVKTUBUCADEVLXPUUAVMVN $.

  ovrecgrex1 $p |-
    { <. a , b >. | ( a e. NN0 /\ b e. NN0 /\ ( a < W /\ b < H ) ) } e. _V $=
    ( cv cn0 wcel clt wbr wa w3a copab cxp nn0ex 3simpa ssopab2i df-xp sseqtr4i
    xpex ssexi ) CEZFGZDEZFGZUABHIUCAHIJZKZCDLZFFMZFFNNSUGUBUDJZCDLUHUFUICDUBUD
    UEOPCDFFQRT $.

  ovrecgrex2 $p |-
    ( i e. ( 0 ..^ ( ( W * ( W - 1 ) ) + ( H * ( H - 1 ) ) ) ) |-> A ) e. _V $=
    ( cc0 c1 cmin co ccj caddc cfzo ovex mptex ) BEDDFGHIHCCFGHIHJHZKHAENKLM $.

  $( For ~ vtxval and ~ iedgval usage. $)
  ovrecgrelvv $p |-
    ( ( W e. NN /\ H e. NN ) -> ( W RectGraph H ) e. ( _V X. _V ) ) $=
    ( va vb vi cn wcel wa co cv cn0 clt wbr cc0 c1 cmin ccj caddc cfzo cop cdiv
    crecgr w3a copab cmo cfl cfv cpr cif cmpt cvv ovrecgr ovrecgrex1 ovrecgrex2
    cxp opelvv syl6eqel ) BFGAFGHBAUBICJZKGDJZKGURBLMUSALMHUCCDUDZENBBOPIZQIZAA
    OPIZQIRISIEJZNVBSIGVDVAUEIZVDVAUAIUFUGZTVEORIVFTUHVDVBPIZVCUAIUFUGZVGVCUEIZ
    TVHVIORITUHUIZUJZTUKUKUOEABCDULUTVKABCDUMVJEABUNUPUQ $.

  $( The vertices of a rectangular graph $)
  1stovrecgr $p |- ( ( W e. NN /\ H e. NN ) -> ( 1st ` ( W RectGraph H ) ) =
    { <. a , b >. | ( a e. NN0 /\ b e. NN0 /\ ( a < W /\ b < H ) ) } ) $=
    ( vi cn wcel wa co c1st cfv cv cn0 clt wbr cc0 c1 cmin caddc cop crecgr w3a
    copab ccj cfzo cmo cdiv cfl cpr cif cmpt fveq2d ovrecgrex1 ovrecgrex2 op1st
    ovrecgr syl6eq ) BFGAFGHZBAUAIZJKCLZMGDLZMGUTBNOVAANOHUBCDUCZEPBBQRIZUDIZAA
    QRIZUDISIUEIELZPVDUEIGVFVCUFIZVFVCUGIUHKZTVGQSIVHTUIVFVDRIZVEUGIUHKZVIVEUFI
    ZTVJVKQSITUIUJZUKZTZJKVBURUSVNJEABCDUPULVBVMABCDUMVLEABUNUOUQ $.

  $( The indexed edges of a rectangular graph $)
  2ndovrecgr $p |- ( ( W e. NN /\ H e. NN ) -> ( 2nd ` ( W RectGraph H ) ) =
    ( i e. ( 0 ..^ ( ( W * ( W - 1 ) ) + ( H * ( H - 1 ) ) ) ) |->
      if ( i e. ( 0 ..^ ( W * ( W - 1 ) ) ) ,
         { <. ( i mod ( W - 1 ) ) , ( |_ ` ( i / ( W - 1 ) ) ) >. , <. ( ( i mod ( W - 1 ) ) + 1 ) , ( |_ ` ( i / ( W - 1 ) ) ) >. } ,
         { <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) >. ,
           <. ( |_ ` ( ( i - ( W * ( W - 1 ) ) ) / ( H - 1 ) ) ) , ( ( ( i - ( W * ( W - 1 ) ) ) mod ( H - 1 ) ) + 1 ) >. } ) ) ) $=
    ( va vb cn wcel wa co c2nd cfv cv cn0 clt wbr cc0 c1 cmin caddc cop w3a ccj
    crecgr copab cfzo cmo cdiv cfl cpr cif ovrecgr fveq2d ovrecgrex1 ovrecgrex2
    cmpt op2nd syl6eq ) CFGBFGHZCBUCIZJKDLZMGELZMGUTCNOVABNOHUADEUDZAPCCQRIZUBI
    ZBBQRIZUBISIUEIALZPVDUEIGVFVCUFIZVFVCUGIUHKZTVGQSIVHTUIVFVDRIZVEUGIUHKZVIVE
    UFIZTVJVKQSITUIUJZUOZTZJKVMURUSVNJABCDEUKULVBVMBCDEUMVLABCUNUPUQ $.
$}

$(
#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#
  Level 1
#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#
$)

$c Ffscp1 $.

cffscp1 $a class Ffscp1 $.

$( Solutions to flow free (classic pack) level 1 $)
df-ffscp1 $a |- Ffscp1 = ( ( Ffs ` ( 5 RectGraph 5 ) ) ` {
    <. <. 0 , 0 >. , <. 1 , 4 >. >. ,
    <. <. 1 , 3 >. , <. 2 , 0 >. >. ,
    <. <. 2 , 1 >. , <. 2 , 4 >. >.
  } u. {
    <. <. 3 , 3 >. , <. 4 , 0 >. >. ,
    <. <. 3 , 4 >. , <. 4 , 1 >. >.
  } ) $.
