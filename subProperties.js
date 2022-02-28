function* subProperties (thing=globalThis) {
   let props = []
   let done = []
   let todo = [thing]

   while (todo.length > 0) {
      let currentThing = todo.pop()

      if (!props.includes(currentThing)) {
         yield currentThing
         props.push(currentThing)
      }

      if (done.includes(currentThing)) {
         continue
      } else {
         done.push(currentThing)
      }

      if (typeof currentThing === undefined || typeof currentThing === null) {
         continue
      }

      let properties;
      try {
         properties = [...Object.getOwnPropertyNames(currentThing), ...Object.getOwnPropertySymbols(currentThing)]
      } catch (error) {
         yield ['Actual Error, type 0', error]
         console.warn('Cannot get properties, skipping this one: %o', currentThing)
         continue
      }

      for (const property of properties) {
         try {
            if ('get' in Object.getOwnPropertyDescriptor(currentThing, property)) {
               console.warn(
                  '"get" in Object.getOwnPropertyDescriptor(%o, %o).' + 
                  'This means that the value of the property could just change in the middle of this function.',
                  currentThing,
                  property
               )
            }
         } catch (error) {
            yield ['Actual Error, type 1', error]
         }
         try {
            if (!props.includes(currentThing[property])) {
               yield currentThing[property]
               props.push(currentThing[property])
            }
            if (!(done.includes(currentThing[property])) && !(todo.includes(currentThing[property]))) {
               todo.push(currentThing[property])
            }
         } catch (error) {
            yield ['Actual Error, type 2', error]
         }
      }
   }

   return props
}

// Version 0.2
function* generateEverythingPossible () {
   yield globalThis

   const nouns = new Set()
   const done = new Set()
   const nounsLeft = new Set()
   nounsLeft.add(globalThis)

   const newNounsLeft = new Set()

   while (nounsLeft.size > 0) {
      for (const noun of nounsLeft) {
         nounsLeft.delete(noun)
         done.add(noun)

         if (noun === undefined || noun === null) {
            continue
         }

         try {
            newNounsLeft.add(Object.getPrototypeOf(noun))
         } catch (error) {
            newNounsLeft.add(error.message)
         }
         try {
            const propertyNames = new Set()
            for (const [name, propertyDescriptor] of Object.entries(Object.getOwnPropertyDescriptors(noun))) {
                // enumerable and configurable ignored
                // value and writable, or get and set
                if ("value" in propertyDescriptor) {
                    propertyNames.add(name)
                } else {
                    if ("get" in propertyDescriptor) {
                        newNounsLeft.add(propertyDescriptor.get)
                        propertyNames.add(name)
                    }
                    if ("set" in propertyDescriptor) {
                        newNounsLeft.add(propertyDescriptor.set)
                    }
                }
            }

            // obj extends from obj[[prototype]].prototype, obj[[prototype]][[prototype]].prototype, etc.
            // confusing names though
            let prototype = Object.getPrototypeOf(noun)
            try {
               while (prototype !== null) {
                  if (prototype.prototype !== undefined && prototype.prototype !== null) {
                      for (const propertyName of [
                              ...Object.getOwnPropertyNames(prototype.prototype),
                              ...Object.getOwnPropertySymbols(prototype.prototype)
                          ])
                      {
                          //if (!propertyNames.has(propertyName)) {
                              propertyNames.add(propertyName)
                          //}
                      }
                  }
                  prototype = Object.getPrototypeOf(prototype)
               }
            } catch (error) {
               console.warn('Error with %o,\n %o', prototype, error)
               newNounsLeft.add(error.message)
            }

            
            for (const name of propertyNames) {
                newNounsLeft.add(noun[name])
            }
         } catch (error) {
            console.warn('Error with %o,\n %o', noun, error)
            newNounsLeft.add(error.message)
         }

         if (newNounsLeft.size !== 0) {
            console.group(noun)
         }
         // nouns
         // newNouns
         // newNounsLeft

         // globalThis - in nouns and nounsleft
         // globalThis - in nouns and done
         // property - in newnounsleft
         // property - in nouns and nounsleft
         // property - in nouns and done
         // property.property
         for (const newNoun of newNounsLeft) {
            if (!done.has(newNoun) && !nounsLeft.has(newNoun)) {
               yield newNoun
               nounsLeft.add(newNoun)
               nouns.add(newNoun)
            }
         }
         if (newNounsLeft.size !== 0) {
            console.groupEnd()
         }
         newNounsLeft.clear()
      }
   }
}
{
   let generator = generateEverythingPossible()
   let x = setInterval(() => {
      let next = generator.next()
      if (next.done) {
         console.log("%cDone!", "color:green;")
         clearInterval(x)
      } else {
         if (next.value instanceof Function) {
            console.group('String(func) === ' + String(next.value))
            console.log(next.value)
            console.groupEnd()
         } else {
            console.log(next.value)
         }
      }
   }, 100)
}

