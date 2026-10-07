# Natural Number Game - Solutions

## Tutorial world

### 1

```
rfl
```

### 2

```
rw [h]
rfl
```

### 3

```
rw [two_eq_succ_one, one_eq_succ_zero]
rfl
```

### 4

```
rw [← one_eq_succ_zero, ← two_eq_succ_one]
rfl
```
technically the same as 3

### 5

```
repeat rw [add_zero]
rfl
```

### 6

```
rw [add_zero c, add_zero]
rfl
```
technically the same as 5

### 7

```
rw [one_eq_succ_zero, add_succ, add_zero]
rfl
```

### 8

```
rw [four_eq_succ_three, three_eq_succ_two]
nth_rewrite 2 [succ_eq_add_one]
rw [← add_succ, ← two_eq_succ_one]
rfl
```

or even fewer lines but objectively worse:
```
rw [four_eq_succ_three, three_eq_succ_two, succ_eq_add_one, succ_eq_add_one, ← succ_eq_add_one, ← add_succ, ← two_eq_succ_one]
rfl
```

## Addition world

### 1

```
induction n with d hd
rw [add_zero]
rfl
rw [add_succ, hd]
rfl
```

### 2

```
induction b with d hd
rw [add_zero, add_zero]
rfl
rw [add_succ, add_succ, hd]
rfl
```

### 3

```
induction b with d hd
rw [add_zero, zero_add]
rfl
rw [add_succ, succ_add, hd]
rfl
```

### 4

```
induction c with d hd
rw [add_zero, add_zero]
rfl
rw [add_succ, add_succ, add_succ, hd]
rfl
```

### 5

```
rw [add_assoc, add_assoc, add_comm b]
rfl
```

## Multiplication world

### 1

```
rw [one_eq_succ_zero, mul_succ, mul_zero, zero_add]
rfl
```

### 2

```
induction m with i hi
rw [mul_zero]
rfl
rw [mul_succ, add_zero, hi]
rfl
```

### 3

```
induction b with d hd
rw [add_zero, mul_zero, mul_zero]
rfl
rw [mul_succ, add_succ, add_succ, hd, mul_succ, add_right_comm]
rfl
```

### 4

```
induction a with d hd
rw [zero_mul, mul_zero]
rfl
rw [succ_mul, mul_succ, hd]
rfl
```

### 5

```
rw [mul_comm, mul_one]
rfl
```

### 6

```
rw [two_eq_succ_one, succ_mul, one_mul]
rfl
```

### 7

```
induction c with d hd
rw [add_zero, mul_zero, add_zero]
rfl
rw [add_succ, mul_succ, hd, mul_succ, add_assoc]
rfl
```

### 8

```
rw [mul_comm, mul_comm a, mul_comm b, mul_add]
rfl
```

### 9

```
induction c with d hd
repeat rw [mul_zero]
rfl
rw [mul_succ, mul_succ, mul_add, hd]
rfl
```

## Implication world

### 1
```
exact h1
```

### 2
```
repeat rw [zero_add] at h
exact h
```

### 3
```
apply h2 at h1
exact h1
```

### 4
```
rw [four_eq_succ_three, ← succ_eq_add_one] at h
apply succ_inj at h
exact h
```
technically the same as 5

### 5
```
apply succ_inj
rw [succ_eq_add_one, ← four_eq_succ_three]
exact h
```

### 6
```
intro h
exact h
```

### 7
```
intro h
apply succ_inj
repeat rw [succ_eq_add_one]
exact h
```

### 8
```
apply h2
exact h1
```

### 9
```
rw [one_eq_succ_zero]
apply zero_ne_succ
```

### 10
```
symm
exact zero_ne_one
```

### 11
```
intro h
repeat rw [add_succ, add_succ, add_zero] at h
repeat apply succ_inj at h
apply zero_ne_succ
exact h
```

## Algorithm world

### 1
```
rw [← add_assoc, ← add_assoc, add_comm a]
rfl
```

### 2
```
rw [add_right_comm, ← add_assoc]
rfl
```

### 3
```
simp only [add_left_comm, add_comm]
```

### 4
```
simp_add
```

### 5
```
rw [← pred_succ a, ← pred_succ b, h]
rfl
```

### 6
```
intro h
rw [← is_zero_succ a, h, is_zero_zero]
trivial
```

### 7
```
contrapose! h
apply succ_inj
exact h
```

### 8
```
decide
```

### 9
```
decide
```

### 10
```
rw [h]
```
(joke)

## Advanced addition world
### 1
```
induction n with d hd
repeat rw [add_zero]
intro h
exact h
simp only [add_succ]
intro h
apply succ_inj at h
exact hd h
```

### 2
```
repeat rw [add_comm n]
apply add_right_cancel
```

