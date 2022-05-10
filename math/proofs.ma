# proofs.txt
# Note: So far, mathematica provides the best "syntax highlighting" for this

# Syntax of this file:
#
# If a line starts with "#" or is empty, that line is assumed to not exist.
# After filtering out these lines, this file will now have 0 or more item declarations
#
# Every item is of the form: <type> <id>: <data>
#
# <type> is one of the following values:
# op = operator
# th = theorem
# ax = axiom
# map = map
# opt = change settings
# typ = type
#
# Each type will be explained fully later on.


# Handy unicode:
# ⊢⊬¬→↔⇐⇒⇔∧⊼∨≡



# SECTION 1 - Definition of Bool

# More types will be created later on,
# but for now types only define _symbols_.
#
# Type declarations are exhaustive,
# so if the code knows a Bool is not T,
# the code can narrow that down to F.
typ Bool:
	T
	F

# Let the compiler assign Bool as the bool_type intrinsically
opt bool_type: Bool


# SECTION 2 - Definition of operators

# T = true
# F = false
#
# Operators take in some inputs (lowercase letters) and output a value
# For example, this operator (def¬) has "a" as input.
#
# As with types, operators are exhaustive.
#
# NOT operator
# Using special chars to prevent name collision
op def¬: ¬a
	¬T ⇒ F
	¬F ⇒ T

# The input space also shows the "example usage".
# Instead of defining operator precedence,
# it's easier to use extra parens.
#
# NAND operator
op def⊼: (a ⊼ b)
	(T ⊼ b) ⇒ ¬b
	(F ⊼ b) ⇒ T

# And after the params are several alternatives,
# just like Rust's match arms.
#
# Biconditional (aka Iff, XNOR)
op def≡: (a ≡ b)
	(T ⊼ b) ⇒ b
	(F ⊼ b) ⇒ ¬b

# Implies
op def→: (a → b)
	⇒ (a ⊼ ¬b)

# Converse
op def←: (a ← b)
	⇒ (¬a ⊼ b)

# Or
op def∨: (a ∨ b)
	⇒ (¬a ⊼ ¬b)

# And
op def∧: (a ∧ b)
	⇒ ¬(a ⊼ b)

# Nor
op def⊽: (a ⊽ b)
	⇒ ¬(a ∨ b)

# Xor (aka Not iff)
op def⊻: (a ⊻ b)
	⇒ ¬(a ≡ b)



# SECTION 2 - mapping declarations

# Maps show that two expressions are equal (A ⇔ B).
#
# In the exhaustive arms, both expressions are reduced/transforned into one.
# Between each reduction, there's a reason, sometimes indicated in brackets.
# The default reason is the definition of the operator that just got removed.
map ¬¬id: ¬¬v ⇔ v
	¬¬T ⇒ ¬F ⇒ T
	¬¬F ⇒ ¬T ⇒ F

# Notice how there are arrows pointing both right and left in this one.
# In the last one, the second expression didn't need any transforming.
# Also: the first and last arms don't need transforming
map refl⊼: (a ⊼ b) ⇔ (b ⊼ a)
	(T ⊼ T) ⇒ F ⇐ (T ⊼ T)
	(T ⊼ F) ⇒ T ⇐ (F ⊼ T)
	(F ⊼ T) ⇒ T ⇐ (T ⊼ F)
	(F ⊼ F) ⇒ T ⇐ (F ⊼ F)

map refl≡: (a ≡ b) ⇔ (b ≡ a)
	(T ≡ T)
	(T ≡ F) ⇒ F ⇐ (F ≡ T)
	(F ≡ T) ⇒ F ⇐ (T ≡ F)
	(F ≡ F)

# If there's no second expression, it's assumed to be the default value.
# The default value is the first option in the default type, so here it's "T"
map f⊼: (F ⊼ a)
	(F ⊼ F) ⇒ T
	(F ⊼ T) ⇒ T

