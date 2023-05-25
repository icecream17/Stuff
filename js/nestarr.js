const assert = (condition, message) => {
  if (!condition) throw Error(message)
}

/**
 * https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-getprototypefromconstructor
 */
const getPrototypeFromConstructor = (constructor_, intrinsicDefaultProto) => {
  const proto = constructor_.prototype
  const protoIsObject = proto !== null && (typeof proto === "object" || typeof proto === "function")
  return protoIsObject ? proto : intrinsicDefaultProto
}

// /**
//  * https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber
//  */
// const toNumber = arg => +arg

const isArrayIndex = prop => {
  const num = +prop
  return Number.isInteger(num) && !Object.is(num, -0) && num < 2**32 - 1 && prop === String(num)
}

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
    // This is actually "toUint32(p)" but the result is the same                  vv
    const pIndices = Object.getOwnPropertyNames(a).filter(p => isArrayIndex(p) && +p >= newLen).sort((a, b) => +b - +a)
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
      const succeeded = Reflect.defineProperty(a, "length", { writable: false })
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
    } else if (isArrayIndex(property)) {
      const lengthDesc = Object.getOwnPropertyDescriptor(target, "length")
      // Superseded by length integer check
      // assert("value" in lengthDesc || "writable" in lengthDesc, "NestArray instance internal error: `[index]`: !IsDataDescriptor(lengthDesc)")
      assert(lengthDesc.configurable === false, "NestArray instance internal error: `[index]`: lengthDesc.configurable must be false")
      const length = lengthDesc.value
      // length is a non-negative Integral number -- note that 1/length > 0 is sufficient to check for non-negativity
      assert(Number.isInteger(length) && 1/length >= 0, "NestArray instance internal error: `[index]`: length is not a nonnegative integer")
      const index = toUint32(property)[
      if (index >= length && lengthDesc.writable === false) return false;
      const succeeded = Reflect.defineProperty(target, property, descriptor)
      if (succeeded === false) return false;
      if (index >= length) {
        lengthDesc.value = index + 1
        const succeeded = Reflect.defineProperty(a, "length", lengthDesc)
        assert(succeeded, "NestArray instance internal error: `[index]`: index >= length but cannot change length")
      }
      return true
    }
    return Reflect.defineProperty(target, property, descriptor)
  }
}

const ArrayCreate = (length, proto=NestArray.prototype) => {
  
}

const nestArrayProxyHandler = {
  // Allows a class to be called as a function
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
