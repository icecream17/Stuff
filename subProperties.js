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
