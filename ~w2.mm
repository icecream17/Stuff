$[ set.mm $]

$(
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  Walsh's second axiom
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
$)

$( phi, psi, chi, theta, tau, eta, zeta, sigma, rho, mu, lamda, kappa $)
$( alpha, beta, gamma, delta, epsilon $)
$v al $.
$v be $.
$v ga $.
$v de $.
$v ep $.
walp $f wff al $.
wbe $f wff be $.
wga $f wff ga $.
wde $f wff de $.
wep $f wff ep $.

$( The first and second antecedents mean that ` ( ps -> ch ) ` by ~ mpi ,
   and the consequence simplifies to ` ( th -> ( ps -> ch ) ) ` . $)
ax-w2 $a |- ( ph ->
   ( ( ps -> ( ph -> ch ) ) ->
       ( ( -. ch -> ( ( -. th -> et ) -> ps ) ) -> ( th -> ch ) ) ) ) $.

$( Illustrate the comment of ~ ax-w2 .  (Contributed by SN, 10-Jun-2024.) $)
ex-w2 $p |- (
       ( ( -. ch -> ( ( -. th -> et ) -> ps ) ) -> ( th -> ch ) ) <->
       ( th -> ( ps -> ch ) ) ) $=
  ( wn wi bi2.04 pm2.621 pm2.67 impbii orcom imbi1i df-or 3bitrri pm2.24 imbi1d
  wo id 2thd pm5.5 bitrd syl5bb pm5.74i bitri ) BECEDFZAFZFZCBFFCUGBFZFCABFZFUG
  CBGCUHUIUHUFBFZCUIUJUFBQZBFZBUFQZBFUHUJULUFBHUFBIJUKUMBUFBKLUMUGBBUFMLNCUFABC
  UFCAFACUECACUECCDOCRSPCATUAPUBUCUD $.

${
  mp3c.m $e |- ph $.
  mp3c.1 $e |- ( ph -> ps ) $.
  mp3c.2 $e |- ( ps -> ch ) $.
  mp3c.3 $e |- ( ch -> th ) $.
  mp3c $p |- th $=
    ( ax-mp mp2b ) BCDABEFIGHJ $.

  mp5e.4 $e |- ( th -> ta ) $.
  mp5e.5 $e |- ( ta -> et ) $.
  mp5e $p |- et $=
    ( mp3c mp2b ) DEFABCDGHIJMKLN $.
$}

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

w2-5 $p |- ( ( ( ph -> ( ( ps -> ( ph -> ch ) ) -> ( ( -. ch
 -> ( ( -. th -> ta ) -> ps ) ) -> ( th -> ch ) ) ) ) -> et ) -> ( ze ->
                                                                     et ) ) $=
  ( wn wi w2-0 w2-3 mp2 ) AHZMAIZGHZIIAAIZIZABACIICHDHEIBIIDCIIIIFIZIZFHZOTAIZI
  QIIGFIZIIUBHZRHZQHAIUDMNUCHIIPIHAIAAPIMNAIIPIIIHIIIZISIIRUBIAQFGUABCDEJUCRQAA
  AAAAAAAAKTSUBRUEOAAAJL $.

w2-6 $p |- ( ( ( -. ph -> ps ) -> ch ) -> ( ( -. ( ph -> th ) ->
  ( ( -. ta -> et ) -> ( ch -> ( ( ze -> ( ( si -> ( ze -> rh ) ) -> ( ( -.
 rh -> ( ( -. mu -> la ) -> si ) ) -> ( mu -> rh ) ) ) ) -> th ) ) ) ) ->
                                                  ( ta -> ( ph -> th ) ) ) ) $=
  ( wi wn w2-3 w2-1 ax-mp ) ADLZMEMFLCGHGILLIMJMKLHLLJILLLLDLLLLEQLLZMZAMZBLCLZ
  MZDMZMALUBTTALZSMLLAALZLMALAAUELTUDALLUELLLMLLLZLUCUALLLUARLSUAUCAAAAAAAAAANA
  DEFCGHIJKUAUFBOP $.

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

w2-13 $p |- ( ( -. ( ph -> ps ) -> ( ( -. ch -> th ) -> ( ( ta
-> ( et -> ph ) ) -> ( ( ze -> ( ( si -> ( ze -> rh ) ) -> ( ( -. rh -> (
 ( -. mu -> la ) -> si ) ) -> ( mu -> rh ) ) ) ) -> ps ) ) ) ) -> ( ch ->
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

w2pm2.27 $p |- ( ph -> ( ( ph -> ps ) -> ps ) ) $=
  ( wi w2id w2com12 ) ABCZABFDE $.

$( Simplify ~ ax-w2 , collapsing the first antecedent $)
w2s $p |- ( ( ps -> ch ) -> ( ( -. ch -> ( ( -. th -> et ) -> ps ) ) ->
                                                      ( th -> ch ) ) ) $=
  ( wi wn w2pm2.27 ax-w2 mpi ) ABEZAJBEEBFCFDEAEECBEEABGJABCDHI $.

$( ~ luk-1 applied to ~ w2luk3 without ~ luk-1 $)
w2luk1luk3 $p |- ( ( ( -. th -> et ) -> ch ) -> ( th -> ch ) ) $=
  ( wn wi w2id w2ax1 ax-mp w2s w2mpi ) ADZBDCEZLEZEZLAEBAEMNLFMKGHLABCIJ $.