# Here's the first time brackets were used to indicate the reason
map ⊼f: (a ⊼ F)
	(a ⊼ F) ⇒ [refl⊼] (F ⊼ a) ⇒ [f⊼] T

map f→: (F → a)
	(F → a) ⇒ (F ⊼ ¬a) ⇒ [f⊼] T

map →f: (a → F) ⇔ ¬a
	(T → F) ⇒ F ⇐ ¬T
	(F → F) ⇒ T ⇐ ¬F

# Two tabs indicate a continuation rather than a new arm
map →t: (a → T)
	(a → T) ⇒ (a ⊼ ¬T)
		⇒ (a ⊼ F)
		⇒ [⊼f] T

map t→: (T → a) ⇔ a
	(T → T) ⇒ (T ⊼ ¬T) ⇒ (T ⊼ F) ⇒ T
	(T → F) ⇒ (T ⊼ ¬F) ⇒ (T ⊼ T) ⇒ F

map a→a: (a → a)
	(T → T) ⇒ [→t] T
	(F → F) ⇒ [f→] T

# Unused
map (a→b)→a: ((a → b) → a) ⇔ a
	((T → b) → T) ⇒ [→t] T
	((F → b) → F) ⇒ [f→] (T → F) ⇒ F

map a≡a: (a ≡ a)
	(T ≡ T) ⇒ T
	(F ≡ F) ⇒ ¬F ⇒ T

map T≡id: (T ≡ a) ⇔ a
	(T ≡ T) ⇒ T
	(T ≡ F) ⇒ F

map F≡¬id: (F ≡ a) ⇔ ¬a
	(F ≡ T) ⇒ F ⇐ ¬T
	(F ≡ F) ⇒ T ⇐ ¬F

map id≡T: (a ≡ T) ⇔ a
	(a ≡ T) ⇒ [refl≡] (T ≡ a) ⇒ a

map ¬id≡F: (a ≡ F) ⇔ ¬a
	(a ≡ F) ⇒ [refl≡] (F ≡ a) ⇒ [F≡¬id] ¬a

# Woah double brackets
map extr¬≡: (¬a ≡ b) ⇔ ¬(a ≡ b)
	(¬a ≡ T) ⇒ [id≡T] ¬a [id≡T] ⇐ ¬(a ≡ T)
	(¬a ≡ F) ⇒ [¬id≡F] ¬¬a [¬id≡F] ⇐ ¬(a ≡ F)

map assoc≡: ((a ≡ b) ≡ c) ⇔ (a ≡ (b ≡ c))
	((T ≡ b) ≡ c) ⇒ [T≡id] (b ≡ c) [T≡id] ⇐ (T ≡ (b ≡ c))
	((F ≡ b) ≡ c) ⇒ [F≡¬id] (¬b ≡ c) ⇒ [extr¬≡] ¬(b ≡ c) [F≡¬id] ⇐ (F ≡ (b ≡ c))

# SECTION 3 - axiom of true & substituting true

# Technically, T isn't defined to be true yet
# Above, it just so happened that the default value was T
ax ⊢T: T

# Another axiom is substitution, which I haven't figured out how to notated.
# ax sT takes a true expression, and substitutes T.



# SECTION 4 - the first few metamath axioms as theorems

# Theorems are like maps, except rhere's only one arm.
# The power comes from assuming multiple things at once
# and calling items with multiple things.
#
# Hypotheses are assumed, and their id is h<index>
th mp: b
hyp	1			a
	2			(a → b)
proof	1	h1,h2	sT	(T → b)
	3	2	t→	b

map a1: (a → (b → a))
	(T → (b → T)) ⇒ [→t] (T → T) ⇒ T
	(F → (b → F)) ⇒ [f→] T

# x3 indicator
map a2: ((a → (b → c)) → ((a → b) → (a → c)))
	((T → (b → c)) → ((T → b) → (T → c)))
		⇒ [t→ x3] ((b → c) → (b → c))
		⇒ [a→a] T
	((F → (b → c)) → ((F → b) → (F → c)))
		⇒ [f→ x3] (T → (T → T))
		⇒ [a1] T

