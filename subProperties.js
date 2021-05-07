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
            if (!done.has(newNoun)) {
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
