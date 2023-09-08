
const MAX_SAFE_INT: bigint = BigInt(Number.MAX_SAFE_INTEGER);

// Assert
function abs(n: bigint) {
  return n < 0n ? -n : n
}

function gcd(a: bigint, b: bigint) {
  if (typeof a !== "bigint") throw new TypeError("not bigint")
  if (a === 0n)
    if (b === 0n) throw new TypeError("undefined")
    else return b
  while (b !== 0n) {
    [a, b] = [b, a % b]
  }
  return a
}

function sqrt(n: bigint): bigint {
  if (n < 0) {
    throw new RangeError("Unsupported: Square root of a negative number is imaginary")
  }

  if (n <= MAX_SAFE_INT) {
    if (n <= 2n) {
      return n
    }

    const result = Math.sqrt(Number(n))
    if (Number.isInteger(result)) {
      return BigInt(result)
    }

    throw new RangeError("Unsupported: Square root of non-perfect squares")
  }

  throw new RangeError("Unimplemented size!")
}

function cbrt(n: bigint): bigint {
  if (abs(n) <= MAX_SAFE_INT) {
    if (n === 0n || n === 1n) {
      return n
    }

    const result = Math.cbrt(Number(n))
    if (Number.isInteger(result)) {
      return BigInt(result)
    }

    throw new RangeError("Unsupported: Cube root of non-perfect cubes")
  }

  throw new RangeError("Unimplemented size!")
}

function _nthRootOfZero(n: bigint, valueIfZeroPowZero?: bigint): bigint {
  if (n === 0n) {
    if (typeof valueIfZeroPowZero === "bigint") {
      return valueIfZeroPowZero
    }
    throw new RangeError("0 to the power of 0 is undefined")
  } else if (n < 0n) {
    throw new RangeError("0 to the power of a negative causes division by zero")
  }
  return 0n
}

function nthRoot(n: bigint, val: bigint, valueIfZeroPowZero?: bigint): bigint | Fraction {
  if (n === 0n) {
    throw new RangeError("Cannot get the 0th root")
  }
  if (val < 0n && n % 2n === 0n) {
    throw new RangeError("Unsupported: Even root of a negative number is imaginary")
  }
  if (val === 0n) {
    return _nthRootOfZero(n, valueIfZeroPowZero)
  }
  if (val === -1n) {
    return -1n // See imaginary error above
  }
  if (n < 0n) {
    return new Fraction(1n, val ** -n)
  }
  if (n === 0n) {
    return 1n
  }
  if (n === 1n || val === 1n) {
    return n
  }
  if (n === 2n) {
    return sqrt(n)
  }
  if (n === 3n) {
    return cbrt(n)
  }

  throw new Error("Unimplemented!")
}

type SupportedFrom = bigint | number | string | ImmutableFraction
class ImmutableFraction {
  static from<T extends typeof ImmutableFraction>(this: T, v: SupportedFrom): InstanceType<T> {
    if (v instanceof this) {
      return v as InstanceType<T>
    }

    if (this.isFraction(v)) {
      return new this(v.numerator, v.denominator) as InstanceType<T>
    }

    switch (typeof v) {
      case "bigint":
        return this.fromBigInt(v)
      case "number":
        return this.fromNumber(v)
      case "string":
        return this.fromString(v)
      default:
        throw new TypeError("Unsupported from type")
    }
  }

  static fromBigInt<T extends typeof ImmutableFraction>(this: T, big: bigint): InstanceType<T> {
    return new this(big, 1n) as InstanceType<T>
  }

  static fromNumber<T extends typeof ImmutableFraction>(this: T, num: number): InstanceType<T> {
    if (num === Infinity || num === -Infinity || Number.isNaN(num)) {
      throw new TypeError(`${num} cannot be converted to a Fraction`)
    }

    let denominator = 1n
    while (!Number.isInteger(num)) {
      num += num
      denominator += denominator
    }

    return new this(BigInt(num), denominator) as InstanceType<T>
  }

  static fromString<T extends typeof ImmutableFraction>(this: T, str: string): InstanceType<T> {
    const parts = str.split('/')
    if (parts.length === 2) {
      return new this(BigInt(parts[0]), BigInt(parts[1])) as InstanceType<T>
    }

    throw TypeError("Must be of the format [integer]/[integer]")
  }

  toString() {
    return `${this.numerator}/${this.denominator}`
  }

  static isFraction(v: unknown): v is ImmutableFraction {
    return v instanceof ImmutableFraction
  }