map a3: ((¬a → ¬b) → (b → a))
	((¬a → ¬T) → (T → a))
		⇒ ((¬a → F) → (T → a))
		⇒ [t→] ((¬a → F) → a)
		⇒ [→f] (¬¬a → a)
		⇒ [¬¬id] (a → a)
		⇒ [a→a] T
	((¬a → ¬F) → (F → a))
		⇒ [f→] ((¬a → ¬F) → T)
		⇒ [→t] T



# Section 5: metamath 1.2.3 Logical implication
# Many of these are very inefficient expanded out
# Last updated: 2022-5-8, 18:04 UTC

th mp2: c
hyp	1			a
	2			b
	3			(a → (b → c))
proof	1	h1,h3	mp	(b → c)
	2	h2,1	mp	c

th mp2b: c
hyp	1			a
	2			(a → b)
	3			(b → c)
proof	1	h1,h2	mp	b
	2	1,h3	mp	c

th a1i: (b → a)
hyp	1			a
proof	1		a1	(a → (b → a))
	2	h1,1	mp	(b → a)

th 2ali: (c → (b → a))
hyp	1			a
proof	1	h1	a1i	(b → a)
	2	1	a1i	(c → (b → a))

th mp1i: (c → b)
hyp	1			a
	2			(a → b)
proof	1	h1,h2	mp	b
	2	1	ali	(c → b)

th a2i: ((a → b) → (a → c))
hyp	1			(a → (b → c))
proof	1		a2	((a → (b → c)) → ((a → b) → (a → c)))
	2	h1,1	mp	((a → b) → (a → c))

th mpd: (a → c)
hyp	1			(a → b)
	2			(a → (b → c))
proof	1	h2	a2i	((a → b) → (a → c))
	2	h1,1	mp	(a → c)

th imim2i: ((a → b) → (a → c))
hyp	1			(b → c)
proof	1	h1	a1i	(b → (a → c))
	2	1	a2i	((a → b) → (a → c))

th syl: (a → c)
hyp	1			(a → b)
	2			(b → c)
proof	1	h2	ali	(a → (b → c))
	2	h1,1	mpd	(a → c)

th 3syl: (a → d)
hyp	1			(a → b)
	2			(b → c)
	3			(c → d)
proof	1	h1,h2	syl	(a → c)
	2	1,h3	syl	(a → d)


th 4syl: (a → e)
hyp	1			(a → b)
	2			(b → c)
	3			(c → d)
	4			(d → e)
proof	1	h1,h2,h3	3syl	(a → d)
	2	1,h4	syl	(a → e)

# First (inconsistent?) time the first variable wasn't a
th mpi: (a → c)
hyp	1			b
	2			(a → (b → c))
proof	1	h1	ali	(a → b)
	2	1,h2	mpd	(a → c)

th mpisyl: (a → d)
hyp	1			(a → b)
	2			c
	3			(b → (c → d))
proof	1	h2,h3	mpi	(b → d)
	2	h1,1	syl	(a → d)

