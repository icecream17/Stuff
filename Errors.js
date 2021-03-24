try {
   eval("1 + 1")
} catch (error) {
   throw EvalError("Cannot use eval, so this code won't work.")
}

try {
   with (12) {}
} catch (error) {
   throw SyntaxError("This is in strict mode? The code won't work.\n" +
                     "Unfortunately, some errors can only be thrown in non-strict mode, and some errors can only be thrown in module code. Oh well")
}


function getCodeParseError (code) {
   try {
      eval(code)
   } catch (error) {
      return error 
   }

   return "Whatever JS implementation you're using has a bug."
}

function getCodeEvaluationError (code) {
   return getCodeParseError(code)
}

const [log, finish] = (function closure () {
   let errors = []
   function add (...args) {
      errors.push(...args) 
   }
   return [add, () => console.log(errors)]
})()


const revokedProxy = (function closure () {
   let revocable = Proxy.revocable({}, {})
   revocable.revoke()
   return revocable.proxy
})()

const revokedFunctionProxy = (function closure () {
   let revocable = Proxy.revocable(function(){}, {})
   revocable.revoke()
   return revocable.proxy
})()

const exampleObject = (function closure () {
   let example = {}
   Object.defineProperty(example, 'nonWritableNumber', {value: 0, writable: false})
   Object.defineProperty(example, 'nonSettableNumber', {get() {return 7}})
})()

const exampleNonExtensibleObject = Object.preventExtensions({})
const badProxy1 = new Proxy({}, {
   getOwnPropertyDescriptor() {
      return {
         get: 7
      }
   }
})
const badProxy2 = new Proxy({}, {
   getOwnPropertyDescriptor() {
      return {
         set: 7
      }
   }
})
const badProxy3 = new Proxy({}, {
   getOwnPropertyDescriptor() {
      return {
         get: 7,
         writable: false
      }
   }
})

log(getCodeParseError('[')) // See 5.1.4
log(getCodeParseError('let x, x'))
log(getCodeParseError('var x; let x'))
log(getCodeParseError('label: label: 1'))
log(getCodeParseError('break label'))
log(getCodeParseError('continue label'))

// <Script StatementList Statement VariableStatement BindingIdentifier>
log(getCodeParseError('"use strict"; var eval'))
log(getCodeParseError('"use strict"; var yield'))

// <Still BindingIdentifier, but different thing. In this case a generator _expression_>
log(getCodeParseError('(function* yield () {})'))
log(getCodeParseError('async await => 1'))
log(getCodeParseError('1 = 1'))
log(getCodeParseError('1++'))
log(getCodeParseError('++1'))
log(getCodeParseError('var 1')) // Only different because of browsers
log(getCodeParseError('"use strict"; var a = [eval] = [1]'))
log(getCodeParseError('var [...[1, 2]] = []'))
log(getCodeParseError('var {...[x, y]} = [1, 2]'))
log(getCodeParseError('var [[1]] = [[8]]'))
log(getCodeParseError('"use strict"; var [[eval]] = [[8]]'))
log(getCodeParseError('"use strict"; var eval = 8'))
log(getCodeParseError('var x = {superMethod} = {superMethod() {super()}}'))
log(getCodeParseError('if (true) label: function a () {};'))

// <Only different because of Browsers, see B.3.2>
log(getCodeParseError('"use strict"; if (true) label: function a () {};'))

log(getCodeEvaluationError('1n ** -1n'))
log(getCodeEvaluationError('1n / 0n'))
log(getCodeEvaluationError('0n % 0n'))
log(getCodeEvaluationError('2n >>> 1n'))
// todo: 6.1.7.2
log(getCodeEvaluationError('undefinedVariable'))

// I don't see any way to make PutValue throw in step 3

