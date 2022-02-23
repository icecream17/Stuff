//! Rust borrowship rules, but in javascript
//! Turn a class into an owned one using the `owned` function
//! Or convert individual objects by wrapping it with the `Owned` class
//!
//! == Ownership in rust ==
//!
//! In rust, variables by default "own" their values.
//! And there can only be 1 owner at a time.
//!
//! If another function or variable or whatever wants to use the value,
//! there are 3 options:
//!
//! Transfer ownership, Copy the value, Use a reference
//!
//! References are really just the same as transferring ownership,
//! but then when the reference is dropped, you get your ownership back automatically.
//!
//! References can either be shared or mutable.
//!
//! With shared references, multiple sources get to access the same value,
//! but no one gets to mutate it.
//!
//! And mutable references are almost the same as owning the value.
//! There can only be 1 mutable reference at a time.
//!
//! Since references borrow ownership, the owner
//! cannot do much while there's a reference.
//!
//! Now in Javascript, there's not really a way to guarantee that
//! there's only one owner, or implement "movement".
//!
//! So I guess whenever you use an owned value, drop it explicitly at the end of the scope?
//! (Or add a comment if you're using let/const semantics and don't store it or anything)
//!
//! Hmm, the reason this is useful is because references are automatically dropped
//! at the end of the scope. So make sure to do that manually.

/// I'm not sure how to optimize this
const production = false

const noopfalse = () => false

/// Takes clas and returns a new class that constructs Owned<clas instance>
/// See {@link Owned} about the options param
export function owned(clas, options) {
  return new Proxy(clas, {
    construct(target, args) {
      return new Owned(new target(...args), options)
    }
  })
}

/// The Owned function constructor
///
/// Make sure to always drop at the end of the scope, either implicitly using let-const and block scoping
/// or explicitly using the `drop` methods.
///
/// Similar: OwnedArray
///
/// @param obj - The object to add
/// @param { boolean } mutable - Whether to allow mutable references, default false
/// @param { (p: keyof typeof obj) => boolean } datas - Tells which properties are data properties
/// @param { (p: keyof typeof obj) => boolean } sets - Tells which methods set properties (mutate the object)
export function Owned(obj, { mutable=false, datas=noopfalse, sets=noopfalse }={}) {
  {
    const type = typeof obj
    if (type === "null" || (type !== "object" && type !== "function")) {
      throw TypeError("Not an object")
    }
  }

  // Private data
  let sharedReferences = 0
  let mutableReference = false
  const check = () => {
    if (sharedReferences > 0 || mutableReference) {
      throw ReferenceError("Cannot do anything because there are live references")
    }
    if (mutable === false) {
      throw TypeError("Value is immutable!")
    }
  }

  let dropped = false
  const whenDrop = new Set()
  const { proxy: proxyobj, revoke } = Proxy.revocable(obj, {
    defineProperty(t, p, d) {
      check()
      return Reflect.defineProperty(t, p, d)
    },
    deleteProperty(t, p) {
      check()
      return Reflect.deleteProperty(t, p)
    },
    set(t, p, v) {
      check()
      return Reflect.set(t, p, v)
    },
  })
  whenDrop.add(revoke)

  return {
    obj: proxyobj,
    drop() {
      for (const callback of whenDrop) {callback()}
      dropped = true
    },
    toSharedRef() {
      if (dropped) {
        throw ReferenceError("Cannot create ref of dropped")
      }

      if (mutableReference) {
        throw ReferenceError("Cannot create shared ref because there's a mutable ref.")
      }

      sharedReferences++
      const { proxy, revoke } = Proxy.revocable(obj, {
        defineProperty(_t, _p, _d) {throw TypeError("Cannot define properties in immutable references")},
        deleteProperty(_t, _p) {throw TypeError("Cannot delete properties in immutable references")},
        set(_t, _p, _v) {throw TypeError("Cannot set properties in immutable references")},
        get(t, p, r) {
          if (sets(p)) {
            console.error(p)
            throw TypeError("Cannot use methods that mutate the object")
          }
          Proxy.get(t, p, r)
        }
      })
      whenDrop.add(revoke)
      return {
        drop() {
          sharedReferences--
          revoke()
          whenDrop.delete(revoke)
        },
        ref: proxy,
      }
    },
    toMutRef() {
      if (dropped) {
        throw ReferenceError("Cannot create ref of dropped")
      }

      if (mutable === false) {
        throw TypeError("Value is immutable!")
      }

      if (sharedReferences > 0 || mutableReference) {
        throw ReferenceError("Cannot create mut ref because there's another ref")
      }

      mutableReference = true
      const { proxy, revoke } = Proxy.revocable(obj, {})
      whenDrop.add(revoke)
      return {
        drop() {
          mutableReference = false
          revoke()
          whenDrop.delete(revoke)
        },
        ref: proxy,
      }
    },
  }
}

export function CustomOwned(name, sets) {
  return {
    [name](val) {
      return Owned(val, {sets})
    }
  }[name]
}

export function CustomOwnedList(name, listsets) {
  return {
    [name](val) {
      return Owned(val, {sets: val => listsets.includes(val)})
    }
  }[name]
}

// Can't do anything about Atomics right now
// Not useful for Generator instances or WebAssembly
const DataViewSets = ["setBigInt64", "setBigUint64", "setFloat32", "setFloat64", "setInt16", "setInt32", "setInt8", "setUint16", "setUint32", "setUint8"]
const ArraySets = ["copyWithin", "fill", "pop", "push", "shift", "sort", "splice", "unshift"]
const TypedSets = ["copyWithin", "fill", "set", "splice"] // TypedArray
const DateSets = ["setDate", "setFullYear", "setHours", "setMilliseconds", "setMinutes", "setMonth", "setSeconds", "setTime", "setUTCDate", "setUTCFullYear", "setUTCHours", "setUTCMilliseconds", "setUTCMinutes", "setUTCMonth", "setUTCSeconds", "setYear"]
const MapSets = ["clear", "delete", "set"]
const SetSets = ["add", "clear", "delete"]
export const OwnedArray = CustomOwnedList("OwnedArray", ArraySets)
export const OwnedTyped = CustomOwnedList("OwnedTyped", TypedSets)
export const OwnedDate = CustomOwnedList("OwnedDate", DateSets)
export const OwnedMap = CustomOwnedList("OwnedMap", MapSets)
export const OwnedSet = CustomOwnedList("OwnedSet", SetSets)

// Optimizers should remove this code
function test() {
  describeFail("mutate of immutable value", () => {
    const { obj, drop, toSharedRef, toMutRef } = OwnedArray([2])
    obj.push(2)
  })

  describeFail("toMutRef of immutable value", () => {
    const { obj, drop, toSharedRef, toMutRef } = Owned({})
    toMutRef()
  })

  describeFail("use of value while undropped reference", () => {
    const { obj, drop, toSharedRef, toMutRef } = Owned({ a: 2 })
    toMutRef()
    obj.a
  })
}

function describe(testname, callback) {
  console.group(testname) // group can take multiple arguments
  callback()
  console.groupEnd()
}

function describeFail(testname, callback) {
  console.group(testname)
  const unique = Symbol()
  try {
    callback()
    throw unique
  } catch (error) {
    if (error === unique) {
      throw TypeError("Callback did not throw")
    }
    console.info("Passed with expected error", error)
  }
  console.groupEnd()
}