  static sum(fractions: Iterable<Fraction>): Fraction {
    let result = new Fraction()
    for (const frac of fractions) {
      result.addAssign(frac)
    }
    return result
  }

  constructor (public numerator = 0n, public denominator = 1n) {
    if (denominator === 0n) {
      throw new RangeError("Division by zero")
    }
  }

  simplify () {
    const gcdOfThis = gcd(this.numerator, this.denominator)
    this.numerator /= gcdOfThis
    this.denominator /= gcdOfThis

    if (this.denominator < 0n) {
      this.numerator = -this.numerator
      this.denominator = -this.denominator
    }
  }

  isZero () {
    return this.numerator === 0n
  }

  isOne () {
    return this.numerator === this.denominator
  }

  isZeroOrPositive () {
    return this.numerator < 0n === this.denominator < 0n
  }

  isZeroOrNegative () {
    return this.numerator < 0n !== this.denominator < 0n
  }

  floor () {
    if (this.isZero()) {
      return 0n
    }

    // ceil was actually done first
    if (this.isZeroOrNegative()) {
      if (this.numerator < 0n) {
        return ((this.numerator + 1n) / this.denominator) - 1n
      }
      return ((this.numerator - 1n) / this.denominator) - 1n
    }
    return this.numerator / this.denominator
  }

  ceil () {
    if (this.isZero()) {
      return 0n
    }

    // If a/b is negative, RoundToZero(this) === ceil(this)
    if (this.isZeroOrNegative()) {
      return this.trunc()
    }

    // Both the numerator and denominator are negative
    if (this.numerator < 0n) {
      // (-a - 1) / -b === (a + 1) / b
      return ((this.numerator - 1n) / this.denominator) + 1n
    }
    return ((this.numerator + 1n) / this.denominator) + 1n
  }

  /// Halfway cases are rounded away from zero
  /// = RoundAwayFromZero(this)
  round () {
    const baseInt = this.numerator / this.denominator
    const remainder = this.numerator - (this.denominator * baseInt)
    if (remainder === 0n) {
      return baseInt
    }
    if (this.isZeroOrNegative()) {
      return baseInt - 1n
    }
    return baseInt + 1n
  }

  /// = RoundToZero(this)
  trunc () {
    return this.numerator / this.denominator
  }

  /// = this.numerator % this.denominator
  remainder () {
    return this.numerator % this.denominator
  }

  /// Returns the fractional part of the number
  fract () {
    return new Fraction(this.remainder(), this.denominator)
  }

  abs () {
    return new Fraction(abs(this.numerator), abs(this.denominator))
  }

  sign () {
    if (this.isZero()) {
      return 0n
    }
    if (this.isZeroOrPositive()) {
      return 1n
    }
    return -1n
  }

  isInteger () {
    return this.remainder() === 0n
  }

  /// Makes a new fraction whose sign is `sign`
  /// and whose magnitude is `this`
  ///
  /// If sign is 0, return `this.copy()`
  copysign (frac: Fraction) {
    const fracsign = frac.sign()
    if (fracsign === 0n) {
      return this.copy()
    }

    const thissign = this.sign()
    if (fracsign === thissign) {
      return this.copy()
    }

    return new Fraction(-this.numerator, this.denominator)
  }

  copy () {
    return new Fraction(this.numerator, this.denominator)
  }

  /// Returns exponentiate(this, big)
  /// Should be faster than the regular exponentiate function
  powint (big: bigint) {
    const [numerator, denominator] = big < 0n ? [this.denominator, this.numerator] : [this.numerator, this.denominator]
    return new Fraction(numerator ** abs(big), denominator ** abs(big))
  }

  /// Returns the square root of this
  /// RangeError if result is a surd
  sqrt () {
    if (this.isZero()) {
      return 0n
    }

    if (this.isZeroOrNegative()) {
      throw new RangeError("Unsupported: Even root of a negative number is imaginary")
    }

    this.simplify()
    return new Fraction(sqrt(this.numerator), sqrt(this.denominator))
  }

  cbrt () {
    if (this.isZero()) {
      return 0n
    }

    if (this.isZeroOrNegative()) {
      throw new RangeError("Unsupported: Even root of a negative number is imaginary")
    }

    this.simplify()
    return new Fraction(cbrt(this.numerator), cbrt(this.denominator))
  }

