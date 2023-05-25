const assert = (condition, message) => {
  if (!condition) throw Error(message)
}

/**
 * Makes a class callable
 *
 * @example
 * ```js
 * makeCallable(class{})
 * ```
 */
const makeCallable = c =>
   new Proxy(c, {
      apply (target, thisArg, argArray: A) {
         return new target(...argArray)
      }
   })

/**
 * https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-getprototypefromconstructor
 */
const getPrototypeFromConstructor = (constructor_, intrinsicDefaultProto) => {
  const proto = constructor_.prototype
  const protoIsObject = proto !== null && (typeof proto === "object" || typeof proto === "function")
  return protoIsObject ? proto : intrinsicDefaultProto
}

/**
 * https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-validateandapplypropertydescriptor
 */
const validateAndApplyPropertyDescriptor = (o, p, extensible, desc, current) => {
  assert(typeof p === "string" || typeof p === "symbol", "NestArray set property internal error: argument was not a PropertyKey")
  if (current === undefined) {
    if (extensible === false) return false;
    if (o === undefined) return true;
    
  }
}

/**
 * https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinarydefineownproperty
 */
const ordinaryDefineOwnProperty = (o, p, desc) => {
  const current = Reflect.getOwnPropertyDescriptor(o) // guaranteed to not fail given o is an object
  const extensible = Reflect.isExtensible(o) // same as Object.isExtensible
  return validateAndApplyPropertyDescriptor(o, p, extensible, desc, current)
}

// /**
//  * https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber
//  */
// const toNumber = arg => +arg

/**
 * https://tc39.es/ecma262/multipage/abstract-operations.html#sec-touint32
 */
const toUint32 = arg => {
  const number = +arg
  if (!Number.isFinite(number) || number === 0) {
    return +0
  }
  return Math.floor(Math.abs(number)) % (2**32)
}

/**
 * https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-arraysetlength
 */
const nestArraySetLength = (a, desc) => {
  if ("value" in desc) {
    let numberLen = +desc.value
    let newLen = toUint32(numberLen)
    if (numberLen !== newLen) {
      throw new RangeError("Invalid array length")
    }
    // "Let [newLenDesc] be a copy of [descriptor]"
    const newLenDesc = Object.assign({}, desc)
    newLenDesc.value = newLen
    const oldLenDesc = Object.getOwnPropertyDescriptor(a, "length")
    assert("value" in oldLenDesc || "writable" in oldLenDesc, "NestArray instance internal error: `length`: !IsDataDescriptor(oldLenDesc)")
    assert(oldLenDesc.configurable === false, "NestArray instance internal error: `length`: oldLenDesc.configurable must be false")
    const oldLen = oldLenDesc.value
    if (newLen >= oldLen) {
      return Reflect.defineProperty(a, "length", newLenDesc)
    }
    if (oldLenDesc.writable === false) {
      return false
    }
    let newWritable
    if (newLenDesc.writable === false) {
      newWritable = false
      newLenDesc.writable = true
    } else {
      newWritable = true
    }
    const succeeded = Reflect.defineProperty(a, "length", newLenDesc)
    if (succeeded === false) return false;
    // I trust that a.[[getOwnPropertyKeys]] is sane and does the same thing as iterating over property keys directly
    const pIndices = Object.getOwnPropertyNames(a).filter(p => String(+p) === p && toUint32(p) >= newLen).sort((a, b) => +a - +b)
    for (const p of pIndices) {
      const deleteSucceeded = Reflect.deleteProperty(a, p)
      if (deleteSucceeded === false) {
        newLenDesc.value = toUint32(p) + 1
        if (newWritable === false) newLenDesc.writable = false
        Reflect.defineProperty(a, "length", newLenDesc)
        return false
      }
    }
    if (newWritable === false) {
      const succeeded = Reflect.defineProperty("length", { writable: false })
      assert(succeeded, "NestArray instance internal error: `length`: cannot set writability to false")
    }
    return true
  } else {
    return Reflect.defineProperty(a, "length", desc)
  }
}

const nestArrayInstanceProxyHandler = {
  defineProperty(target, property, descriptor) {
    if (property === "length") {
      return nestArraySetLength(target, descriptor)
    }
    // TODO
  }
}

const nestArrayProxyHandler = {
  apply(target, thisArg, argArray) { return this.construct(target, argArray, thisArg) },
  construct(target, argArray, newTarget) {
    
    if (target !== newTarget && typeof newTarget === "function") {
      return new newTarget(...argArray)
    }
    switch (argArray.length) {
      case 0: {
        const nestArrayInstance = new target()
      }
    }
    const nestArrayInstance = new target(...argArray)
  }
}

/**
 * A nested array class that supports basically every Array feature.
 * It works like a usual array, but when inserting at a specific index,
 * that index is replaced with an array, which is different from shifting all the elements.
 *
 * O(1) push, worst case O(n) unshift and insert
 */
const NestArray = new Proxy(
class NestArray {
  #symbol = Symbol()
  isNestedArray(unk) {
    return #symbol in unk && unk.#symbol = this.#symbol
  }
}, nestArrayProxyHandler)

// const NestArray = Proxy(class NestArray)
// This sets (class NestArray).prototype.constructor to Proxy(class NestArray)
NestArray.prototype.constructor = NestArray
