
class MappingLevel extends null {
   static instanceSet = new WeakSet()

   // @param {object} map
   constructor (map) {
      const newlevel = Object.assign(Object.create(null), map)
      MappingLevel.instanceSet.add(newlevel)
      return newlevel
   }
   
   [Symbol.hasInstance](value) {
      return MappingLevel.instanceSet.has(value)
   }
}

const SETTINGS = {
   EvalAllowed: false
}

// Mappings in order of precedence
const MAPPINGS = []

// Each precedence level maps /expression result/ to /expression text/
MAPPINGS[0] = (key) => switch (key) {
   case '0':
      return '+[]'
   case 'false':
      return '![]'
   case 'true':
      return '!![]' // !false
   case '""':
   case "''":
   case '``':
      return '[]+[]'
   default:
      return undefined
})

function mappingLevelHasKey (level, key) {
   return level(key) !== undefined
}

// My device is tracked
export function toJSF (jsCode) {
   
}