  nthRoot (n: bigint, valueIfZeroPowZero?: bigint): bigint | Fraction {
    if (this.isInteger()) {
      return nthRoot(this.numerator / this.denominator, valueIfZeroPowZero)
    }

    if (this.isZeroOrNegative() && n % 2n === 0n) {
      throw new RangeError("Unsupported: Even root of a negative number is imaginary")
    }

    this.simplify()

    const newnumerator = nthRoot(n, this.numerator)
    const newdenominator = nthRoot(n, this.denominator)
    if (ImmutableFraction.isFraction(newnumerator)) {
      if (ImmutableFraction.isFraction(newdenominator)) {
        return newnumerator.divide(newdenominator)
      }
      return newnumerator.divint(newdenominator)
    }

    // a / (b / c) === a * c / b
    if (ImmutableFraction.isFraction(newdenominator)) {
      return new Fraction(newnumerator * newdenominator.denominator, newdenominator.numerator)
    }
    return new Fraction(newnumerator, newdenominator)
  }

  eq (frac: Fraction) {
    this.simplify()
    frac.simplify()
    return this.numerator === frac.numerator && this.denominator === frac.denominator
  }

  add (frac: Fraction) {
    if (this.denominator === frac.denominator) return new Fraction(this.numerator + frac.numerator, this.denominator)
    return new Fraction(this.numerator * frac.denominator + frac.numerator * this.denominator, this.denominator * frac.denominator)
  }

  subtract (frac: Fraction) {
    if (this.denominator === frac.denominator) return new Fraction(this.numerator - frac.numerator, this.denominator)
    return new Fraction(this.numerator * frac.denominator - frac.numerator * this.denominator, this.denominator * frac.denominator)
  }

  multiply (frac: Fraction) {
    return new Fraction(this.numerator * frac.numerator, this.denominator * frac.denominator)
  }

  divide (frac: Fraction) {
    if (frac.isZero()) {
      throw new RangeError("division by 0")
    }
    return new Fraction(this.numerator * frac.denominator, this.denominator * frac.numerator)
  }

  mulint (int: bigint) {
    return new Fraction(this.numerator * int, this.denominator)
  }

  divint (int: bigint) {
    return new Fraction(this.numerator, this.denominator * int)
  }

  // pow(x, a/b) === bth root(x^a)
  exponentiate (frac: Fraction) {
    if (frac.isZero()) {
      if (this.isZero()) {
        throw new RangeError("0 to the power of 0")
      }
      return new Fraction(1n, 1n)
    }

    this.simplify()
    frac.simplify()
    if (frac.denominator === 1n) {
      return this.powint(frac.numerator)
    }

    const result = this.powint(frac.numerator)
    return result.nthRoot(frac.denominator)
  }
}

class Fraction extends ImmutableFraction {
  assign (numerator: bigint, denominator: bigint) {
    this.numerator = numerator
    this.denominator = denominator
    return this
  }

  addAssign (frac: Fraction) {
    if (this.denominator === frac.denominator) return new Fraction(this.numerator + frac.numerator, this.denominator)
    return this.assign(this.numerator * frac.denominator + frac.numerator * this.denominator, this.denominator * frac.denominator)
  }

  subAssign (frac: Fraction) {
    if (this.denominator === frac.denominator) return new Fraction(this.numerator - frac.numerator, this.denominator)
    return this.assign(this.numerator * frac.denominator - frac.numerator * this.denominator, this.denominator * frac.denominator)
  }
}

/// Test
function test () {
  describe('ceil', () => {
    const tests = [
      [4n, 2n, 2n],
      [5n, 2n, 3n],
      [1n, 2n, 1n],
      [21n, 3n, 7n],
      [-21n, 3n, -7n],
      [-22n, 3n, -7n],
      [-20n, 3n, -6n],
      [20n, -3n, -6n],
      [21n, -3n, -7n],
      [22n, -3n, -7n],
      [-1n, -2n, 1n],
      [-21n, -3n, 7n],
    ]
    for (const [a, b, c] of tests) {
      const result = new Fraction(a, b).ceil()
      console.assert(result === c, `${a}/${b} = ${c}?`, result)
    }
  })

  describe('sqrt', () => {
    // 0n 1n 2n 4n 7n 11n 17n 26n 40n 61n 92n 139n 209n 314n 472n 709n ...
    for (let i = 0n; i < 1_000_000n; i += 1n + i / 2n) {
      const result = sqrt(i * i)
      console.assert(result === i, `sqrt(${i}²) === i`, result, i)
    }
  })

  describe('speed', () => {
    const frac = new Fraction(2902n, 2183n)
    console.time("speed")
    for (let i = 0; i < 1000; i++) {
      // nothing right now
    }
    console.timeEnd("speed")
  })
}

function describe (name: string, func: () => void) {
  console.group(name)
  func()
  console.groupEnd()
}
