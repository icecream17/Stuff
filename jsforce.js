"use strict";
const JSF_CHARS = ["()", "++", "![]", "!![]"] // call() is different from (expression)
const JSF_SURROUND = ["()", "[]"]
const JSF_JOIN = ["+", ""] // Joins: something[] something() something+something

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
let totalCombinations = {}
let failedCombinations = {}
let undefinedCombinations = [ "[][[]]", "[][+[]]", "[][![]]", "[][!![]]" ]
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
   totalCombinations = {}
   failedCombinations = {}
   undefinedCombinations = [ "[][[]]", "[][+[]]", "[][![]]", "[][!![]]" ]
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

// Or mismatched []()
function usesArrayAsFunction (str) {
   if (!(str.includes("[") && str.includes("]"))) {
      return false;
   }

   let stack = []
   let repeats = [0]
   for (let i = 0; i < str.length; i++) {
      if (str[i] === "[" || str[i] === "(") {
         stack.push(str[i])
         repeats.push(0)
      } else if (str[i] === "]") {
         if (stack[stack.length - 1] === "(" || stack.length === 0) return true
         stack.pop()
         repeats.pop()
         repeats[repeats.length - 1]++
         if (str[i + 1] === "(") return true
         if (str[i + 1] + str[i + 2] === "++" && repeats[repeats.length - 1] < 2) return true
      } else if (str[i] === ")") {
         if (stack[stack.length - 1] === "[" || stack.length === 0) return true
         stack.pop()
         repeats.pop()
         repeats[repeats.length - 1]++
      }
      if (stack.length < 0 || stack.length > 4) return "!"
   }

   if (stack.length) return stack
   return false
}

function check (newcombo, char) {
   // a === b instead of startsWith
   if (
      newcombo.includes("(]") ||
      newcombo.includes("[)") ||
      newcombo.includes("!)") ||
      newcombo.includes("!]") ||
      newcombo.includes(")!") ||
      newcombo.includes("]!") ||
      newcombo.includes(")[]") ||
      newcombo.includes("][]") ||
      newcombo.includes("+()") ||
      newcombo.includes("!()") ||
      newcombo.includes("(()") ||
      newcombo.includes("[()") ||
      newcombo.includes("!!!") ||
      newcombo.includes("++!") ||
      newcombo.includes("++(") ||
      newcombo.includes("++[") ||
      newcombo.includes("+++)") ||
      newcombo.includes("+++]") ||
      newcombo === "()" ||
      newcombo.endsWith("!++[]") ||
      newcombo.endsWith("+++[]") ||
      (newcombo.startsWith("((") && newcombo.endsWith("))")) ||
      (newcombo.lastIndexOf("(") < newcombo.lastIndexOf("[") &&
       newcombo.lastIndexOf("[") < newcombo.lastIndexOf(")")) ||
      (newcombo.lastIndexOf("[") < newcombo.lastIndexOf("(") &&
       newcombo.lastIndexOf("(") < newcombo.lastIndexOf("]")) ||
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
   } else if (check1 > 0) {
      combinations[depth][newcombo] = check1
      return;
   } else if (char === "[" || char === "(") {
      combinations[depth][newcombo] = "open"
      return;
   }

   if (newcombo._howmany("[") > newcombo._howmany("]") ||
       newcombo._howmany("(") > newcombo._howmany(")") ||
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
      }

      const resStr = stringify(result.pass)
      if (!again.has(resStr)) {
         again.add(resStr)
         againFrom.set(resStr, [depth, newcombo])
         textarea.value += `${depth}: ${newcombo}\n${resStr}\n`
      } else if (char !== "()") {
         let [oldDepth, oldcombo] = againFrom.get(resStr)
         if (oldcombo.length > newcombo.length) {
            failedCombinations[oldDepth] ??= Object.create(null)
            failedCombinations[oldDepth][oldcombo] = combinations[oldDepth][oldcombo]
            delete combinations[oldDepth][oldcombo]
            textarea.value += `   New record!\n${depth}: ${newcombo}\n${resStr}\n`
         } else {
            failedCombinations[depth] ??= Object.create(null)
            failedCombinations[depth][newcombo] = combinations[depth][newcombo]
            delete combinations[depth][newcombo]
         }
      }
   }
}

function search () {
   combinations[depth] = Object.create(null)

   if (depth === 1) {
      check("[]")
      check("+[]")
      check("![]")
      check("!![]")
   } else {
      for (const combo in combinations[depth - 1]) {
         check(`+${combo}`)
         for (const char of JSF_CHARS) {
            const newcombo = combo + char
            check(newcombo, char)
         }
         for (const surround of JSF_SURROUND) {
            const newcombo = `${surround[0]}${combo}${surround[1]}`
            check(newcombo, JSF_SURROUND)
         }
         for (const join of JSF_JOIN) {
            // Currently only has the previous depths' combinations
            for (const combo2 in totalCombinations) {
               const newcombo = `${combo}${join}${combo2}`
               check(newcombo)
            }
         }
      }
   }

   // clear each depth
   // wait = Object.create(null)

   // Add this depth's combinations to total
   Object.assign(totalCombinations, combinations[depth])
   depth++
}

function time (times=4) {
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
