# English Vowel Respelling System

> note: Original by me, but I changed it a bunch
> so this writeup is from AI.

## 1. Vowel Mappings

| IPA | Spelling | Example | Respelling |
|---|---|---|---|
| /ɑ/ | aw | palm | pawlm |
| /ɑr/ | ar | car | car |
| /æ/ | a | cat | cat |
| /aɪ/ | igh | kite | kight |
| /aɪər/ | igher | fire | figher |
| /aʊ/ | ow | couch | cowch |
| /aʊər/ | ower | tower | tower |
| /ɛ/ | e | test | test |
| /ɛr/ | ehr | berry | behree |
| /eɪ/ | ei | make | meik |
| /ɛər/ | air | care | cair |
| /ɪ/ | i | kit | kit |
| /ɪr/ | ir | mirror | mirrer |
| /i/ | ee | seem | seem |
| /ɪər/ | eer | hear | heer |
| /ɔ/ | aw | law | law |
| /ɔr/ | oar | warm | woarm |
| /ɔɪ/ | oi | choice | choic |
| /ɔɪər/ | oyer | coyer | coyer |
| /oʊ/ | oa | goat | goat |
| /ʊ/ | uu | cook | cuuk |
| /ʊr/ | ure | sure | shure |
| /u/ | oo | goose | goos |
| /ʌ/ | u | strut | strut |
| /ə/ | - | about | -bowt |
| /ər/, /ɚ/, /ɝ/ | er | letter, bird | letter, berd |

> note:
> 
> + For /ʊ/ there is both "put" and "book", so nothing standard works. I'm a bit tempted to have it be something special like "~".
> + "-" for /ə/ is a placeholder for now.
> + "ee" is nice in some words, but kinda bad with "ing".

Special rules:
- "qu" as in /kw/ becomes "kw"
- "s" as in "sure" or "pleasure" becomes "sh"

| IPA | Spelling | Example | Respelling |
|---|---|---|---|
| /ʊl/ | -l | pull | p-ll |
| /əl/ | -l | apple | app-l |

> chatgpt likes "ull" for this, but i kinda like the
> aesthetic of "-l". Which kinda ruins the purpose of this...
> needs more thinking

## 2. Additional Rules

### Rule 1: Replace vowel sounds in place

Replace each vowel sound with its assigned spelling.

Remove the original vowel letters, including silent vowel
letters associated with the sound being replaced.

Examples:
- make → meik
- kite → kight
- home → hoam
- about → -bowt

### Rule 2: Preserve existing consonant spellings

Existing consonant letters remain unchanged, even when
their conventional spellings are irregular.

Examples:
- cook → cuk (not kuk)
- choice → choic (not chois)
- cake → ceik (not keik)
- palm → pawlm (silent l is preserved)
- knight → knaight (not nait)

Consonants are not systematically converted to phonetic
spellings.

> Exception: See rules 3 and 4.
>
> Note: Honestly, part of me likes how horrible this is.

