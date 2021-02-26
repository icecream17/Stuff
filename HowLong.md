# How Long

I'm going to start with ```Script```, and make a random (e.g.: Math.random) valid instance in the ECMAScript language set.

I will not use additional syntax, like HTML Comments. Which i've just rediscovered.

The _is at_ notices will only be there if it's not next.

Between any two tokens can be any amount of whitespace:
   - Tab
   - Vertical Tab
   - Form Feed
   - Space
   - Non Breaking Space
   - Zero Width Non Breaking Space
   - Any Other Unicode Code Point In The Category "Space_Seperator"

Usually you can also put any amount of line terminators, but in some place they affect automatic semicolon insertion:
   - Line Feed
   - Carriage Return
   - Line Seperator
   - Paragraph Seperator

\CR\\LF\ counts as 1 Source Character. 1 \Line Terminator Sequence\\.

\CR\ is not a \Line Terminator Sequence\ when followed by \LF\

Comments can also kinda be anywhere, with the exception of multi-line comments that span multiple lines.  
They count as 1 Line Terminator.

So here's some new syntax:
```

Random Token Seperator [No Extra Token Seperator, Non Empty, No Line Terminator]:
   - [~Non Empty] <empty>
   - [~No Extra Token Seperator] \Any Amount Of Whitespace [?Non Empty]\
   - [~No Extra Token Seperator ~Non Empty] \Any Amount Of Comments [?No Line Terminator]\
   - [~No Extra Token Seperator ~No Line Terminator] \Any Amount Of Line Terminator [?Non Empty]\
   - [~No Extra Token Seperator] \Random Token Seperator[?Non Empty, ?No Line Terminator]\ [No Extra Token Seperator Here] \Random Token Seperator[~Non Empty, ?No Line Terminator]\

SS: Random Token Seperator: Early Errors
Random Token Seperator cannot both have "Non Empty" and "No Extra Token Seperator".

Any Amount Of Whitespace [Non Empty]:
   - [~Non Empty] [empty]
   - WhiteSpace
   - \Any Amount Of Whitespace [+Non Empty]\ [No Extra Token Seperator Here] \WhiteSpace\

Any Amount Of Comments [No Line Terminator]
   - \Comment Check [?No Line Terminator]\
   - \Any Amount Of Comments [+Non Empty, ?No Line Terminator]\ [No Extra Token Seperator Here] \Comment Check [?No Line Terminator]\

Comment Check [No Line Terminator]
   - \Multi Line Comment\ [Lookahead ∉ Line Terminator]
   - [~No Line Terminator] \Multi Line Comment\
   - [~No Line Terminator] \Single Line Comment\ [No Extra Token Seperator Here] \Any Amount Of Line Terminators_Non_Empty\

Any Amount Of Line Terminators [Non_Empty]
   - [~Non_Empty] [empty]
   - \Line Terminator\
   - \Any Amount Of Line Terminators [+Non_Empty]\ [No Extra Token Seperator Here] \Line Terminator\
```

Random characters are generated using <https://www.babelstone.co.uk/Unicode/unicode.html>

The Whitespace is crazy. No one puts random whitespace between every token.

What are the chances: 4 line terminators and then two empty multiline comments in a row!

1. Script:
   - __\Script Body `opt`\\__
   - Well, if the Script was empty, that would a pretty boring random script.
   - This isn't random, but i'm not going to accept empty scripts.

2. Script Body:
   - __\Statement List\\__

3. Statement List
   - \Statement List Item\
   - __\Statement List\ \Statement List Item\\__
   - _\Statement List Item\ is at: Todo_

4. Statement List
   - __\Statement List Item\\__
   - \Statement List\ \Statement List Item\

5. Statement List Item
   - \Statement\
   - __\Declaration\\__ (Wow, this is like a normal program!)

6. Declaration
   - \Hoistable Declaration\
   - \Class Declaration\
   - __\Lexical Declaration_In\\__

7. Lexical Declaration_In
   - __\Let Or Const\ \Binding List_In\\__
   - _\Binding List_In\ is at: 9_

8. Let Or Const
   - __let__ (This is amazing)
   - const

9. Binding List_In
   - __\Lexical Binding_In\\__ (Oh my god what a sensible Math.random!)
   - \Binding List_In\ , \Lexical Binding_In\

