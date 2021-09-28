"use strict";
const POSSIBLE_CHARS = "0123456789ftuarNnldseiIy.+[objc A]-,O"
const POSSIBLE_STRING = /^[0123456789ftuarNnldseiIy.+[objc A\]\-,O]*$/
const JSF_PROPERTIES = [
   // "'false'",
   // "'true'",
   // "'undefined'",
   // "'NaN'",
   "'is'",
   "'flat'",
   // "'Infinity'",
   "'fill'",
   "'find'",
   "'seal'",
   "'filter'",
   "'entries'",
   // "'[object Array Iterator]'",
   "'sort'",
   "'call'",
   "'bind'",
   "'slice'",
   "'create'",
   "'reduce'",
   "'includes'",
   "'join'",
   "'concat'",
   "'constructor'",
   // "'[object Object]'",
]
const JSF_UNITS = ["[]", "![]", "!![]", "+[![]]", "[][[]]"] // Beyond this there's no reason to use "!"
const JSF_SURROUND = ["()", "[]"]
const JSF_JOIN = ["+", ""] // Joins: something[] something() something+something
// Function calls are done by surrounding "expression" to get (expression) and then joining "[]" with "(expression)"

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
let passedCombinations = {}
let failedCombinations = []
let undefinedCombinations = [ "[][[]]", "[][+[]]", "[][![]]", "[][!![]]" ]
let triedCombinations = []
let stringCounts = {}
let again = new Set()
let againFrom = new Map()
// let combosDone = new Set()
// Don't need to check, each string is added by one different char each time,
// and they won't collide

// optimization
// let wait = Object.create(null)

// e.g. ([( can only happen one way

