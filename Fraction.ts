
const MAX_SAFE_INT: bigint = BigInt(Number.MAX_SAFE_INTEGER);

// Assert
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
    if (n <= 2) {
      return n
    }

    const result = Math.sqrt(Number(n))
    if (Number.isInteger(n)) {
      return BigInt(n)
    }
    throw new RangeError("Unsupported: Square root of non-perfect squares")
  }

  throw
}


function cbrt(n: bigint): bigint {
  if (n <= MAX_SAFE_INT) {
    const result = Math.cbrt(Number(n))
    if (Number.isInteger(n)) {
      return BigInt(n)
    }
    throw new RangeError("Unsupported: Square root of non-perfect squares")
  }
}

function nthRoot(n: bigint, base: bigint): bigint {
  if (n === 0n) {
    throw new RangeError("Cannot get the 0th root")
  }
  if (n % 2n === 0n && base < 0n) {
    throw new RangeError("Unsupported: Even root of a negative number is imaginary")
  }

  throw new Error("Unimplemented!")
}

class Fraction {
  static fromNumber(num: number) {
    if (num === Infinity || num === -Infinity || Number.isNaN(num)) {
      throw new TypeError(`${num} cannot be converted to a Fraction`)
    }

    let denominator = 1n
    while (!Number.isInteger(num)) {
      num += num
      denominator += denominator
    }

    return new Fraction(BigInt(num), denominator)
  }

  static fromBigInt(big: bigint) {
    return new Fraction(big, 1n)
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

  isNegative () {
    return this.numerator < 0n !== this.denominator < 0n
  }

  floor () {
    // ceil was actually done first
    if (this.isNegative()) {
      if (this.numerator < 0n) {
        return ((this.numerator + 1n) / this.denominator) - 1n
      }
      return ((this.numerator - 1n) / this.denominator) - 1n
    }
    return this.numerator / this.denominator
  }

  ceil () {
    if (this.isNegative()) {
      return this.numerator / this.denominator
    }
    // Both the numerator and denominator are negative
    if (this.numerator < 0n) {
      return 1n - ((this.numerator + 1n) / this.denominator)
    }
    return ((this.numerator - 1n) / this.denominator) + 1n
  }

  /// Halfway cases are rounded away from zero
  /// = RoundAwayFromZero(this)
  round () {
    const baseInt = this.numerator / this.denominator
    const remainder = this.numerator - (this.denominator * baseInt)
    if (remainder === 0n) {
      return baseInt
    }
    if (this.isNegative()) {
      return baseInt - 1n
    }
    return baseInt + 1n
  }

  /// = RoundToZero(this)
  trunc () {
    return this.numerator / this.denominator
  }

  // Returns the fractional part of the number
  fract () {
    return new Fraction(this.numerator % this.denominator, this.denominator)
  }

  abs () {
    return new Fraction(
      this.numerator < 0 ? -this.numerator : this.numerator,
      this.denominator < 0 ? -this.denominator : this.denominator
    )
  }

  sign () {
    if (this.numerator === 0n) {
      return 0n
    }
    if (this.isNegative()) {
      return -1n
    }
    return 1n
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
    return new Fraction(numerator ** big, denominator ** big)
  }

  /// Returns the square root of this
  /// RangeError if result is a surd
  sqrt () {
    if (this.isNegative()) {
      throw new RangeError("Unsupported: Even root of a negative number is imaginary")
    }

    this.simplify()
    if (this.denominator
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
    if (frac.numerator === 0n) {
      throw new RangeError("division by 0")
    }
    return new Fraction(this.numerator * frac.denominator, this.denominator * frac.numerator)
  }

  // pow(x, a/b) === bth root(x^a)
  exponentiate (frac: Fraction) {
    this.simplify()
    frac.simplify()
    if (frac.denominator === 1n) {
      return this.powint(frac.numerator)
    }

    if (frac.numerator === 0n) {
      if (this.numerator === 0n) {
        throw new RangeError("0 to the power of 0")
      }
      return new Fraction(1n, 1n)
    }

    const result = this.powint(frac.numerator)
    result.numerator = nthRoot(frac.denominator, result.numerator)
    result.denominator = nthRoot(frac.denominator, result.denominator)

    return result
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
}

function describe (name: string, func: () => void) {
  console.group(name)
  func()
  console.groupEnd()
}