10. Lexical Binding_In
   - \Binding Identifier\ \Initializer_In `opt`\
   - __\Binding Pattern\ \Initializer_In\\__ (Wait. Hold on to my previous comment... I think it's going to get a Syntax Error.)
   - _\Initializer_In\ is at: Todo_

11. Binding Pattern
   - \Object Binding Pattern\
   - __\Array Binding Pattern\__

12. Array Binding Pattern
   - \[ \Elision `opt`\ \Binding Rest Element `opt`\ \]
   - __\[ \Binding Element List\ \]__ (Huh, chose the one without any optional)
   - \[ \Binding Element List\ , \Elision `opt`\ \Binding Rest Element `opt`\ \]

13. Binding Element List
   - \Binding Elision Element\
   - __\Binding Element List\ , \Binding Elision Element\\__
   - _\Binding Elision Element\ is at: Todo__

14. Binding Element List
   - __\Binding Elision Element\\__
   - \Binding Element List\ , \Binding Elision Element\

15. Binding Elision Element
   - __\Elision `opt`\ \Binding Element\\__
   - `opt` result: Include
   - _\Binding Element\ is at: 17__

16. Elision
   - __,__
   - \Elision\ ,

17. Binding Element
   - \Single Name Binding\
   - __\Binding Pattern\ \Initializer_In ```opt```\\__
   - `opt` result: Include
   - _\Initializer_In\ is at: 25__

18. Binding Pattern
   - \Object Binding Pattern\
   - __\Array Binding Pattern\\__

19. Array Binding Pattern
   - __\[ \Elision `opt`\ \Binding Rest Element `opt`\ \]__
   - \[ \Binding Element List\ \]
   - \[ \Binding Element List\ , \Elision `opt`\ \Binding Rest Element `opt`\ \]
   - `opt` result: Exclude
   - `opt` result: Include

20. Binding Rest Element
   - __... \Binding Identifier\\__
   - ... \Binding Pattern\

21. Binding Identifier
   - __\Identifier\\__
   - yield
   - await

22. Identifier
   - __\Identifier Name\ but not \Reserved Word\\__

23. Identifier Name
   - __\Identifier Start\\__
   - \Identifier Name\ \Identifier Part\

24. Identifier Start
   - \Unicode ID Start\
   - $
   - **_**
   - \ \Unicode Escape Sequence\
   - (It chose the underscore)

25. Initializer_In
   - __= \Assignment Expression_In\\__

26. Assignment Expression_In
   - \Conditional Expression_In\
   - \Arrow Function_In\
   - __\Async Arrow Function_In\__
   - \Left Hand Side Expression_In\ = \Assignment Expression_In\
   - \Left Hand Side Expression_In\ \Assignment Operator_In\ \Assignment Expression_In\

27. Async Arrow Function_In
   - __async \[No Line Terminator here] \Async Arrow Binding Identifier\ \[No Line Terminator here] => \Async Concise Body_In\\__
   - \Cover Call Expression And Async Arrow Head\ \[No Line Terminator here] => \Async Concise Body_In\
   - _\Async Concise Body_In\\ is at: 30_

28. Async Arrow Binding Identifier
   - __Binding Identifier_Await__

29. Binding Identifier_Await
   - \Identifier\\
   - yield
   - __await__

30. Async Concise Body_In
   - __\[Lookahead ≠ {] \Expression Body_In_Await\__
   - { \AsyncFunctionBody\ }

31. Expression Body_In_Await
   - __\Assignment Expression_In_Await\\__

32. Assignment Expression_In_Await
   - \Conditional Expression_In_Await\
   - \Arrow Function_In_Await\
   - __\Async Arrow Function_In_Await\\__ (Again!)
   - \Left Hand Side Expression_In_Await\ = \Assignment Expression_In_Await\
   - \Left Hand Side Expression_In_Await\ \Assignment Operator_In_Await\ \Assignment Expression_In_Await\

33. Async Arrow Function_In_Await
   - __async \[No Line Terminator here] \Async Arrow Binding Identifier\ \[No Line Terminator here] => \Async Concise Body_In\\__
   - \Cover Call Expression And Async Arrow Head\ \[No Line Terminator here] => \Async Concise Body_In\
   - _\Async Concise Body_In\\ is at: 36_

34. Async Arrow Binding Identifier
   - __Binding Identifier_Await__

35. Binding Identifier_Await
   - \Identifier\\
   - __yield__
   - await

36. Async Concise Body_In
   - __\[Lookahead ≠ {] \Expression Body_In_Await\__
   - { \AsyncFunctionBody\ }

37. Expression Body_In_Await

wwwmc
Resulting Code:

```javascript
let [/***ᜩ*/,[ ..._﻿	﻿]
=async await=>async 		yield=>  	
```

Tokens todo:

   - #3
   - #10
   - #13
   - Latest

Actual characters:

```unicode
Latin lowercase letter L
Latin lowercase letter E
Latin lowercase letter T
Solidus
Solidus
Paragraph seperator
Left square bracket
Forward slash
Asterisk
Asterisk
Asterisk
U+1729 : HANUNOO LETTER PA
Asterisk
Forward slash
Comma
Left square bracket
Paragraph seperator
Period / Full stop
Period / Full stop
Period / Full stop
Underscore
<ZWNBSP>
<TAB>
<FF>
<ZWNBSP>
<VT>
Right square bracket
<LF>
Equals sign
<FF>
Latin lowercase letter A
Latin lowercase letter S
Latin lowercase letter Y
Latin lowercase letter N
Latin lowercase letter C
Em Space (U+2003)
Latin lowercase letter A
Latin lowercase letter W
Latin lowercase letter A
Latin lowercase letter I
Latin lowercase letter T
Equals sign
Greater than symbol
Latin lowercase letter A
Latin lowercase letter S
Latin lowercase letter Y
Latin lowercase letter N
Latin lowercase letter C
En Quad (U+2000)
<TAB>
<TAB>
Latin lowercase letter Y
Latin lowercase letter I
Latin lowercase letter E
Latin lowercase letter L
Latin lowercase letter D
Equals sign
Greater than symbol
Space
Space
Tab
Right square bracket
```