### 3
```
nth_rewrite 2 [← zero_add y]
apply add_right_cancel
```

### 4
```
rw [add_comm]
apply add_left_eq_self
```

### 5
```
cases b with d
apply add_left_eq_self
rw [add_succ]
contrapose!
intro h
apply succ_ne_zero
```

### 6
```
rw [add_comm]
apply add_right_eq_zero
```

## Power world
### 1
```
apply pow_zero
```

### 2
```
simp only [pow_succ, mul_zero]
```

### 3
```
rw [one_eq_succ_zero, pow_succ, pow_zero]
apply one_mul
```

### 4
```
induction m with d hd
apply pow_zero
rw [pow_succ, hd]
apply mul_one
```

### 5
```
rw [two_eq_succ_one, pow_succ, pow_one]
rfl
```

### 6
```
induction n with d hd
simp only [add_zero, pow_zero, mul_one]
simp only [pow_succ, ← mul_assoc, add_succ]
rw [hd]
rfl
```

### 7
```
induction n with d hd
simp only [pow_zero, mul_one]
simp only [pow_succ, hd, mul_assoc, mul_comm (b ^ d)]
```

### 8
```
induction n with d hd
simp only [pow_zero, mul_zero]
simp only [pow_succ, mul_succ, pow_add, hd]
```

### 9
```
simp only [pow_two, mul_add, add_mul, mul_comm b a, two_mul, add_assoc]
rw [add_comm (b * b)]
simp only [add_assoc]
```

## ≤ world
### 1
```
use 0
decide
```

### 2
```
use x
simp only [zero_add]
```

### 3
```
use 1
decide
```

### 4
```
cases hxy with a ha
cases hyz with b hb
use a + b
simp only [ha, hb, add_assoc]
```

### 5
```
cases hx with a ha
apply add_right_eq_zero
symm
exact ha
```

### 6
```
cases hxy with a ha
cases hyx with b hb
rw [hb, add_assoc] at ha
symm at ha
apply add_right_eq_self at ha
apply add_right_eq_zero at ha
simp only [hb, ha, add_zero]
```

### 7
```
cases h with hx hy
right
exact hx
left
exact hy
```

### 8
```
induction y with d hd
right
apply zero_le
cases hd with ha hb
left
apply le_trans x d (succ d) ha (le_succ_self d)
cases hb with e he
cases e with f hf
rw [add_zero] at he
left
rw [he]
apply le_succ_self
rw [add_succ, ← succ_add] at he
right
use f
exact he
```

### 9
```
cases hx with a ha
use a
apply succ_inj
simp only [← succ_add, ha]
```

### 10
```
cases x with y
left
rfl
rw [one_eq_succ_zero] at hx ⊢
apply succ_le_succ at hx
apply le_zero at hx
rw [hx]
right
rfl
```

### 11
```
cases x with a
left
rfl
right
rw [two_eq_succ_one] at hx ⊢
apply succ_le_succ at hx
apply le_one at hx
cases hx with b
left
rw [b]
decide
right
rw [h]
rfl
```

## advanced multiplication
### 1
```
cases h with d hd
use d * t
rw [hd]
apply add_mul
```

### 2
```
contrapose! h
simp [h, mul_zero]
```

### 3
```
cases a with d
tauto
use d
rfl
```

### 4
```
simp [one_eq_succ_zero]
apply eq_succ_of_ne_zero at ha
cases ha with c
rw [h]
use c
simp only [succ_add, zero_add]
```

### 5
```
apply mul_left_ne_zero at h
apply one_le_of_ne_zero at h
apply mul_le_mul_right at h
rw [one_mul, mul_comm] at h
tauto
```

### 6
```
have ha : x * y ≠ 0
rw [h]
decide
apply le_mul_right at ha
have hb : x ≤ 1
rw [← h]
exact ha
apply le_one at hb
cases hb with h0 h1
rw [h0, zero_mul] at h
tauto
tauto
```

In my opinion, it's useless to arbitrarily restrict things for the purpose of a puzzle, if how things actually work is unrestricted.

### 7
```
contrapose! ha
cases b
tauto
rw [mul_succ] at ha
apply add_left_eq_zero at ha
tauto
```

### 8
```
have i := mul_ne_zero a b
tauto
```

### 9
```
induction b with d hd generalizing c
contrapose! h
rw [mul_zero]
have i := mul_ne_zero a c
tauto
cases c with e
rw [mul_zero] at h
apply mul_eq_zero at h
tauto
simp [mul_succ] at h
apply add_right_cancel at h
apply hd at h
tauto
```

### 10
```
nth_rewrite 2 [← mul_one a] at h
exact mul_left_cancel a b 1 ha h
```