log(getCodeEvaluationError('"use strict"; undefinedVariable = 1'))
log(getCodeEvaluationError('exampleObject.nonWritableNumber++'))
log(getCodeEvaluationError('exampleObject.nonSettableNumber++'))
log(getCodeEvaluationError('exampleNonExtensibleObject.nonExistentProperty++'))
log(getCodeEvaluationError('Object.defineProperty({}, "property", "not object")'))
log(getCodeEvaluationError('Object.defineProperty({}, "property", {get: 7})'))
log(getCodeEvaluationError('Object.defineProperty({}, "property", {set: 7})'))
log(getCodeEvaluationError('Object.defineProperty({}, "property", {set: 7, writable: false})'))
log(getCodeEvaluationError('new ArrayBuffer(1e300)'))
log(getCodeEvaluationError('new SharedArrayBuffer(1e300)'))
log(getCodeEvaluationError('1 + ({[Symbol.toPrimitive](){return {}}})'))
log(getCodeEvaluationError('1 + ({valueOf(){return {}}, toString(){return {}}})'))
log(getCodeEvaluationError('+Symbol()'))
log(getCodeEvaluationError('+2n'))
log(getCodeEvaluationError('BigInt.asIntN(2, undefined)'))
log(getCodeEvaluationError('BigInt.asIntN(2, null)'))
log(getCodeEvaluationError('BigInt.asIntN(2, 5)'))
log(getCodeEvaluationError('BigInt.asIntN(2, 7)')) // Only different because of browsers
log(getCodeEvaluationError('BigInt.asIntN(2, "NaN")')) // For some reason this throws a SyntaxError when run.
log(getCodeEvaluationError('"" + Symbol()'))
log(getCodeEvaluationError('Object.assign(undefined)'))
log(getCodeEvaluationError('Object.assign(null)'))
log(getCodeEvaluationError('BigInt.asIntN(2.5, 5n)'))
log(getCodeEvaluationError('BigInt.asIntN(-7, 5n)'))
log(getCodeEvaluationError('Array.isArray(revokedProxy)'))
log(getCodeEvaluationError('let array = []; array[2**32 - 2] = 7; array.push("another value")'))
log(getCodeEvaluationError('JSON.stringify([], revokedProxy)'))

class RidiculousArray extends new Proxy(Array, {
   construct (target, args) {
      let value = new target(...args)
      Object.defineProperty(value, "2", {
         value: 7,
         writable: false,
         configurable: false
      })
      return value
   }
}) {}

log(getCodeEvaluationError('RidiculousArray.from(new RidiculousArray())'))
console.log('There some errors that could theoretically happen if computers could do some Array functions 2**32 times without crashing')


log(getCodeEvaluationError(`
   Object.defineProperty(
      Object.defineProperty({}, "property", {"configurable": false}),
      "property",
      {"configurable": true}
   )
`))
log(getCodeEvaluationError(`
   let temporaryValue = new Proxy(
      [,,1,,2], // Empty Empty 1 Empty 2
      {
         deleteProperty (...args) {return false}
      }
   )

   temporaryValue.copyWithin(3)
`))
log(getCodeEvaluationError('1 + ({[Symbol.toPrimitive]: "Not a function!?"})'))
log(getCodeEvaluationError('1 + ({[Symbol.toPrimitive]: "A different string"})')) // Only different because of browsers
log(getCodeEvaluationError('1 + ({toString: "Not a function!?"}).toLocaleString()'))
log(getCodeEvaluationError('1 + ({toString: "A different string"}).toLocaleString()')) // Only different because of browsers
log(getCodeEvaluationError(`
   let badProxy = new Proxy({}, {
      ownKeys() {return "Not an object!?"}
   })
   badProxy.getOwnPropertyKeys()
`))
log(getCodeEvaluationError(`
   let badProxy = new Proxy({}, {
      ownKeys() {return [false]}
   })
   Object.getOwnPropertyNames(badProxy)
`))
log(getCodeEvaluationError(`Function.prototype[Symbol.hasInstance]({prototype: 12})`))
log(getCodeEvaluationError(`
   let silly = /regex/
   silly.constructor = "uh..."
   silly[Symbol.matchAll]()
`))
log(getCodeEvaluationError(`
   let sillyRegex = /regex/
   sillyRegex.constructor = {
      [Symbol.species]: "uh..."
   }
   sillyRegex[Symbol.matchAll]()
`))
log(getCodeEvaluationError(`
   let sillyArray = []
   sillyArray.constructor = revokedFunctionProxy
   sillyArray.concat()
`))
log(getCodeEvaluationError(`
   let sillyIterable = []
   sillyIterable[Symbol.iterator] = (..._args) => "Wow"
   new Set(sillyIterable)
`))
log(getCodeEvaluationError(`
   let sillyIterable = []
   sillyIterable[Symbol.iterator] = (..._args) => ({
      next () {return "Wow"}   
   })
   new Set(sillyIterable)
`))





finish()
