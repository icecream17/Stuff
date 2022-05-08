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

# For now, let's say that by default, all values are booleans
opt default_type: Bool


# SECTION 2 - Definition of operators

# T = true
# F = false
#
# Operators take in some inputs (lowercase letters) and output a value
# For example, there's only one input for this operator, "def¬"
#
# NOT operator
op def¬: ¬a
	¬T ⇒ F
	¬F ⇒ T

# The input space = example usage
# Operators can only be called with the usage given
#
# NAND operator
op def⊼: (a ⊼ b)
	(T ⊼ b) ⇒ ¬b
	(F ⊼ b) ⇒ T

# And after that are several alternatives,
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

# Maps show that two expressions are equal
# Between each translation, there's a reason.
# By default it's the definition of the operator that just got removed.
# But sometimes the reason has to be indicated in brackets

# Maps are very similar to operators
# "Expression ⇔ Expression" shows what two expressions are equal
map nnid: ¬¬v ⇔ v
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

# If there's no second expression, it's assumed to be the default value.
# The default value is the first option in the default type, so here it's "T"
map fnand: (F ⊼ a)
	(F ⊼ F) ⇒ T
	(F ⊼ T) ⇒ T

# Here's the first time brackets were used to indicate the reason
map nandf: (a ⊼ F)
	(a ⊼ F) ⇒ [refl⊼] (F ⊼ a) ⇒ [fnand] T

map fimpl: (F → a)
	(F → a) ⇒ (F ⊼ ¬a) ⇒ [fnand] T

map implf: (a → F) ⇔ ¬a
	(T → F) ⇒ F ⇐ ¬T
	(F → F) ⇒ T ⇐ ¬F

# Two tabs indicate a continuation rather than a new arm
map implt: (a → T)
	(a → T) ⇒ (a ⊼ ¬T)
		⇒ (a ⊼ F)
		⇒ [nandf] T

map timpl: (T → a) ⇔ a
	(T → T) ⇒ (T ⊼ ¬T) ⇒ (T ⊼ F) ⇒ T
	(T → F) ⇒ (T ⊼ ¬F) ⇒ (T ⊼ T) ⇒ F

# a implies a
map aima: (a → a)
	(T → T) ⇒ T
	(F → F) ⇒ T

# SECTION 3 - the first few metamath axioms as theorems

# ax sT: T can be substituted for any true hyp

th mp: b
hyp	1	a
	2	(a → b)
proof	1	hyp2	def→	(a ⊼ ¬b)
	2	hyp1,1	sT	(T ⊼ ¬b)
	3	2	def⊼	¬¬b
	4	3	nnid	b

map a1: (a → (b → a))
	(T → (b → T)) ⇒ [implt] (T → T) ⇒ T
	(F → (b → F)) ⇒ [fimpl] T

map a2: ((a → (b → c)) → ((a → b) → (a → c)))
	((T → (b → c)) → ((T → b) → (T → c)))
		⇒ [timpl x3] ((b → c) → (b → c))
		⇒ [aima] T
	((F → (b → c)) → ((F → b) → (F → c)))
		⇒ [fimpl x3] (T → (T → T))
		⇒ [a1] T

map a3: ((¬a → ¬b) → (b → a))
	((¬a → ¬T) → (T → a))
		⇒ ((¬a → F) → (T → a))
		⇒ [timpl] ((¬a → F) → a)
		⇒ [implf] (¬¬a → a)
		⇒ [nnid] (a → a)
		⇒ [aima] T
	((¬a → ¬F) → (F → a))
		⇒ [fimpl] ((¬a → ¬F) → T)
		⇒ [implt] T



# Section 4: metamath 1.2.3 Logical implication
# Many of these are very inefficient expanded out

th mp2: c
hyp	1	a
	2	b
	3	(a → (b → c))
proof	1	hyp1,hyp3	mp	(b → c)
	2	hyp2,1	mp	c

th mp2b: c
hyp	1	a
	2	(a → b)
	3	(b → c)
proof	1	hyp1,hyp2	mp	b
	2	1,hyp3	mp	c

th a1i: (b → a)
hyp	1	a
proof	1		a1	(a → (b → a))
	2	hyp1,1	mp	(b → a)

th 2ali: (c → (b → a))
hyp	1	a
proof	1	hyp1	a1i	(b → a)
	2	1	a1i	(c → (b → a))

th mp1i: (c → b)
hyp	1	a
	2	(a → b)
proof	1	hyp1,hyp2	mp	b
	2	1	ali	(c → b)

th a2i: ((a → b) → (a → c))
hyp	1	(a → (b → c))
proof	1		a2	((a → (b → c)) → ((a → b) → (a → c)))
	2	hyp1,1	mp	((a → b) → (a → c))

th mpd: (a → c)
hyp	1	(a → b)
	2	(a → (b → c))
proof	1	hyp2	a2i	((a → b) → (a → c))
	2	hyp1,1	mp	(a → c)

th imim2i: ((a → b) → (a → c))
hyp	1	(b → c)
proof	1	hyp1	a1i	(b → (a → c))
	2	1	a2i	((a → b) → (a → c))

th syl: (a → c)
hyp	1	(a → b)
	2	(b → c)
proof	1	hyp2	ali	(a → (b → c))
	2	hyp1,1	mpd	(a → c)

th 3syl: (a → d)
hyp	1	(a → b)
	2	(b → c)
	3	(c → d)
proof	1	hyp1,hyp2	syl	(a → c)
	2	1,hyp3	syl	(a → d)

the 4syl: (a → e)
hyp	1	(a → b)
	2	(b → c)
	3	(c → d)
	4	(d → e)
proof	1	hyp1,hyp2,hyp3	3syl	(a → d)
	2	1,hyp4	syl	(a → e)

the mpi: (b → c)
hyp	1	a
	2	(b → (a → c))
proof	1	hyp1	ali	(b → a)
	2	1,hyp2	mpd	(b → c)
