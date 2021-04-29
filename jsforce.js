"use strict";
const JSF_CHARS = "[]()+!"

const textarea = (() => {
   if ("document" in globalThis && globalThis?.location.href === "about:blank") {
      let result = document.createElement('textarea')
      result.cols = 50
      result.rows = 32
      document.body.appendChild(result)
      return result
   } else {
      // same thing to the code
      return { value: "" }
   }
})()

const nestingMap = {
   '[': ']',
   '(': ')'
}

let depth = 1
let combinations = []
let again = new Set()
// let combosDone = new Set()
// Don't need to check, each string is added by one different char each time,
// and they won't collide

// optimization
// let wait = Object.create(null)

// e.g. ([( can only happen one way

function reset () {
   depth = 1
   combinations = []
   textarea.value = ''
   again = new Set()
//   wait = Object.create(null)
   console.clear()
}

String.prototype._howmany = function _howmany (substring) {
   return this.split(substring).length - 1
}

function tryJSF (code) {
   try {
      return { 'pass': eval(code) }
   } catch (error) {
      console.log(code, error.message)
      return { 'fail': error }
   }
}

function stringify (value) {
   if (typeof value === "string") {
      return `"${value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`
   } else if (typeof value === "object" && value !== null) {
      let oldTostring = Array.prototype.toString
      Array.prototype.toString = function () {
         return `[${this.join(', ')}]`
      }

      let seen = new WeakSet()
      const result = JSON.stringify(value, function (key, keyvalue) {
         if (typeof keyvalue === "object" && keyvalue !== null) {
            if (seen.has(keyvalue)) return "[[Cyclic value]]"
            else seen.add(keyvalue)
         } else if (keyvalue === undefined || keyvalue === NaN) {
            return "~undefined~"
         }
         return keyvalue
      }).replaceAll('"~', '').replaceAll('~"', '')
      Array.prototype.toString = oldTostring
      return result
   }
   return value
}

function usesArrayAsFunction (str) {
   if (!(
      str.includes("[") &&
      str.includes("]") &&
      str.lastIndexOf("(") > str.indexOf(']')))
   {
      return false;
   }

   const lastparen = str.lastIndexOf("(")
   let nesting = 1
   for (let i = str.indexOf("[") + 1; i < lastparen; i++) {
      if (str[i] === "[") {
         nesting++
      } else if (str[i] === "]") {
         nesting--
      }
      if (nesting === 0 && str[i + 1] === "(") return true
      if (nesting < 0) return "!"
   }
   return nesting || false
}

function search () {
   combinations[depth] = Object.create(null)

   if (depth === 1) {
      for (const char of "+!") {
         combinations[depth][char] = "nothing here"
      }
      for (const char of "[(") {
         combinations[depth][char] = "nothing here"
      }
   } else {
      for (const combo in combinations[depth - 1]) {
         for (const char of JSF_CHARS) {
            const newcombo = combo + char

            // a === b instead of startsWith
            if (
               newcombo.includes("(]") ||
               newcombo.includes("[)") ||
               newcombo.includes("(())") ||
               newcombo.includes("[()]") ||
               newcombo.includes(")[]") ||
               newcombo.includes("][]") ||
               newcombo.includes("+()") ||
               newcombo.includes("!()") ||
               newcombo.includes("(()") ||
               newcombo.includes("[()") ||
               newcombo.includes("!)") ||
               newcombo.includes("!]") ||
               newcombo.includes(")!") ||
               newcombo.includes("]!") ||
               newcombo.includes("!!!") ||
               /[^+]\+[!)\]]/.test(newcombo) ||
               newcombo === "()" ||
               newcombo._howmany("[") < newcombo._howmany("]") ||
               newcombo._howmany("(") < newcombo._howmany(")") ||
               (newcombo.lastIndexOf("(") < newcombo.lastIndexOf("[") &&
                newcombo.lastIndexOf("[") < newcombo.lastIndexOf(")")) ||
               (newcombo.lastIndexOf("[") < newcombo.lastIndexOf("(") &&
                newcombo.lastIndexOf("(") < newcombo.lastIndexOf("]")) ||
               newcombo === "++!" ||
               newcombo === "++[]++" ||
               /([!+[(]|^)\+\+\+(\+|!|]|\)|$)/.test(newcombo) ||
               /([![(]|^)\+\+[+!)\]]/.test(newcombo) ||
               /([![(]|^)\+\+\[]([^[]|$)/.test(newcombo) ||
               /([+![(]|^)\[]\+\+/.test(newcombo) ||
               newcombo.endsWith("!++[]") ||
               newcombo.endsWith("+++[]"))
            {
               continue;
            }


//             if (wait[combo] > depth) {
//                combinations[depth][newcombo] = "waiting"
//                wait[newcombo] = wait[combo]
//                continue;
//             }

            const check1 = usesArrayAsFunction(newcombo)
            if (check1 === true || check1 === "!") {
               continue;
            } else if (check1 > 0) {
               combinations[depth][newcombo] = check1
               continue;
            } else if (char === "[" || char === "(") {
               combinations[depth][newcombo] = "open"
               continue;
            }

            if (newcombo._howmany("[") > newcombo._howmany("]") ||
                newcombo._howmany("(") > newcombo._howmany(")") ||
                newcombo.endsWith("!") ||
                newcombo.endsWith("+") ||
                (/\+\+\[.*]/.test(newcombo) && !/\+\+\[.*]\[/.test(newcombo)) || 
                (/\[.*]\+\+/.test(newcombo) && !/\]\[.*]\+\+/.test(newcombo)))
            {
               combinations[depth][newcombo] = "nothing here"
               continue;
            }

            const result = combinations[depth][newcombo] = tryJSF(newcombo)
            if ("pass" in result) {
               const resStr = stringify(result.pass)
               if (!again.has(resStr)) {
                  again.add(resStr)
                  textarea.value += `${depth}: ${newcombo}\n${resStr}\n`
               }
            }
         }
      }
   }

   // clear each depth
   // wait = Object.create(null)

   depth++
}

function time (times=9) {
   reset()
   console.time('search')
   for (let i = 0; i < times; i++) {
      console.time(`depth ${depth}`)
      search()
      console.timeEnd(`depth ${depth - 1}`)
   }
   console.timeEnd('search')
}

function time2 () {
   console.time('search')
   search()
   console.timeEnd('search')
}
