class Expr {
  constructor (a, b, op, fives) {
    this.a = a
    this.b = b
    this.op = op
    this.fives = fives
  }

  static create(a, b, op) {
    return new Expr(a, b, op, a.fives + b.fives)
  }

  isBase() {
    return this.op === null
  }

  ponasuli(otherExpr) {
    const tl = this.tierlist()
    const ot = otherExpr.tierlist()
    if (tl[1] === ot[1]) {
      return tl[0] - ot[0]
    } else {
      return tl[1] - ot[1]
    }
  }

  tierlist() {
    if (this.isBase()) {
      return [+`${this.a}`.includes("."), 0]
    }

    let tl = [0, 0]
    if (this.a !== null) {
      const [o, t] = this.a.tierlist()
      tl[0] += o
      tl[1] += t
    }
    if (this.b !== null) {
      const [o, t] = this.b.tierlist()
      tl[0] += o
      tl[1] += t
    }
    tl[this.tier()]++;
    return tl
  }

  tier() {
    return {
      "+": 0,
      "-": 0,
      "*": 0,
      "/": 0,
      "^": 0,
      "!": 1,
      "√": 1,
    }[this.op]
  }

  precedence() {
    return {
      "+": 1,
      "-": 1,
      "*": 2,
      "/": 2,
      "^": 3,
      "!": 4,
      "√": 3,
    }[this.op]
  }

  valueOf() {
    if (this.isBase()) return this.a;
    if (this.op === "√") {
      if (this.a === null) return this.b ** 0.5;
      return this.b ** (1 / this.a)
    }
    if (this.op === "!") {
      return factorial(+this.a)
    }
    if (this.op === "+") {
      return +this.a + +this.b
    }
    if (this.op === "^") {
      return this.a ** this.b
    }
    if (this.op === "-") {
      return this.a - this.b
    }
    if (this.op === "*") {
      return this.a * this.b
    }
    if (this.op === "/") {
      return this.a / this.b
    }
  }

  toString() {
    if (this.isBase()) {
      const s = `${this.a}`
      return s.startsWith('0') ? s.slice(1) : s
    }
    if (this.op === "√") {
      const aPart = this.a === null ? "" : `{${this.a}}`
      const bParen = this.b.precedence() < this.precedence()
      const bPart = bParen ? `(${this.b})` : `${this.b}`
      return `${aPart}√${bPart}`
    }

    const aParen = this.a.precedence() < this.precedence() ||
                   this.op === "^" && this.b.precedence() === this.precedence()
    const aPart = aParen ? `(${this.a})` : `${this.a}`

    if (this.op === "!") {
      return `${aPart}!`
    }
    
    if ("+-*/^".includes(this.op)) {
      const bParen = this.b.precedence() < this.precedence() ||
                     "-/".includes(this.op) && this.b.precedence() === this.precedence()
      const bPart = bParen ? `(${this.b})` : `${this.b}`
      return `${aPart}${this.op}${bPart}`
    }
  }
}

const factorial = n => gamma(n + 1)

function gamma(z) {
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  else {
    const g = 7;
    const C = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];

    z -= 1;

    let x = C[0];
    for (let i = 1; i < g + 2; i++)
      x += C[i] / (z + i);

    const t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, (z + 0.5)) * Math.exp(-t) * x;
  }
}





const base = [
  [],
  [5, .5],
  [55, 5.5, .55],
  [555, 55.5, 5.55, .555],
  [5555, 555.5, 55.55, 5.555, .5555],
  [55555]
].flatMap((a, i) => a.map(b => new Expr(b, null, null, i)))

const best = [null, {}, {}, {}, {}, {}]
let todo = new Set(base)

const calculateNextLayer = () => {
  let made = new Set()

  const tryAdd = expr => {
    if (expr.fives > 5) return;
    
    const v = +expr
    if (Math.abs(v) > 1_000_000) return;
    if (!Number.isInteger(v) && "!√".includes(expr.op)) return; // the space explodes too much

    if (v in best[expr.fives]) {
      if (best[expr.fives][v].ponasuli(expr) > 0) {
        best[expr.fives][v].a = expr.a
        best[expr.fives][v].b = expr.b
        best[expr.fives][v].op = expr.op
        made.add(expr)
        if (Number.isInteger(v) && v >= 0 && v < 300 && expr.fives === 5) {
          console.log(v, `${expr}`, expr.fives, expr.tierlist(), expr)
        }
      }
    } else {
      best[expr.fives][v] = expr
      made.add(expr)
      if (Number.isInteger(v) && v >= 0 && v < 300 && expr.fives === 5) {
        console.log(v, `${expr}`, expr.fives, expr.tierlist(), expr)
      }
    }
  }

  let j = 0
  for (const expr of todo) {
    if (expr.isBase()) tryAdd(expr);
    for (let i = 1; i <= 4; i++) {
       for (const ponai in best[i]) {
          const pona = best[i][ponai]
          tryAdd(Expr.create(expr, pona, "+"))
          tryAdd(Expr.create(pona, expr, "+"))
          tryAdd(Expr.create(expr, pona, "-"))
          tryAdd(Expr.create(pona, expr, "-"))
          tryAdd(Expr.create(expr, pona, "*"))
          tryAdd(Expr.create(pona, expr, "*"))
          tryAdd(Expr.create(expr, pona, "/"))
          tryAdd(Expr.create(pona, expr, "/"))
          tryAdd(Expr.create(expr, pona, "^"))
          tryAdd(Expr.create(pona, expr, "^"))
       }
    }
    tryAdd(new Expr(expr, null, "!", expr.fives))
    tryAdd(new Expr(null, expr, "√", expr.fives))
    j++
    if (j % 77 === 0) console.debug("progress", j);
  }
  todo = made
  console.info("layer done")
}

calculateNextLayer()
calculateNextLayer()
calculateNextLayer()
calculateNextLayer()
calculateNextLayer()
let s = ""
for (let i = 0; i < 300; i++) {
    s += `${i} (${best[5][i]?.tierlist?.()}) = ${best[5][i]}\n`
}
console.log(s)
