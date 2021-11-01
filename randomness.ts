/**
 * I wanted to try to figure out how someone could detect non-randomness in psuedorandom functions.
 * Here's a somewhat good psuedorandom number generator, as far as I could tell.
 * 
 * "could" is the keyword. (cont'd at {@link log2SomeInt})
 */
const random = (() => {
   let current = 0
   let times = 0
   return () => {
      current += 0.538463141592653589793
      current *= times++
      return (current %= 1)
   }
})()

/**
 * After a lot of tests, I thought about the numbers in [0, 1) themselves.
 * JavaScript uses the double percision floating point format.
 * So famously `0.1 + 0.2 === 0.30000000000000004`
 *
 * Idea! you can keep multiplying by two
 * and eventually get an integer!
 */
function log2SomeInt(number: number): [numerator: number, denominator: number, power: number] {
    if (number === NaN) {
        throw TypeError('Got NaN')
    }

    if (number === 0 || !Number.isFinite(number)) {
        return [number, Infinity, Infinity]
    }

    if (Number.isInteger(number)) {
        let divisor = 0
        while (Number.isInteger(number)) {
            divisor--
            number /= 2
        }

        divisor++
        number *= 2
        return [number, 2 ** divisor, divisor]
    } else {
        let denominator = 1
        while (!Number.isInteger(number)) {
            denominator++
            number *= 2
        }

        return [number, 2 ** denominator, denominator]
    }
}

/**
 * If you compare the results of my psuedo rng with Math.random(),
 * there's different results!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 * Math.random's distribution goes like this:
 * #
 * ##
 * ####
 * ########
 * ################
 * ################################
 * ################################################################
 *
 * But this prng's distribution goes like this:
 * #
 * ##
 * ####
 * ######
 * ########
 * ##########
 * ########
 * ######
 * ####
 * ##
 */
function distribution (prng: () => number) {
    const distr_______ = {} as Record<number, number>
    for (let i = 0; i < 10_000; i++) {
        const [/*unused*/, /*unused*/, denominator] = log2SomeInt(prng())
        distr_______[denominator] ??= 0
        distr_______[denominator]++
    }
    return distr_______
}

console.log(distribution(random))
console.log(distribution(Math.random))

/**
 * Well, if you take all possible doubles,
 * the distribution is the exact same throughout
 * (except for some extremeish cases)
 *
 * (The math works out as well)
 */

/**
 * https://gist.github.com/Manouchehri/f4b41c8272db2d6423fa987e844dd9ac
 * Equivalent to the function "fromIEEE754Double"
 */
function bitsToIEEE754Double(bits: number[]) {
    const ebits = 11
    const fbits = 52

    bits.reverse();
    const str = bits.join('');
   
    // Unpack sign, exponent, fraction
    const bias = (1 << (ebits - 1)) - 1;
    const s = parseInt(str.substring(0, 1), 2) ? -1 : 1;
    const e = parseInt(str.substring(1, 1 + ebits), 2);
    const f = parseInt(str.substring(1 + ebits), 2);
     
    // Produce number
    if (e === (1 << ebits) - 1) {
        return f !== 0 ? NaN : s * Infinity;
    }
    else if (e > 0) {
        return s * Math.pow(2, e - bias) * (1 + f / Math.pow(2, fbits));
    }
    else if (f !== 0) {
        return s * Math.pow(2, -(bias-1)) * (f / Math.pow(2, fbits));
    }
    else {
        return s * 0;
    }
}

console.log(distribution(() => {
    const bits = []
    for (let i = 0; i < 64; i++) {
        bits.push(Math.random() > 0.5 ? 0 : 1)
    }
    return bitsToIEEE754Double(bits)
}))