> A particular consequence is that many comic endings of words
> are particularly difficult to read:
>
> - sion, tion: s-n, t-n
> - scious, cious: sc-s, c-s
>
> Though, a nice benefit is that doubled-r is nice:
> in "mirror", "ir" becomes "ir" then the second "r" is kept,
> creating "mirrer" (which arguably sounds like if "murror"
> was a word, but it's better than "mirer").

### Rule 3: Add missing consonant sounds

If a consonant sound is present in the pronunciation but
is not represented by an existing consonant letter,
insert its expected spelling.

In particular:
- /j/ → y

Existing consonants are still preserved unless another
rule explicitly overrides them.

#### 3b: sh

The AI seems to put "sh" for words like "sure".

This is invalid: "h" is not a hidden consonant, it's a transformation from the "s" sound to the single "sh" sound. But let's keep this change.

And similarly let's have "sh" be the representation for the consonant of "pleasure" (voiced "sh").

### Rule 4: Special treatment of "qu"

/kw/ written as "qu" becomes "kw".

Examples:
- queen → kween
- quick → kwick
- quarter → kwoarter

This exception overrides the rule that existing
consonant spellings are preserved.

The rule only applies when "qu" represents /kw/.

### Rule 5: Treat vowel–R sequences as units

Vowel–R sequences with dedicated mappings are replaced
as complete units rather than replacing the vowel and
R separately.

Examples:
- fire → figher
- care → cair
- warm → woarm
- hear → heer
- sure → shure

This includes distinctions such as:
- /ɛr/ → ehr
- /ɛər/ → air
- /ɪr/ → ir
- /ɪər/ → eer

### Rule 6: Special treatment of /ʊl/ and /əl/

They are written "ull".

Examples:
- pull → pull
- full → full
- bull → bull
- wool → wool

### Clarification: Schwa

The unstressed central vowel /ə/ is represented by "-".

Examples:
- about → -bout
- banana → b-nan-
- sofa → soaf-
- camera → cam-r-

The hyphen is a literal part of the spelling.

### Clarification: R-colored schwa and NURSE vowel

The following sounds all use "er":
- /ər/
- /ɚ/
- /ɝ/

No distinction is made between stressed and unstressed
versions for now.

Examples:
- bird → berd
- word → werd
- letter → letter
- mirror → mirer

### Rule 9: Preserve dialect-sensitive distinctions

The system includes distinct mappings for vowels that
may be merged in some English dialects.

Examples:
- /ɛr/ versus /ɛər/
- /ɪr/ versus /ɪər/

Use the phonemic pronunciation of the chosen dialect
to determine which mapping applies.

### Clarification: Some vowels deliberately share spellings

The following phonemes have identical representations:

- /ɑ/ and /ɔ/ → aw

This means the spelling system is not completely
phonemically reversible.

Examples:
- hot → hawt
- caught → cawght

### Clarification: Stress is not explicitly marked

There are currently no dedicated symbols for primary
or secondary stress.

Stress may influence which vowel phoneme is selected,
but stress itself is not written.

### Repetition of concept: Consonant spelling is otherwise traditional

> ChatGPT sure likes adding to the word count

Apart from adding missing consonant sounds and the
specific "qu" → "kw" rule, preserve the original
consonant letters.

Do not automatically replace:
- c with k or s
- ch with tch or sh
- ph with f
- th with another representation
- x with ks or gz
- silent consonants with nothing

Consonant reform may be introduced separately later.

## 3. Current Characteristics

- Vowels are respelled systematically.
- Existing consonant spellings are mostly preserved.
- Missing consonant sounds are added.
- "qu" representing /kw/ is changed to "kw".
- Schwa is represented by a hyphen.
- R-colored schwa is represented by "er".
- Some dialect-specific vowel distinctions are supported.
- Some vowel phonemes intentionally share spellings.
- Stress is not marked.
- The system is a hybrid of phonemic vowel spelling
  and traditional English consonant orthography.

## Worst-Looking Respelling Examples (according to ai)

> note: i added an asterisk `*` for bad endings
>
> I had to fix many of these so some are probably still wrong

| Original | Respelling | Ugliness /5 |
|---|---|---|
| comfortable | cumfterb-l | 5 |
| vegetable | vegt-b-l | 5 |
| refrigerator | refrigereiter | 5 |
| chocolate | chawc-l-t | 4 |
| camera | camer- | 5 |
| different | diff-r-nt | 3 |
| accessory | -ccess-ree | 5 |
| category | cat-goaree | 4 |
| beautiful | byootif-l | 4 |
| curious | cyuree-s | 5 |
| serious | sirree-s | 4 |
| pleasure | plesher | 5 |
| treasure | tresher | 4 |
| ocean | oac-n | 5* |
| asia | eish- | |
| delicious | d-lic-s | 5* |
| conscious | cawnsc-s | 5* |
| wireless | wigherl-s | 4 |
| firepower | figherpower | 4 |
| extraordinary | extraoard-nairee | 5 |
| warm | woarm | 3 |
| quarter | kwoarter | 4 |
| gorgeous | goarg-s | 5* |
| desire | d-sigher | 4 |
| entire | -ntigher | 4 |
| require | r-kwigher | 5 |
| choir | chwigher | 5 |
| pure | pyure | 3 |
| cure | cyure | 4 |
| furious | fyuree-s | 5 |
| rural | rer-l | 4 |
| mirror | mirrer | 2 |
| squirrel | skwirr-l | 4 |
| thoroughly | thur-ghlee | 3 |
| worcestershire | wurcstersher | 5 |
| bureaucracy | byuroacr-cee | 5* |
| miscellaneous | mis-lainee-s | 5 |
| simultaneously | sighm-ltainee-slee | 5 |
| particularly | perticy-lerlee | 5 |
| pronunciation | pr-nuncieit-n | 5* |
| conscientious | cawnscee-ent-s | 5* |
