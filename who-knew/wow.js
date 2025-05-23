// test-262, built-ins, Array, 15.4.5.1-5-1.js
const array = []
array[2**32 - 1] = "Not an array element"
console.log(array)
console.log(array.length) // 0

// Comments in function declaration
function /* lmao */ legalSyntax() {}
try {
  console.log(legalSyntax.toString()) // "function /* lmao */ legalSyntax() {}"
} finally {}

// https://github.com/tc39/test262/issues/3675
console.log(Array.of.bind(Object)("test")) // Number { 1 , 0: "test" , length: 1 }

// Special function constructors
////////////////////////////////
console.log(Object.getPrototypeOf(async () => {})) // AsyncFunction
console.log(Object.getPrototypeOf(function*() {})) // GeneratorFunction
console.log(Object.getPrototypeOf(async function*() {})) // AsyncGeneratorFunction

function tryCatch(immediatelyInvokedCallback) {
  try {
    immediatelyInvokedCallback()
  } catch (error) {
    console.error(error)
  }
}

// Uncaught TypeError: Function.prototype.toString requires that 'this' be a function.
tryCatch(() => `${Object.getPrototypeOf(async () => {})}`)

console.log(typeof Object.getPrototypeOf(async () => {})) // 'object'
console.log(Object.getPrototypeOf(async () => {}) instanceof Function) // true
/////////////////////////////////

// instanceof errors
// Uncaught TypeError: Right-hand side of 'instanceof' is not an object
tryCatch(() => 1 instanceof true)
// Uncaught TypeError: Right-hand side of 'instanceof' is not callable
tryCatch(() => 1 instanceof {})
// Uncaught TypeError: Function has non-object prototype 'undefined' in instanceof check
tryCatch(() => [] instanceof (() => {}))

// Object.prototype.toString
console.log({}.toString.apply(null)) // '[object Null]'
console.log({}.toString.apply()) // '[object Undefined]'
console.log({}.toString.apply(Array)) // '[object Function]'

// Rounding to -0
console.log(Object.is(Math.round(-0.1), -0)) // true
console.log(Object.is(0, -0)) // false
