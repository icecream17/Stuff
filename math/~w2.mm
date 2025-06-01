$( Part of https://github.com/xamidi/pmGenerator/discussions/2 $)

$(
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  Walsh's second axiom
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  Currently this file is rather informal, containing many unused theorems
  reflecting much manual experimentation.

$)

$( setup $)
$c ( $.
$c ) $.
$c -> $.
$c -. $.
$c wff $.
$c |- $.
$v ph $.
$v ps $.
$v ch $.
$v th $.
$v ta $.
$v et $.
$v ze $.
$v si $.
$v rh $.
$v mu $.
$v la $.
$v ka $.
$v al $.
$v be $.
$v ga $.
$v de $.
$v ep $.
wph $f wff ph $.
wps $f wff ps $.
wch $f wff ch $.
wth $f wff th $.
wta $f wff ta $.
wet $f wff et $.
wze $f wff ze $.
wsi $f wff si $.
wrh $f wff rh $.
wmu $f wff mu $.
wla $f wff la $.
wka $f wff ka $.
wal $f wff al $.
wbe $f wff be $.
wga $f wff ga $.
wde $f wff de $.
wep $f wff ep $.

${
  min $e |- ph $.
  maj $e |- ( ph -> ps ) $.
  ax-mp $a |- ps $.
$}

${
  mp2.1 $e |- ph $.
  mp2.2 $e |- ps $.
  mp2.3 $e |- ( ph -> ( ps -> ch ) ) $.
  $( A double modus ponens inference.  (Contributed by NM, 5-Apr-1994.) $)
  mp2 $p |- ch $=
    ( wi ax-mp ) BCEABCGDFHH $.
$}

${
  mp2b.1 $e |- ph $.
  mp2b.2 $e |- ( ph -> ps ) $.
  mp2b.3 $e |- ( ps -> ch ) $.
  $( A double modus ponens inference.  (Contributed by Mario Carneiro,
     24-Jan-2013.) $)
  mp2b $p |- ch $=
    ( ax-mp ) BCABDEGFG $.
$}






$( The first and second antecedents mean that ` ( ps -> ch ) ` by mpi ,
   and the consequence simplifies to ` ( th -> ( ps -> ch ) ) ` . $)
ax-w2 $a |- ( ph ->
   ( ( ps -> ( ph -> ch ) ) ->
       ( ( -. ch -> ( ( -. th -> et ) -> ps ) ) -> ( th -> ch ) ) ) ) $.

${
  w2i.1 $e |- ph $.
  w2i $p |- ( ( ps -> ( ph -> ch ) ) ->
           ( ( -. ch -> ( ( -. th -> et ) -> ps ) ) -> ( th -> ch ) ) ) $=
    ( wi wn ax-w2 ax-mp ) ABACGGCHDHEGBGGDCGGGFABCDEIJ $.

  w2ii.1 $e |- ( ps -> ( ph -> ch ) ) $.
  w2ii $p |- ( ( -. ch -> ( ( -. th -> et ) -> ps ) ) -> ( th -> ch ) ) $=
    ( wi wn w2i ax-mp ) BACHHCIDIEHBHHDCHHGABCDEFJK $.
$}

$(
ph
( ( -. th -> et ) -> ( ph -> ch ) )
---
( th -> ch )
$)

$( ` ( ps -> ( ( ph -> ( ( ze -> ( ph -> si ) ) ->
                         ( ze -> ( rh -> si ) ) ) ) -> ch ) ->
                         ( ps -> ( th -> ch ) ) ) `  $)
w2-0 $p |- ( ( ps -> ( ( ph ->
   ( ( ze -> ( ph -> si ) ) ->
       ( ( -. si -> ( ( -. rh -> mu ) -> ze ) ) -> ( rh -> si ) ) ) ) ->
ch ) ) ->
       ( ( -. ch -> ( ( -. th -> et ) -> ps ) ) -> ( th -> ch ) ) ) $=
  ( wi wn ax-w2 ax-mp ) AFAGJJGKHKIJFJJHGJJJJZBNCJJCKDKEJBJJDCJJJAFGHILNBCDELM
  $.

w2-1 $p |- ( ( -. ( ( -. ( ph -> ps ) -> ( ( -. ch -> th ) -> ( ta
 -> ( ( et -> ( ( ze -> ( et -> si ) ) -> ( ( -. si -> ( ( -. rh -> mu
 ) -> ze ) ) -> ( rh -> si ) ) ) ) -> ps ) ) ) ) -> ( ch -> ( ph -> ps
  ) ) ) -> ( ( -. la -> ka ) -> ( -. ps -> ( ( -. ph -> al ) -> ta ) ) )
 ) -> ( la -> ( ( -. ( ph -> ps ) -> ( ( -. ch -> th ) -> ( ta -> ( ( et
 -> ( ( ze -> ( et -> si ) ) -> ( ( -. si -> ( ( -. rh -> mu ) -> ze )
 ) -> ( rh -> si ) ) ) ) -> ps ) ) ) ) -> ( ch -> ( ph -> ps ) ) ) ) ) $=
  ( wi wn w2-0 ax-w2 mp2 ) EFGFHNNHOIOJNGNNIHNNNNBNNZBOAOMNENNZABNZNNZTUBUAOCOD
  NSNNCUANNZNNUCOKOLNTNNKUCNNFEBAMGHIJPTSUACDQUBTUCKLQR $.

w2-2 $p |- ( ph -> ( ( -. ( ( -. ps -> ( ( -. ch -> th ) -> (
  -. ps -> ( ( -. ta -> et ) -> -. ph ) ) ) ) -> ( ch -> ps ) ) -> ( ( -.
  ze -> si ) -> ta ) ) -> ( ze -> ( ( -. ps -> ( ( -. ch -> th ) -> ( -.
      ps -> ( ( -. ta -> et ) -> -. ph ) ) ) ) -> ( ch -> ps ) ) ) ) ) $=
  ( wn wi ax-w2 w2-0 mp2 ) BIZEIFJAIZJJZEBJJZEQNCIDJPJJCBJJZJJRIGIHJEJJGRJJZJJS
  IZOTBJZJQJJASJQERGHKTOBEFKEQSAUAPBCDLM $.

w2-3 $p |- ( ph -> ( ( -. ps -> ( ( -. ch -> th ) -> ( -. ps -> (
( -. ( ( -. ta -> ( ( -. et -> ze ) -> -. ph ) ) -> ( et -> ta ) ) -> si
) -> -. ( rh -> ( ( mu -> ( rh -> la ) ) -> ( ( -. la -> ( ( -. ka -> al
               ) -> mu ) ) -> ( ka -> la ) ) ) ) ) ) ) ) -> ( ch -> ps ) ) ) $=
  ( wi wn ax-w2 w2-2 mp2 ) IJIKNNKOLOMNJNNLKNNNNZBOZCODNTEOFOGNAOZNNFENNZOHNSON
  NNNCBNNZOZUAUDENZNUBNNAUCNIJKLMPUDUAEFGPSBCDUBHAUEQR $.

w2-4 $p |- ( ( ph -> ( ( ps -> ( ( -. ch -> ( ( -. th -> ta )
 -> ( -. ch -> ( ( -. ( ( -. et -> ( ( -. ze -> si ) -> -. ps ) ) -> ( ze
-> et ) ) -> rh ) -> -. ( mu -> ( ( la -> ( mu -> ka ) ) -> ( ( -. ka ->
 ( ( -. al -> be ) -> la ) ) -> ( al -> ka ) ) ) ) ) ) ) ) -> ( th -> ch ) ) )
 -> ga ) ) -> ( ( -. ga -> ( ( -. de -> ep ) -> ph ) ) -> ( de -> ga ) ) ) $=
  ( wn wi w2-3 w2i ) BCRZDRESUBFRGRHSBRSSGFSSRISJKJLSSLRMRNSKSSMLSSSSRSSSSDCSSS
  AOPQBCDEFGHIJKLMNTUA $.

${
  w2-5g.1 $e |- ph $.
  $( Consequence of ~ w2pm2.27 and ~ w2a1d using much fewer steps. $)
  w2-5g $p |- ( ( ph -> ps ) -> ( ch -> ps ) ) $=
    ( wth wi wn w2-3 ax-w2 w2i w2ii ax-mp ) CBFZGZABFZGZEGZQEFZCGZFFEEFZFZGEFPQ
    RNGFFTFGEFEETFQREFFTFFFGFFFZFUAOFZFFOMFNOUAEEEEEEEEEEHBGZSUDEFZFUAFFUCMOUBU
    DSEEEIAUABCUEDJKL $.
$}

w2-5 $p |- ( ( ( ph -> ( ( ps -> ( ph -> ch ) ) -> ( ( -. ch
 -> ( ( -. th -> ta ) -> ps ) ) -> ( th -> ch ) ) ) ) -> et ) -> ( ze ->
                                                                     et ) ) $=
  ( wi wn ax-w2 w2-5g ) ABACHHCIDIEHBHHDCHHHHFGABCDEJK $.

w2-6 $p |- ( ( ( -. ph -> ps ) -> ch ) -> ( ( -. ( ph -> th ) ->
  ( ( -. ta -> et ) -> ( ch -> ( ( ze -> ( ( si -> ( ze -> rh ) ) -> ( ( -.
   rh -> ( ( -. mu -> la ) -> si ) ) -> ( mu -> rh ) ) ) ) -> th ) ) ) ) ->
                                                  ( ta -> ( ph -> th ) ) ) ) $=
  ( wi wn w2-3 w2-1 ax-mp ) ADLZMEMFLCGHGILLIMJMKLHLLJILLLLDLLLLEQLLZMZAMZBLCLZ
  MZDMZMALUBTTALZSMLLAALZLMALAAUELTUDALLUELLLMLLLZLUCUALLLUARLSUAUCAAAAAAAAAANA
  DEFCGHIJKUAUFBOP $.

${
  $( stuff -> w2 -> ps $)
  w2-7g.1 $e |- ( -. ( ph -> ps ) -> ( ( -. ch -> th ) -> ( ta ->
    ( ( et -> ( ( ze -> ( et -> si ) ) ->
         ( ( -. si -> ( ( -. rh -> mu ) -> ze ) ) -> ( rh -> si ) ) ) )
                                                              -> ps ) ) ) ) $.
  $( Technically ~ w2-7 has a general form $)
  w2-7g $p |- ( ( -. ( ch -> ( ph -> ps ) ) -> ( ( -. la -> ka ) ->
       ( ( -. ph -> al ) -> ta ) ) ) -> ( la -> ( ch -> ( ph -> ps ) ) ) ) $=
    ( wn wi w2-6 w2i ax-mp ) AOMPEPZABPZOCODPEFGFHPPHOIOJPGPPIHPPPPBPPPPZCUAPZP
    PUCOKOLPTPPKUCPPAMEBCDFGHIJQUBTUCKLNRS $.
$}

w2-7 $p |- ( ( -. ( ph -> ( ps -> ch ) ) -> ( ( -. th -> ta )
-> ( ( -. ps -> et ) -> ( -. ch -> ( ( -. ( ze -> ( ( si -> ( ze -> rh )
   ) -> ( ( -. rh -> ( ( -. mu -> la ) -> si ) ) -> ( mu -> rh ) ) ) ) ->
          ka ) -> -. ph ) ) ) ) ) -> ( th -> ( ph -> ( ps -> ch ) ) ) ) $=
  ( wn wi w2-6 w2-0 ax-mp ) BMFNCMGHGINNIMJMKNHNNJINNNNZMLNAMZNNZNZBCNZMZSUCCNZ
  NTRCNNNNAUBNZNNUEMDMENUANNDUENNBFTCAUDGHIJKOUCUAUEDESCRLPQ $.

w2id $p |- ( ph -> ph ) $=
  ( wi wn w2-0 w2-3 mp2 ) AAAABZBACZHABZABBGBBBZABZKBZHHJCZABHHIHCBBGBCABMBBBZB
  KBBGHIMBBGBZKBZHMIBOBBKBBKCZQOCABQHIQCBBGBCABMBBBZBPBBLAOAJIAAAADQKOAAAAAAAAA
  AEHPKKRMAAADFHAJAAAAAAAAAAEAKAANAAAADF $.

w2-9 $p |- ( ( ph -> ( ( ps -> ps ) -> ch ) ) -> ( ( -. ch ->
                         ( ( -. th -> ta ) -> ph ) ) -> ( th -> ch ) ) ) $=
  ( wi w2id w2i ) BBFACDEBGH $.

w2-10 $p |- ( ph -> ( ps -> ( ch -> ( th -> ( ta -> ps ) ) ) ) ) $=
  ( wn wi ax-w2 w2-3 w2-1 w2-0 mp2 w2i ) BFZEFAGNCFAGZFAGDFZGGZGZGZQOBGGZSEBGZG
  GZUAFZPUCBGZGTGGDUAGZGGGZBCUEGZGZFZAFZUIOUBGZGZGUKFUEFZFAGUJGZGUMUKGGZGGZAUHG
  ZSTUADUDHUIUJUKUMAHUGFZUFGZUOUSUHGZGZUPUQGZGGVBFZUFFZURFAGVDUJUJAGZVCFGGAAGZG
  FAGAAVFGUJVEAGGVFGGGFZGGGZGUSGGUFVBGUSUOUHAULHVCUFURAAAAAAAAAAIVAUSVBUFVHUTFZ
  UOGZUKUTGGVIUOFZVIFZAGVKUJVEVLGGVFGFAGVGGGGZGVJGGVACUEBRUBUCPBOAUKUNAJVIUOVIA
  AAAAAAAAAIOVJUTUOVMQBEAKLMLL $.

$( Proof minimization is different
   (Contributed by SN, 14-Jun-2024.) $)
w2-10b $p |- ( ps -> ( ch -> ( th -> ( ta -> ps ) ) ) ) $=
  ( wph wi wn ax-w2 w2-10 ax-mp ) EEEEFZFEGZLEFEFFKFFFZABCDAFFFFEEEEEHMABCDIJ
  $.

w2-11 $p |- ( ( ph -> ( ( ps -> ( ch -> ( th -> ( ta -> ps ) ) ) )
   -> et ) ) -> ( ( -. et -> ( ( -. ze -> si ) -> ph ) ) -> ( ze -> et ) ) ) $=
  ( wi w2-10b w2i ) BCDEBIIIIAFGHBCDEJK $.

w2ax1 $p |- ( ph -> ( ps -> ph ) ) $=
  ( wn wi w2-0 ax-w2 w2-11 mp2 ) ACZAAAADZDIIADADDJDDDZCADZIDDZKADDZIBCADZMDDBA
  DZDDPCZIQADZDNDDAPDAMABAAAAAEQIAKAFNIOILPARGH $.

$( ( stuff -> w2 -> ps ) -> ( morestuff -> ps ) $)
w2-13 $p |- (
  ( -. ( ph -> ps ) ->
    ( ( -. ch -> th ) ->
      ( ( ta -> ( et -> ph ) ) ->
        ( ( ze -> ( ( si -> ( ze -> rh ) ) -> ( ( -. rh -> ( ( -. mu -> la ) -> si ) ) -> ( mu -> rh ) ) ) ) ->
          ps )
  )
 ) ) -> ( ch ->
                                                            ( ph -> ps ) ) ) $=
  ( wi wn w2-3 w2-7 w2-6 mp2b ) EFALLZMZAMZAAAALZLTTALZALLUALLLMZALEMLZLZMZFMAL
  ZMALUFTUBSMLLUALMALUCLLLZLUGUELLLUERLABLZMCMDLRGHGILLIMJMKLHLLJILLLLBLLLLCUIL
  LSUEUGAAAAAAAAAANEFAUEUHAAAAAAAOAUDRBCDGHIJKPQ $.

w2luk3 $p |- ( ph -> ( -. ph -> ps ) ) $=
  ( wn wi ax-w2 w2-13 ax-mp ) ACZBDZCZHJBDZDBCZAAAADZDHHADADDMDDDZCADZHDDNBDDDD
  AIDJHBNAEHBAKLOAAAAAFG $.

$( Note: Uses the old proof by GG $)
w2luk2 $p |- ( ( -. ph -> ph ) -> ph ) $=
  ( wn ax-w2 w2ax1 ax-mp w2-5 w2-9 w2-3 w2-0 w2-2 w2-13 w2-11 w2-4 w2-7 w2-10
  wi ) ABZQAPZBZAAPZBZAPZRPZPZRPZPZRAPZUEBZQBZAPZUDTRPPZPZPZUFUKBZUJBZUNAPZPQRU
  OPPTPZPPULPZUMUQRUQRPPZUKPPZURUQRRTACUSUTURPRUQDUSUQUKUJUPCEEUNUOAAAULUHFEUKS
  UDBZQRSBAPZBZPPTPZBAPUAPZPZUDPZPZUEPPZUMUFPZUDARUDVEGVHVIVJPVGBZVBVAAATPQUGPT
  PPPZBZAPZVFPPVLUDPPZPZPZVHVPBZVKBAPZTPZPZVQVTBZVRBZWBAPZPQVNWCPZPVLAPZPZPPZWA
  WBWCAVLACWGUAVSBZUBPQRWIPPTPZPPVTPZPZWHWAPWKBZWGBZUJWNQRWMBPPTPBAPVMPPPZPQWGP
  ZPPZWLWMWGQAAAAAAAAAAHWPWJWPTPZPZWKPPZWQWLPZWPWJTVSUBCWSWTXAPWRBZWJBZXBAPZPQR
  XCPPTPZPPZWSXBXCAAACXEWFXEAPPZWRPPZXFWSPZXEWFAAWECXGXHXIPAAAAAAXEFXGXEWRWJXDC
  EEEWSWPWKWGWOCEEEUAWGVTVRWDWIAAAIEETVOBZVCXJAPZPVDPPVPPPWAVQPTUDVLAVDAVBXKJXJ
  TVPVKAVCAAAIEEVFUDSAVAVNAAAAAKEVHUKUEQACEEEVLUFUGPZAAAAACZXLBZVNQPZPZVLXLPZVL
  XPXMXPBZVNXLPZPZVLXPPZXSBZXRBZUFBAPZBAPYCQRYBBPPTPBAPVMPPPZPYDXRPZPPZXTYBXRYD
  AAAAAAAAAAHYFXNVNBZAPZXRQSAPZXPPPUGPZPZPZPZXSPZPZYGXTPZYOBZYFBZUGBZBAPYSQRYRB
  PPTPBAPVMPPPZPYTYFPZPPZYPYRYFYTAAAAAAAAAAHUUBYLUUBXLPPZYOPPZUUCYPPZUUBYLXLVNA
  CUUDUUEUUFPXRQYJXNVNUGUFALUUDUUBYOYFUUACEEEYNYPYQPYKBZYCYIYCQRUUGBPPTPBAPVMPP
  PZPVNXRPZPPYLPZYMPZYNYMBZUUJBZQRYIBZPPTPZBAPUUMQRUULBPPTPBAPVMPPPZPUUOUUJPZPP
  ZUUKUULUUJUUOAAAAAAAAAAHUUQYLBZUUNUUSAPZPUUOPPYMPPUURUUKPUUOUUGXRVNAAAAAAAAAA
  YLYIUUTMUUSUUQYMUUJUUPUUNAAAIEEYNBZUUKBZQRXNBZPPTPZBAPUVBQRUVABPPTPBAPVMPPPZP
  UVDUUKPZPPZUUKYNPZUVAUUKUVDAAAAAAAAAAHUVFUULUVCUULAPZPUVDPPYNPPZUVGUVHPUUJUVJ
  UUIXPUUIAPZPZYKPPZUUJUUIXPARACUVLUVMUUJPUVKBZXRUVNAPZPQUUIPZWFPZPPZUVLUVNXRAV
  LACUVQQUUIBZUJUVSQRUIPPTPBAPVMPPPZPUVPPPUVKPPUVRUVLPAUVPAUUIUVTAAAAIUVQQUUIQA
  AAAAAAAAAUVKXPUVOMEEUVLUUIYKXRUUHCEEUUJUVDYMXNUVICEUULUVFYNUUKUVEUVCAAAIEEEYN
  YFXSXRYECEEEXLYAPZXTYAPYABZXPUUIYAPZPZPZUWAUWDBZUWBBZUWFUUIPZPUVSUWGAPUWGPZPU
  WBUUIPPPPUWEUWFUWGUUIUWBACXPUUIYAUWBUWHUWIAAAAAANEUWCXRVNUUIPZPZYAPPZUWEUWAPZ
  AUUIXPVLAAAAAIUWKUWLUWMPUWJBZYCVNYHPZPZUWNVNYIUWPPPPZPPZUWKUWNUWPUWNVNYIOUWQV
  LUWJPPUWRUWKPVNVNXRVLAAAAAAAANAUWQUWJXRUWOAAAAIEEUWKUWCYAXLXOCEEEAXLXPVLAAAAA
  IEEEQRRPXLPPXPXQPQRARUCCQRXLVLAGEEEE $.

${
  w2mpi.1 $e |- ph $.
  w2mpi.2 $e |- ( ps -> ( ph -> ch ) ) $.
  w2mpi $p |- ( ps -> ch ) $=
    ( wn wi w2luk2 w2ax1 ax-mp ax-w2 ) CFZBFBGBGZGZBCGZMNBHMLIJBACGGZNOGZEAPQGD
    ABCBBKJJJ $.
$}

${
  $( My proof of ~ a1d was actually ~ com12 in disguise $)
  w2com12.1 $e |- ( ph -> ( ps -> ch ) ) $.
  w2com12 $p |- ( ps -> ( ph -> ch ) ) $=
    ( wn wi w2luk2 w2ax1 ax-mp ax-w2 w2mpi ) CEZAEAFAFZFZBACFZMNAGMLHIABCFFBNOF
    DBACAAJKK $.
$}

${
  w2a1d.1 $e |- ( ps -> ch ) $.
  w2a1d $p |- ( ps -> ( ph -> ch ) ) $=
    ( wi w2ax1 ax-mp w2com12 ) ABCBCEZAIEDIAFGH $.
$}

w2pm2.27 $p |- ( ph -> ( ( ph -> ps ) -> ps ) ) $=
  ( wi w2id w2com12 ) ABCZABFDE $.

$(
( th -> ps ) -> ( ( th -> ps ) -> ch ) -> ch
( ps -> ch ) -> ( th -> ps ) -> ch


( th -> ps ) -> ( ( th -> ps ) -> ( ps -> ch ) ) -> ( ps -> ch )
ps -> ( ( th -> ps ) -> ( ps -> ch ) ) -> ( ps -> ch )

ps -> ( ( th -> ps ) -> ph ) -> ph
( -. ps -> ch ) -> ( ( th -> ( -. ps -> ch ) ) -> ph ) -> ph

( ( ( th -> ( -. ps -> ch ) ) -> ph ) -> ph ) -> ta




$)

$( Simplify ~ ax-w2 , collapsing the first antecedent

   id + com12 + mpi $)
w2s $p |- ( ( ps -> ch ) -> ( ( -. ch -> ( ( -. th -> et ) -> ps ) ) ->
                                                      ( th -> ch ) ) ) $=
  ( wi wn w2pm2.27 ax-w2 w2mpi ) AABEZBEEJBFCFDEAEECBEEABGJABCDHI $.

$( ~ luk-1 applied to ~ w2luk3 without ~ luk-1

   Using this, we can transform ` ( ( ph -> ps ) -> ch ) ` into
   ` ( ph -> ch [ -. ph ] ) `

   and ` ( ph -> ps ) ` into ` ( ph -> ps [ ( -. ph -> al ) ] ) `

   This is very similar to jarl

   id + id + ax1 + mpi + mpi + com12
$)
w2luk1luk3 $p |- ( ( ( -. th -> et ) -> ch ) -> ( th -> ch ) ) $=
  ( wn wi w2id w2ax1 ax-mp w2s w2mpi ) ADZBDCEZLEZEZLAEBAEMNLFMKGHLABCIJ $.

w2peirce $p |- ( ( ( ch -> al ) -> ch ) -> ch ) $=
  ( wph wi wn ax-w2 w2luk3 w2com12 w2a1d w2s w2mpi ) CCCCDZDCEZMCDCDDLDDDZABDZA
  DZACCCCCFAEZNECDZODDPNADRQOAQBABGHIOANCJKK $.

$( Miscallaneous short provable statements $)
w2-a $p |- ( ph ->
          ( ( -. ga -> ( ( -. de -> ep ) -> -. ph ) ) -> ( de -> ga ) ) ) $=
  ( wch wn wi w2-4 w2luk1luk3 ax-mp ) AFZEEFZLEGZLLMLGGEEGZGFEGEENGLMEGGNGGGFGG
  GGNGGBGZGBFCFDGKGGCBGGZGAPGKEEEEEEEEEEEEEBCDHPAOIJ $.

w2-b $p |- ( ph -> ( -. ( -. ph -> ps ) -> ch ) ) $=
  ( wn wi w2luk3 w2luk1luk3 ax-mp ) ADBEZIDCEZEAJEICFJABGH $.

w2-c $p |- ( ( -. ch -> ( ( -. th -> et ) -> ch ) ) -> ( th -> ch ) ) $=
  ( wi wn w2id w2s ax-mp ) AADAEBECDADDBADDAFAABCGH $.

w2-d $p |- ( ( ( ps -> ( -. th -> et ) ) -> ch ) -> ( th -> ch ) ) $=
  ( wn wi w2id w2a1d w2ax1 ax-mp w2s w2mpi ) BEZCEDFZANFZFZFZOBFCBFPQANNNGHPMIJ
  OBCDKL $.

${
  $( The antecedent is in general ~ w2-13 :
      ( -. ( ph -> ps ) ->
      ( ( -. ch -> th ) ->
      ( ( ta -> ( et -> ph ) ) ->
      ( ( ze -> ( ( si -> ( ze -> rh ) ) -> ( ( -. rh ->
           ( ( -. mu -> la ) -> si ) ) -> ( mu -> rh ) ) ) ) -> ps ) ) ) )

     The consequent is ( ch -> ( ph -> ps ) ) but ch is only eliminable
     when ( -. ch -> th ) is not in the antecedent. a1d conveniently ignores
     precisely the one antecedent.

     Hard to use since ` ps ` is both in the antecedent and the consequent.
  $)
  w2-e.1 $e |- ( -. ( ph -> ps ) -> ps ) $.
  w2-e $p |- ( ph -> ps ) $=
    ( wch wi wn ax-w2 w2a1d w2-13 ax-mp ) DDDDEZEDFZLDEDEEKEEEZABEZDDDDDGNFZMFD
    EZDDAEEZMBEZEZEEMNEPOSQORMOBCHHHABMDDDDDDDDIJJ $.
$}

$( D(w2-13 w2-a) or D(w2-13 w2-3) results in ( ax-w2 -> et ) -> ( ze -> et ) $)

${
  $( Yet another variant of ( stuff -> w2 -> ta ) then ( stuff -> ta ) $)
  w2-f.1 $e |- ( ( -. ph -> ps ) -> ch ) $.
  w2-f $p |- ( ( -. ( th -> ( ph -> ta ) ) -> ( ( -. et -> ze ) ->
   ( -. ( ph -> ta ) -> ( ( -. th -> si ) -> ( ch -> (
     ( rh -> ( ( mu -> ( rh -> la ) ) ->
             ( ( -. la -> ( ( -. ka -> al ) -> mu ) ) ->
                                  ( ka -> la ) ) ) ) -> ta ) ) ) ) ) ) ->
     ( et -> ( th -> ( ph -> ta ) ) ) ) $=
    ( wi wn w2-6 w2com12 w2i ax-mp ) AEOZPDPHOCIJIKOOKPLPMOJOOLKOOOOEOOOOZAPBOC
    OZDUAOZOOUDPFPGOUBOOFUDOOUCUBUDABCEDHIJKLMQRUCUBUDFGNST $.
$}

${
  $( Equivalent to syl (luk-1) but much less useful.  When either hyp is id
     this is w2luk1luk3 .  When the first hyp is luk2 this is idi .

     When the 2nd hyp is com12'd we get ( ph -> -. ch -> ta ) given hyp 1
     or ch version if hyp 1 is -. ch version, or use luk3 on hyp2

     ta := ( -. ph -> ps ) -> ta

     Relatively useless when ta implies ph

     If we have ( ph -> ch ) as the first hyp and ( ch[-. ph -> ps] -> ta ) we get
     ( ph -> ta )

     If we have ( ph -> ( -. ps -> ch ) -> th ) as first hyp we need
     ( ( ph -> th ) -> ta )

     ( -. ps -> ch ) -> [-.] ph -> th
     ( -. ph -> th ) -> ta -> et


     com12 + a1d $)
  w2-g.1 $e |- ( ( -. ph -> ps ) -> ch ) $.
  w2-g.2 $e |- ( ch -> ta ) $.
  w2-g $p |- ( ph -> ta ) $=
    ( wet wi wn ax-w2 w2a1d w2ax1 ax-mp w2-f ) GGGGHZHGIZPGHGHHOHHHZADHZGGGGGJZ
    QQRHZSTIZQIGHZRIZUBCQDHHZHZHZHZHZQTHUGUHUFUGUEUFUDUEQCDFKUDUBLMUEUCLMUFUBLM
    UGUALMABCQDQGGGGGGGENMMM $.
$}

${
  w2-h.1 $e |- ( ( -. ph -> ps ) -> ( ( -. th -> et ) -> ch ) ) $.
  w2-h $p |- ( ph -> ( th -> ch ) ) $=
    ( wn wi w2luk1luk3 w2-g ) ABDGEHCHDCHFCDEIJ $.
$}

$( Bruh the same thing I got before (New usage is discouraged.) $)
w2-a-alt $p |- (
    ph                                        -> (
    ( -. ps -> ( ( -. ch -> th ) -> -. ph ) ) -> (
    ch                                        -> ps ) ) ) $=
  ( wta wi wn ax-w2 w2-h ax-mp ) EEEEFZFEGZLEFEFFKFFFZABGCGDFAGZFFCBFFZFEEEEEHM
  EOAMGEFZBFPNBCDHIJ $.

$( There's a lot of ( -. ph -> ps ) so I would like to show something about
   ( ph -> -. ps ) or -. -. ph

   ( ( -. th -> et ) -> -. -. th ) proves ( th -> -. -. th )
   $)


$( The version with ph and th commuted is w2-c $)
w2-i $p |- ( ( -. ch -> ( ( -. th -> et ) -> ( ph -> ch ) ) ) ->
                                                 ( ph -> ( th -> ch ) ) ) $=
  ( wn wi w2id ax-w2 w2mpi w2com12 ) ABECEDFABFZFFZCBFZKKFALMFKGAKBCDHIJ $.

${
  w2jarri.1 $e |- ( ( th -> ch ) -> ta ) $.
  $( ax-1 syllogism (Alt proof: w2-i w2mpi could also be w2-c w2mpi) $)
  w2jarri $p |- ( ch -> ta ) $=
    ( wet wn wi ax-w2 w2-i w2mpi w2-g ) ABFEGEEEEGZGEFZMEGEGGLGGGZAGGZBAGZCNAFO
    GPEEEEEHNABEIJDK $.
$}

w2-gt $p |- ( ( ( -. th -> et ) -> ps ) -> ( ( ps -> ch ) ->
                                                      ( th -> ch ) ) ) $=
  ( wn wi w2s w2com12 w2jarri ) CEDFAFZBEZABFZCBFZFLKJFMABCDGHI $.

$( Similar to w2-gt w2-a w2-n, note that changing
                                   vvvvv to ( -. ( ta -> ps ) ) is possible
   with w2-o $)
w2-a3 $p |- ( ( ( -. th -> et ) -> -. ps ) -> ( ps -> ( th -> ch ) ) ) $=
  ( wn wi w2-a w2com12 w2jarri ) CEDFAEFZBEZACBFZFAKJFLABCDGHI $.

w2-i2 $p |- ( ( ( -. th -> et ) -> ( ps -> ch ) ) -> ( ps -> ( th -> ch ) ) )
                                                                             $=
  ( wn wi w2-i w2jarri ) CEDFABFFBEACBFFABCDGH $.

$( luk3 mpi com12 id $)
w2-l $p |- ( ( -. ( -. ps -> ch ) -> ( ( -. th -> et ) -> ps ) ) ->
                                                 ( th -> ( -. ps -> ch ) ) ) $=
  ( wn wi w2luk3 w2s ax-mp ) AAEBFZFJECEDFAFFCJFFABGAJCDHI $.

$( A consequence of w2-m that turns out not to need it.  Also see w2-a3 where
   ps is flopped. $)
w2-n $p |- ( ( ( -. si -> rh ) -> ps ) -> ( si -> ( -. ps -> ze ) ) ) $=
  ( wn wi w2-l w2jarri ) CEDFAFAEBFZECIFABCDGH $.

$( a1d closed; a1dd applied to id, CCpqCpCrq $)
w2a1dt $p |- ( ( ph -> ch ) -> ( ph -> ( th -> ch ) ) ) $=
  ( wps wi wn w2-i w2jarri ) ABEZCFDEZACBEEZJIEBFKABCDGHH $.

$( Also is luk1 ax1, CCCpqrCqr, at least as powerful as ax1 bc D22 $)
w2jarr $p |- ( ( ( ph -> ps ) -> ch ) -> ( ps -> ch ) ) $=
  ( wi w2pm2.27 w2jarri w2com12 ) BABDZCDZCBAICDHCEFG $.

$( jarrd is doable with com12 jarri com12 $)
$( w2jarr + a1dd is doable with w2a1dt jarrd (subst ph) $)

$( Simpler than w2-b $)
w2-j $p |- ( ph -> ( -. ( ps -> ph ) -> ch ) ) $=
  ( wi wn w2luk3 w2jarri ) ABBADZECDHCFG $.

$( A random theorem found by pmGenerator from the system:
   (1) ax-w2
   (2) w2jarr
   (3) w2luk2

   Theorems of the form ` ( -. ( ph -> ps ) -> ch -> ph ) ` seem both hard to
   prove and not very useful, as -. ( ph -> ps ) is difficult to satisfy.
$)
w2-k $p |- (
  ( -. ( ( ( ph -> ps ) -> ch ) -> ch ) -> ( ( -. th -> ta ) -> ps ) ) ->
  ( th -> ( ( ( ph -> ps ) -> ch ) -> ch ) )                               ) $=
  ( wi wn w2luk2 w2jarr ax-w2 w2mpi w2jarri mp2 ) ABFCFZGNFNFZBCGZOFZNCFZFZFZRG
  DGEFBFFDRFFZNHNBCFFBSABCIBNCNNJKOPTUAFQBRDEJLM $.

$( Another random theorem found by pmGenerator: DD2DDD2D21333

   pmGenerator generates basically every theorem possible but doesn't seem to
   have a way to filter anything. For example, theorems like ` ( ph -> T ) `
   and ` ( -. T -> ph ) ` can appear many times in disguise.
   EDIT: see issue #2 for a more fair and accurate explanation

   Like always, we prove something that isn't really all that useful.
   Looking at this D proof: DD2DDD2D21333 we can see that given

   a: T        (with arbitrary amount of antecedents)
   b: a > 3
   c: -b > b

   Thanks to jarr applied to ax-w2 we have:
   t > (c > b) > ((-3 > (-c > c) > c) > c > 3)

   Thanks to the definition of c the second hyp is provable so c > 3,
   or expanded:
      (-(a > 3) > (a > 3)) > 3

   If we don't take the definition of c, we still can prove the 1,3 ant so:
      (c > (a > 3)) > c > 3                  with definition of a

   Which is useless since the => version is already provable.

   Other proofs like D2DDDD11D221D22 hint at things like (def-a)
   ((-0 > 1) > -a) > 0 > 4

   It seems for full generality we would need mpii which allows:
      a > (c > (a > 3)) > c > 3              with no definition
$)

$( pmGenerator: mpi + ~20 $)
w2-m $p |- ( ph -> ( ( ps -> (
  ( ( -. ch -> ( ( -. th -> ta ) -> -. ( et -> ph ) ) ) -> ( th -> ch ) ) ->
                               ze ) ) ->
  ( ( -. ze -> ( ( -. si -> rh ) -> ps ) ) -> ( si -> ze ) ) ) ) $=
  ( wmu wi wn ax-w2 w2-3 w2-0 ax-mp w2mpi ) JJJJKZKJLZSJKZJKKRKKKZABCLDLEKFAKZL
  ZKKDCKKZGKKGLHLIKBKKHGKKKZJJJJJMUAUEKZLZALZFLJKUHSTUGLKKRKLJKUALZKKKZKUBKKZAU
  FKZUGAFJJJJJJJJJJNUBUELZUIUMJKZKSTUIKKRKZKKUFKZKZUKULKUPLZUCURCKZKUDKKZUQURUC
  CDEMUDUEKZUTUQKZUDBGHIMVBLZVALZUOLJKVDSTVCLKKRKLJKUIKKKZKUOVAKZKKZVAVBKZVCVAU
  OJJJJJJJJJJNVFUDVFUPKKVBKKVGVHKVFUDUPUBUSMUDVFVBVAVEUOUEUAUNOPPPPUMUBUFAUJUIJ
  JJOPPQ $.

$( Alternate w2-l, turns out the pmGenerator proof is just barely inefficient:
   luk3 mpi com12 ax1 + 20 > luk3 mpi com12 id $)
w2-l-alt $p |- ( ( -. ( -. ps -> ch ) -> ( ( -. th -> et ) -> ps ) ) ->
                                                 ( th -> ( -. ps -> ch ) ) ) $=
  ( wsi wn wi w2luk3 w2a1d ax-w2 w2-m ax-mp ) AEFZMEGZEEEEEGZGMNEGGOGGGZGFGGOGZ
  AFBGZGGZRFCFDGAGGCRGGZQARABHIPSTGEEEEEJPAEEEERCDKLL $.

$( w2-a but -. ( et -> ph ) this time.  w2-j basically covers any easy use of
   this new fact though. $)
w2-o $p |- ( ph ->
  ( ( -. ch -> ( ( -. th -> ta ) -> -. ( et -> ph ) ) ) -> ( th -> ch ) ) ) $=
  ( wze wi wn ax-w2 w2a1d w2id w2ax1 ax-mp w2-m w2mpi ) FFFFGZGFHZQFGFGGPGZGGZA
  BHCHDGEAGHGGCBGGZFFFFFITHZSHFGZFUAFGGRGZGGZASTGZUBUAUCUAFFFFIJUCTTGZGZAUDUEGU
  FUGTKUFUCLMAUCBCDETSFNOOO $.

${
  $( An incredibly obscure syllogism that seems to match with so many things
     and create so many non-trivial possibilities! That are all also similarly
     ridiculous, but hey we unlocked a new kind of ridiculous statement. $)
  w2-p.1 $e |- (
    ( ( ( -. ( -. ph -> ch ) -> th ) -> ta ) -> ( -. ta -> et ) ) -> ps ) $.
  w2-p $p |- ( ph -> ps ) $=
    ( wn wi w2-n w2com12 w2-g ) ACAHCIZHDIEIZEHFIZIBNMOEFMDJKGL $.
$}

$( w2-b but more complicated $)
w2-p1 $p |- ( ph -> ( -. ( ps -> ( -. ( -. ph -> ch ) -> th ) ) -> ta ) ) $=
  ( wet wi wn ax-w2 w2ax1 w2-5g w2-p w2mpi ) FFFFGZGFHZOFGFGGNGGGZABAHCGHDGZGZH
  EGZFFFFFIAPSGCDREQRGSPQBJKLM $.

w2-p2 $p |- ( ph ->
           ( ( ( -. ( -. ph -> ch ) -> th ) -> ta ) -> ( -. ta -> et ) ) ) $=
  ( wn wi w2id w2-p ) AAFBGFCGDGDFEGGZBCDEJHI $.

${
  $( wow
     Relatively few steps too

     Also, anything that shows ( stuff -> -. ph -> al ) where al is arbitrary
     shows ( stuff => ph )

     w2-h but the first antecedent is useful $)
  w2-q.1 $e |- ( -. ph -> ( ( -. ps -> th ) -> -. ch ) ) $.
  w2-q $p |- ( ch -> ( ps -> ph ) ) $=
    ( wi wn ax-w2 w2id w2ii ax-mp ) BAFZGZCGZMAFZFAGBGDFNFFZLFZFFCLFMNABDHPQLCO
    EQIJK $.
$}


$( Using this with w2-g is basically what w2-q does, so use w2-q instead.
   Uses luk2 and com12 twice --> 3301 steps $)
w2ax3 $p |- ( ( -. ph -> -. ps ) -> ( ps -> ph ) ) $=
  ( wn wi w2luk2 w2com12 w2-q ) BACZBCZDZAAJBJJCJDHIJEFGF $.

w2-p3 $p |- ( ph -> ( -. ( ps -> ( -. ph -> ch ) ) -> th ) ) $=
  ( wn wi w2ax3 w2-p2 w2mpi ) AECFZEBEZFBJFZFALEDFJBGACKLDHI $.


$( Useful along with ~ a1ii for seeing how things unify. Unprovable ofc. $)
w2-z $p |- ph $=
  ? $.