// Version 0.3
/* async */ function *thingGenerator (start = globalThis) {
   yield start
   
   const things = [start]
   const newThings = [start]
   const checkedThings = []
   const functions = [] // Unimplemented
   const propertyTests = new Map() // thing, Set<thing>
   const callTests = new Map() // thing, [ [], [thing], [thing, thing], [thing, thing, thing], ...] // Unimplemented
   // Also unimplemented: await
   
   function* checkNew(thing) {
      if (!things.includes(thing)) {
         try {
            if (thing instanceof Error) {
               for (const thing2 of things) {
                  let thing2Constructor, thing2Message
                  try {
                     thing2Constructor = thing2.constructor
                     thing2Message = thing2.message
                  } catch {continue}
                  
                  if (thing.constructor === thing2Constructor && thing.message === thing2.message) {
                     return  
                  }
               }
            }
         } catch {}
         
         things.push(thing)
         newThings.push(thing)
         yield thing
      }
   }
   
   function update(map, key, value) {
      if (map.has(key)) {
         const set = map.get(key)
         set.add(value)
      } else {
         map.set(key, new Set([value]))
      }
   }
      
   function updateCalls () {
      
   }
      
   function* main() {
      const next = things.shift()
      
      function* propertySearch() {
         // for in catch
         try {
            for (const property in next) yield* checkNew(property);
         } catch (error) {
            yield* checkNew(error)  
         }
      }
      
      function* propertyChecks() {
         for (const thing of checkedThings) {
            // typeof catch
            try {
               if (typeof thing === "string" || typeof thing === "symbol") {
                  // property access catch
                  try {
                     yield* checkNew(thing[next])
                     update(propertyTests, next, thing)
                  } catch (error) {
                     yield* checkNew(error)
                  }
               }
            } catch (error) {
               yield* checkNew(error)  
            }
         }

         try {
            if (typeof next === "string" || typeof next === "symbol") {
               for (const thing of checkedThings) {
                  try {
                     yield* checkNew(thing[next])
                     update(propertyTests, thing, next)
                  } catch (error) {
                     yield* checkNew(error)  
                  }
               }
            }
         } catch (error) {
            yield* checkNew(error)
         }
      }
      
      function* functionCalls(){}
      
      yield* propertySearch()
      yield* propertyChecks()
      yield* functionCalls() // Unimplemented
      
      checkedThings.push(next)
      // unimplemented: if typeof next === "function"
   }
      
   while (newThings.length) {
      yield* main()  
   }
}

// v0.4
async function* search(obj=globalThis, done=new Set(), todo=[]) {
    todo.push = val => {
        if(!done.has(val))Array.prototype.push.call(todo,val)
    }

    async function* main() {
        if (done.has(obj)) return;

        console.log(obj)

        // "undefined" "number" "boolean" "symbol" "symbol" "bigint"
        // "object" "function"
        if (obj !== null && (typeof obj === "object" || typeof obj === "function")) {
            try {
                const props = Object.getOwnPropertyDescriptors(obj)
                for (const prop in props) {
                    const d = props[prop]
                    if ("get" in d) {
                        todo.push(d.get)
                    }
                    if ("set" in d) {
                        todo.push(d.set)
                    }

                    const val = obj[prop]
                    todo.push(val)
                    if (val instanceof Promise) {
                        const result = await val;
                        todo.push(result)
                    }
                }
            } catch (error) {
                todo.push(error)
            }

            try {
                todo.push(Object.getPrototypeOf(obj))
            } catch (error) {
                todo.push(error)
            }
        }

        console.groupEnd()
    }

    yield* main()
    for (; todo.length; obj = todo.pop()) {
        yield* main()
    }
}

// {
//     const s = search()
//     const i = setInterval(async () => {
//         const n = await s.next()
//         if (n.done) clearInterval(i)
//     }, 500)
// }
