# eslint-bugs

I'm too lazy to write a report for all my bugs.

So here's the simplified versions of all of these

### no-useless-constructor

```ts
export class CellID {
   constructor (public row: IndexToNine, public column: IndexToNine) {}

   *[Symbol.iterator]() {
      yield this.row
      yield this.column
   }
}
```

### padded-blocks

```ts
export default function updateCandidates(sudoku: PureSudoku, _solver: Solver) {
   let updated = 0

   for (const i of INDICES_TO_NINE) {
      for (const j of INDICES_TO_NINE) {
         // Cell
         if (sudoku.data[i][j].length === 1) { /////////////////////// This block is "padded"

            // Cell > Candidate
            const solvedCandidate = sudoku.data[i][j][0]

            // Cell > Affects
            for (const {row, column} of affects(i, j)) { ///////////////////// This block is also padded

               // Cell > Affects > Cell
               const datacell = sudoku.data[row][column]
               const tempIndex = datacell.indexOf(solvedCandidate)

               // If has candidate
               if (tempIndex !== -1) {
                  // If last candidate of that cell
                  if (datacell.length === 1) {
                     return {
                        success: false,
                        successcount: SuccessError,
                        message: `Both ${algebraic(i, j)} and ${algebraic(row, column)} must be ${solvedCandidate}`
                     }
                  }

                  updated++
                  datacell.splice(tempIndex, 1) // Deletes the candidate
                  sudoku.set(row, column).to(...datacell) // Updates/renders the cell too
               }
            }
         }
      }
   }
```