# The second a in steps 1 and 2 can be replaced with b
# aima could be used instead
th id: (a → a)
proof	1		a1	(a → (a → a))
	2		a1	(a → ((a → a) → a)
	3	1,2	mpd	(a → a)

th idALT: (a → a)
proof	1		a1	(a → (a → a))
	2		a1	(a → ((a → a) → a))
	3		a2	((a → ((a → a) → a)) → ((a → (a → a)) → (a → a)))
	4	2,3	mp	((a → (a → a)) → (a → a))
	5	1,4	mp	(a → a)

th idd: (a → (b → b))
proof	1		id	(b → b)
	2	1	a1i	(a → (b → b))

th a1d: (a → (c → b))
hyp	1			(a → b)
proof	1		a1	(b → (c → b))
	2	h1,1	syl	(a → (c → b))

th 2a1d: (a → (c → (d → b)))
hyp	1			(a → b)
proof	1	h1	a1d	(a → (d → b))
	2	1	a1d	(a → (c → (d → b)))

th a1i13: (a → (b → (c → d)))
hyp	1			(b → d)
proof	1	h1	a1d	(b → (c → d))
	2	1	a1i	(a → (b → (c → d)))

th 2a1: (a → (b → (c → a)))
proof	1		id	(a → a)
	2	1	2a1d	(a → (b → (c → a)))

th a2d: (a → ((b → c) → (b → d)))
hyp	1			(a → (b → (c → d)))
proof	1		a2	((b → (c → d)) → ((b → c) → (b → d)))
	2	h1,1	syl	(a → ((b → c) → (b → d)))

# Metamath's 30th item
th sylcom: (a → (b → d))
hyp	1			(a → (b → c))
	2			(b → (c → d))
proof	1	h2	a2i	((b → c) → (b → d))
	2	h1,1	syl	(a → (b → d))

th syl5com: (a → (c → d))
hyp	1			(a → b)
	2			(c → (b → d))
proof	1	h1	a1d	(a → (c → b))
	2	h2,1	sylcom	(a → (c → d))

th com12: (b → (a → c))
hyp	1			(a → (b → c))
proof	1		id	(b → b)
	2	1,h1	syl5com	(b → (a → c))

th syl11: (b → (d → c))
hyp	1			(a → (b → c))
	2			(d → a)
proof	1	h1,h2	syl	(d → (b → c))
	2	1	com12	(b → (d → c))

th syl5: (c → (a → d))
hyp	1			(a → b)
	2			(c → (b → d))
proof	1	h1,h2	syl5com	(a → (c → d))
	2	1	com12	(c → (a → d))

th syl6: (a → (b → d))
hyp	1			(a → (b → c))
	2			(c → d)
proof	1	h2	a1i	(b → (c → d))
	2	1	sylcom	(a → (b → d))

th syl56: (c → (a → e))
hyp	1			(a → b)
	2			(c → (b → d))
	3			(d → e)
proof	1	h2,h3	syl6	(c → (b → e))
	2	h1,1	syl5	(c → (a → e))

th syl6com: (b → (a → d))
hyp	1			(a → (b → c))
	2			(c → d)
proof	1	h1,h2	syl6	(a → (b → d))
	2	1	com12	(b → (a → d))

th mpcom: (b → c)
hyp	1			(b → a)
	2			(a → (b → c))
proof	1	h2	com12	(b → (a → c))
	2	h1,1	mpd	(b → c)

# mpcom expanded (somewhat wrong)
# h1			(b → a)
# h2			(a → (b → c))
# 1		a1	(b → (a → b))
# 2		a2	((a → (b → c)) → ((a → b) → (a → c)))
# 3	h2,2	mp	((a → b) → (a → c))
# 4		a2	(((a → b) → (a → c)) → (b → ((a → b) → (a → c))))
# 5	3,4	mp	(b → ((a → b) → (a → c)))
# 6		a2	((b → ((a → b) → (a → c))) → ((b → (a → b)) → (b → (a → c))))
# 7	5,6	mp	((b → (a → b)) → (b → (a → c)))
# 8	1,7	mp	(b → (a → c))
# 9		a2	((b → (a → c)) → ((b → a) → (b → c)))
# 10	8,9	mp	((b → a) → (b → c))
# 11	h1,10	mp	(b → c)


# 2		a2	((a → (b → c)) → ((a → b) → (a → c)))
# h2			 (a → (b → c))
# 4		a2	                (((a → b) → (a → c)) → (b → ((a → b) → (a → c))))
# 6		a2	                                      ((b → ((a → b) → (a → c))) → ((b → (a → b)) → (b → (a → c))))
# 1		a1	                                                                    (b → (a → b))
# 9		a2	                                                                                   ((b → (a → c)) → ((b → a) → (b → c)))
# h1			                                                                                                     (b → a)