function reset () {
   depth = 1
   combinations = []
   passedCombinations = {}
   failedCombinations = []
   undefinedCombinations = [ "[][[]]", "[][+[]]", "[][![]]", "[][!![]]" ]
   triedCombinations = []
   textarea.value = ''
   again = new Set()
   againFrom = new Map()
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

function shouldError (code) {
   try {
      eval(code)
      console.log(code, "This should error")
   } catch {}
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
            if (keyvalue instanceof Number) return `~Number { ${keyvalue} }~`
            if (keyvalue instanceof String) return `~String { ${keyvalue} }~`
            if (keyvalue instanceof Boolean) return `~Boolean { ${keyvalue} }~`

            if (seen.has(keyvalue)) return "~[[Cyclic value]]~"
            else seen.add(keyvalue)
         } else if (typeof keyvalue === "function") {
            return `~function ${keyvalue.name}()~`
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

// Or mismatched []()
// Or (false)()
function usesArrayAsFunction (str) {
   if (!(str.includes("[") && str.includes("("))) {
      return false;
   }

   let stack = []
   let isFunction = [0] // 0, 1, 2
   for (let i = 0; i < str.length; i++) {
      if (str[i] === "[" || str[i] === "(") {
         stack.push(str[i])
         isFunction[stack.length] = 0 // same as push
      } else if (str[i] === "]") {
         if (stack[stack.length - 1] === "(" || stack.length === 0) return true
         stack.pop()
         const temp = isFunction.pop()
         isFunction[stack.length]++
         if (str[i + 1] === "(" && isFunction[stack.length] < 2) return true
      } else if (str[i] === ")") {
         if (stack[stack.length - 1] === "[" || stack.length === 0) return true
         stack.pop()
         const temp = isFunction.pop()
         if (temp < isFunction[stack.length]) {
            isFunction[stack.length] = temp
         }
         if (str[i + 1] === "(" && isFunction[stack.length] < 2) return true
      }
      if (stack.length < 0 || stack.length > 4) return "!"
   }

   if (stack.length) return stack
   return false
}

function check (newcombo, char) {
   if (triedCombinations.includes(newcombo)) {
      // console.trace(newcombo)
      return
   }
   triedCombinations.push(newcombo)

   // a === b instead of startsWith
   if (
      // newcombo.includes("(]") ||
      // newcombo.includes("[)") ||
      newcombo.includes("!)") ||
      newcombo.includes("!]") ||
      newcombo.includes(")!") ||
      newcombo.includes("]!") ||
      newcombo.includes(")[]") ||
      newcombo.includes("][]") ||
      newcombo.includes("+()") ||
      // newcombo.includes("!()") ||
      newcombo.includes("(()") ||
      newcombo.includes("[()") ||
      // newcombo.includes("!!!") ||
      newcombo.includes("++!") ||
      newcombo.includes("++(") ||
      newcombo.includes("++[") ||
      newcombo.includes("+++)") ||
      newcombo.includes("+++]") ||
      newcombo === "()" ||
      // newcombo.endsWith("!++[]") ||
      newcombo.endsWith("+++[]") ||
      (newcombo.startsWith("((") && newcombo.endsWith("))")) ||
//       (newcombo.lastIndexOf("(") < newcombo.lastIndexOf("[") &&
//        newcombo.lastIndexOf("[") < newcombo.lastIndexOf(")")) ||
//       (newcombo.lastIndexOf("[") < newcombo.lastIndexOf("(") &&
//        newcombo.lastIndexOf("(") < newcombo.lastIndexOf("]")) ||
      undefinedCombinations.some(undefinedCombo => newcombo.includes(undefinedCombo + '[') || newcombo.includes(undefinedCombo + '(')) ||
      // newcombo._howmany("[") < newcombo._howmany("]") ||
      // newcombo._howmany("(") < newcombo._howmany(")") ||
      /[\(\[]{3}/.test(newcombo) ||
      /[\)\]]{3}/.test(newcombo) ||
      /\]\[!!?\[\]\]/.test(newcombo) ||
      /\[[^\[\]]+\]\[\[\]\]/.test(newcombo) ||
      /[^+]\+[!)\]]/.test(newcombo) ||
      /([!+[(]|^)\+\+\+(\+|!|]|\)|$)/.test(newcombo) ||
      /([![(]|^)\+\+[+!)\]]/.test(newcombo) ||
      /([![(]|^)\+\+\[]([^[]|$)/.test(newcombo) ||
      /([+![(]|^)\[]\+\+/.test(newcombo))
   {
      // shouldError(newcombo)
      return;
   }


//    if (wait[combo] > depth) {
//       combinations[depth][newcombo] = "waiting"
//       wait[newcombo] = wait[combo]
//       return;
//    }

   const check1 = usesArrayAsFunction(newcombo)
   if (check1 === true || check1 === "!") {
      // shouldError(newcombo)
      return;
   }

   if (// newcombo._howmany("[") > newcombo._howmany("]") ||
       // newcombo._howmany("(") > newcombo._howmany(")") ||
       newcombo.endsWith("!") ||
       newcombo.endsWith("+") ||
       (/\+\+\[.*]/.test(newcombo) && !/\+\+\[.*]\[/.test(newcombo)) || 
       (/\[.*]\+\+/.test(newcombo) && !/\]\[.*]\+\+/.test(newcombo)))
   {
      combinations[depth][newcombo] = "nothing here"
      return;
   }

   const result = combinations[depth][newcombo] = tryJSF(newcombo)
   if ("pass" in result) {
      if (result.pass === undefined) {
         undefinedCombinations.push(newcombo)
      } else if (typeof result.pass === "string") {
         if (result.pass.includes("function") || POSSIBLE_STRING.test(result.pass)) {
            failedCombinations.push(newcombo)
            delete combinations[depth][newcombo]
            return
         }
      }

      const resStr = stringify(result.pass)
      if (/(true|false|undefined|NaN|[0-9]){3}/.test(resStr) || resStr?.name === "anonymous") {
         failedCombinations.push(newcombo)
         delete combinations[depth][newcombo]
         return
      }

      if (!again.has(resStr)) {
         again.add(resStr)
         againFrom.set(resStr, [depth, newcombo])
         let out = typeof resStr === "function" ? `function ${resStr.name}()` : resStr
         textarea.value += `${depth}: ${newcombo}\n${out}\n`
      } else if (char !== "()") {
         let [oldDepth, oldcombo] = againFrom.get(resStr)
         if (oldcombo.length > newcombo.length) {
            failedCombinations.push(oldcombo)
            delete combinations[oldDepth][oldcombo]
            delete passedCombinations[oldcombo]
            againFrom.set(resStr, [depth, newcombo])
            textarea.value += `   New record!\n      ${depth}: ${newcombo}\n      ${resStr}\n`
         } else {
            failedCombinations.push(newcombo)
            delete combinations[depth][newcombo]
         }
      }
   } else {
      failedCombinations.push(newcombo)
      delete combinations[depth][newcombo]
   }
}

function comboChecks (combo) {
   for (const char of JSF_UNITS) {
      const newcombo = combo + char
      check(newcombo, char)
   }

   if (passedCombinations[combo] === "nothing here") return;
   // So now we know combo is a completed expression

   for (const property of JSF_PROPERTIES) {
      check(`${combo}[${property}]`)
   }

   for (const surround of JSF_SURROUND) {
      const newcombo = `${surround[0]}${combo}${surround[1]}`
      check(newcombo, surround)
   }

   if (combo[0] !== '+') {
      check(`+${combo}`)
   }

   for (const join of JSF_JOIN) {
      // Currently only has the previous depths' combinations
      for (const combo2 in passedCombinations) {
         if (passedCombinations[combo2] === "nothing here") continue;
         const newcombo = `${combo}${join}${combo2}`
         const newcombo2 = `${combo2}${join}${combo}`
         check(newcombo)
         check(newcombo2)
      }
   }
}

async function* _search () {
   combinations[depth] = Object.create(null)

   if (depth === 1) {
      for (const unit of JSF_UNITS) {
         check(unit)
      }
   } else {
      const countLabel = `${depth} (${Object.keys(combinations[depth - 1]).length} elements)`
      for (const combo in combinations[depth - 1]) {
         console.count(countLabel)
         yield comboChecks(combo)
         await new Promise(resolve => setTimeout(resolve, 0))
      }
      console.countReset(countLabel)
   }

   // clear each depth
   // wait = Object.create(null)

   // Add this depth's combinations to "passed"
   Object.assign(passedCombinations, combinations[depth])
   depth++
}

async function time (times=10) {
   reset()
   console.time('search')

   for (let i = 0; i < times; i++) {
      console.time(`depth ${depth}`)

      const search = _search()
      while (!((await search.next()).done)) continue;

      console.timeEnd(`depth ${depth - 1}`)
   }
   console.timeEnd('search')
}

function time2 () {
   console.time('search')
   search()
   console.timeEnd('search')
}
