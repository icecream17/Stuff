# My preferences for style

There isn't really any rules here.

```ts
export class CellID {
   constructor (public row: IndexToNine, public column: IndexToNine) {}

   *[Symbol.iterator]() {
      yield this.row
      yield this.column
   }
}


// ... later ...


export const boxRow = [0, 0, 0, 3, 3, 3, 6, 6, 6] as const
export const boxColumn = [0, 0, 0, 1, 1, 1, 2, 2, 2] as const
export function boxAt (row: IndexToNine, column: IndexToNine): IndexToNine {
   // + │ 0 1 2
   // ──┼──────
   // 0 │ 0 1 2
   // 3 │ 3 4 5
   // 6 │ 6 7 8
   return boxRow[row] + boxColumn[column] as IndexToNine
}


// My thoughts
// Using spaces is often not inherently better than not using spaces
//    Spaces look better in more expressive code
//    No spaces look better in more concise code

export function to9by9<T>(thing: T[]): [T[], T[], T[], T[], T[], T[], T[], T[], T[]]
export function to9by9(thing: string): [string, string, string, string, string, string, string, string, string]
export function to9by9<T>(thing: T[] | string) {
   return [
      thing.slice(0, 9),
      thing.slice(9, 18),
      thing.slice(18, 27),
      thing.slice(27, 36),
      thing.slice(36, 45),
      thing.slice(45, 54),
      thing.slice(54, 63),
      thing.slice(63, 72),
      thing.slice(72),
   ] as const
}

// The space after a function name is of zero importance, it exists, or maybe not.
/**
 * Takes a box and the index of a cell in that box
 *
 * Then returns the position (CellID) of the cell (in the whole sudoku)
 */
export function getIDFromIndexWithinBox(indexOfBox: IndexToNine, indexInBox: IndexToNine) {
   const [boxRow, boxColumn] = indexTo3x3[indexOfBox]
   const [withinRow, withinColumn] = indexTo3x3[indexInBox]
   return id(boxRow * 3 + withinRow as IndexToNine, boxColumn * 3 + withinColumn as IndexToNine)
}
```

```ts
"" === ''
"string one"           'string one'
"string two"    ===    'string two'
"string three"         'string three'


// Same effort, looks about the same, templates win by default, unless you think the emphasis of the string is really important
" " + char === ` ${char}`
"cat" + id === `cat${id}`
"cat" + this.props.name.replaceAll(' ', '-') === `cat${this.props.name.replaceAll(' ', '-')}`

// Less effort (this always looks better)
"cat" + id + "dog" < `cat${id}dog`

// Looks better
"strategy-" + name < `strategy-${name}`
"ID: " + id < `ID: ${id}`
```

```ts
// Alignment is nice
export function boxNameAt(row: IndexToNine, column: IndexToNine): BoxName {
   return BOX_NAMES[boxAt(row, column)]
}

// This function actually doesn't align with the other ones though...

export const boxRow = [0, 0, 0, 3, 3, 3, 6, 6, 6] as const
export const boxColumn = [0, 0, 0, 1, 1, 1, 2, 2, 2] as const
export function boxAt (row: IndexToNine, column: IndexToNine): IndexToNine {
   // + │ 0 1 2
   // ──┼──────
   // 0 │ 0 1 2
   // 3 │ 3 4 5
   // 6 │ 6 7 8
   return boxRow[row] + boxColumn[column] as IndexToNine
}

export function boxNameAt(row: IndexToNine, column: IndexToNine): BoxName {
   return BOX_NAMES[boxAt(row, column)]
}

const _affectsCache = new Map<IndexTo81, CellID[]>()

/**
 * All cells a square affects, or
 * All cells that affect a square
 */
export function affects (row: IndexToNine, column: IndexToNine) {
   const thisIndex = indexOf(row, column)
   const results = [] as IndexTo81[] // I could optimize, but it's here for simplicity

   if (_affectsCache.has(thisIndex)) {
      // Seems like another typescript bug
      return _affectsCache.get(thisIndex) as CellID[]
   }

```

