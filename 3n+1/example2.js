class CollatzBranch {
   constructor (n) {
      this.id = n;
      if (n % 2 === 0) {
         this.possibleNext = [n/2, (n+6)/2]
      } else {
         this.possibleNext = [(3*n+1)%6]
      }
   }

   nextBranch (evenness) {
      if (evenness === 1) return this.possibleNext[1]
      else return this.possibleNext[0]
   }
}

let CNsDB = [] // Database of collatz numbers
class CollatzNumber {
   constructor (number) {
      this.value = number;
      if (CNsDB[number]) return CNsDB[number]
      else CNsDB[number] = this;
   }

   static branches = [
      new CollatzBranch(0),
      new CollatzBranch(1),
      new CollatzBranch(2),
      new CollatzBranch(3),
      new CollatzBranch(4),
      new CollatzBranch(5)
   ];
   get branch() {
      return CollatzNumber.branches[this.value % 6];
   }

   get nextBranch() {
      return this.branch.nextBranch(this.evenness);
   }

   get evenness() {
      let evenness = 0; let val = this.value;
      for (; val % 2 === 0; val /= 2) evenness++;
      return evenness;
   }

   get possibleFrom () {
      let possible = [new CollatzNumber(this.value * 2)]
      if (this.branch.id === 4) possible.push(
         new CollatzNumber((this.value - 1) / 3)
     )
     return possible;
  }
}

let currentCN = new CollatzNumber(1)
let CNs = [currentCN]
while (CNs.length < 100) {
   let possCNs = CNs[CNs.length - 1].possibleFrom
   let randomCN = possCNs[Math.floor(Math.random() * possCNs.length)]
   CNs.push(randomCN)
}

console.log(CNs)
