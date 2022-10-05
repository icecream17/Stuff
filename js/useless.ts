
// Exceptional code examples

/**
 * The following unnecessarily complex code literally
 * crashes because Electron literally breaks the VM and
 * wow. Atom is a source of obscure bugs that shouldn't exist.
 *
 * Don't use `Function.prototype.call` for no reason.
 * Also don't have a function signature that looks like this.
 * Way too many parameters here.
 * https://github.com/pulsar-edit/superstring/blob/eb0cc0990017dc7aa4a7322ab0f65021765886d3/index.js#L18
 */
function unnecessaryFunctionPrototypeCallUsage(
    findSync: (...args: any) => unknown, pattern: RegExp, ignoreCase: boolean, unicode: string,
    range: { start: { row: number, column: number }, end: { row: number, column: number } }
) {
    const result = findSync.call(this, pattern, ignoreCase, unicode, range)
    console.debug(result)
}

/**
 * This function does not use one of its parameters
 */
function unusedParameter(unused: number) {
   return 3
}

/**
 * This function does not actually need the start parameter
 * Also see https://github.com/rust-lang/rust/pull/96027
 */
function unusedRecursiveParameter(current: number, start: number, list: number[] = []): number[] {
   list.push(current)
   if (current === 1) {
      return list
   }

   if (current % 2 === 0) {
      return unusedRecursiveParameter(3*current + 1, start, list)
   } else {
      return unusedRecursiveParameter(current / 2, start, list)
   }
}

/**
 * This function constantly redeclares an inner function which **could**
 * cause surprisingly large performance issues.
 *
 * Don't do this if there's some weird scoping issues (yikes)
 * or if it doesn't really matter (premature optimization).
 *
 * (But you can if you feel it makes your code easier to understand)
 *
 * More important in React inside very large components' `render` methods.
 *
 * @example
 * trulyInefficientLol(2n) // => 4n ** 24n
 */
function trulyInefficientLol(int: bigint) {
   function long(a: bigint, b: bigint): bigint {
      if (b === 0n) {
         return a
      } else {
         return long(a ** b, b - 1n)
      }
   }

   const copy = int
   for (let i = 0n; i < copy; i++) {
      int = long(int, int)
   }
   return int
}
