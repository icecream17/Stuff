/*******************************************************************************
   Copyright (c) Steven Nguyen 2021
   This file is part of the bot-rating-system repo
   Bot-rating-system is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.
   Bot-rating-system is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
   You should have received a copy of the GNU General Public License
   along with bot-rating-system.  If not, see <https://www.gnu.org/licenses/>.
*******************************************************************************/

/// This rating system uses a modified version of the glicko2 rating system.
/// It uses various optimizations depending on the deterministicness of the
/// players and the ruleset.

export const enum DtNess {
   /// Always does the same thing - Example: alphabetical
   DETERMINISTIC,
   /// Always uses the same algorithm - Example: random_mover
   RANDOM,
   /// Can change over time - Example: human
   CHANGE,
}

// Deeply const
export const Defaults = {
   glicko2ScaleFactor: 173.7178,
   ratingInterval: 400,
   ratingValue: 1500,
   ratingDeviation: 350,
} as const

/// ConstructorParameters but leave out the first param
type SubConstrParam<T extends abstract new (...args: any) => any> =
   T extends abstract new (...args: [any, ...infer R]) => any ? R : never

type Timestamp = ReturnType<typeof Date.now>
type RatingGroup = Game[]

/// Note the difference between Ruleset (chess) and Game (chess)
/// A game is like an instance of a ruleset
/// Though in this case you call Ruleset.Game
export class Ruleset {
   // Non constants - can change
   /// Settings for the current Ruleset
   public readonly ratingVolatility = 0.06
   public readonly systemTau = 0.2 // Constrains the change in players' volatilities over time
   public readonly convergenceTolerance = 0.000001

   public readonly ratingInterval = 1000 * 60 * 60 * 24
   public readonly firstIntervalTimestamp = new Date(
      new Date().toDateString()
   ).getTime()

   /// Ruleset data
   public games = new Set<Game>()
   public players = new Set<Player>()
   public ratingGroups = {
      /// Games between players whose DtNess is DETERMINISTIC
      deterministic: [] as RatingGroup,

      /// Games between players whose DtNess is _not_ CHANGE
      dtRandom: [] as RatingGroup,

      /// Contains all non-deterministic games in multiple groups
      nonDeterministic: new Map<Timestamp, RatingGroup>(),
   }

   constructor(
      /// DETERMINISTIC: the game always does the same thing given the same actions by players
      /// RANDOM: the game is always the same
      /// CHANGE: the game itself changes over time
      public dtness = DtNess.DETERMINISTIC,
      /// Does the order of the players matter?
      public orderMatters = true
   ) {}

   /// Creates a new game of the ruleset
   Game(...args: SubConstrParam<typeof Game>) {
      const game = new Game(this, ...args)
      this.games.add(game)
      return game
   }

   /// Creates a new player of the ruleset
   Player(...args: SubConstrParam<typeof Player>) {
      const player = new Player(this, ...args)
      this.players.add(player)
      return player
   }

   /// Creates a new bot of the ruleset
   Bot(...args: SubConstrParam<typeof Bot>) {
      const bot = new Bot(this, ...args)
      this.players.add(bot)
      return bot
   }

   /// Internal
   _updateGameFinished(game: Game) {
      /// First check if the results of the game are valid
      if (!Object.values(game.result).every(result => Number.isFinite())) {
         return "Fail: A result was NaN, Infinity, or -Infinity"
      }

      if (game.isDeterministic()) {
         if (this._updateDeterministicGameFinished(game) === "duplicate") {
            return "Noop: Deterministic game already happened"
         }
      } else if (game.isDtnessRandom()) {
         this.ratingGroups.dtRandom.push(game)
      } else {
         this._updateChangeGameFinished(game)
      }
      this.recalculateRatings()
   }

   /// Internal
   _updateDeterministicGameFinished(game: Game) {
      outerloop:
      for (const other of this.ratingGroups.deterministic) {
         if (other.players.length !== game.players.length) {
            continue
         }
         if (this.orderMatters) {
            if (other.players.every((player, index) => game.players[index] === player)) {
               if (other.players.every(player => other.result![player.id] === game.result![player.id])) {
                  return "duplicate"
               } else {
                  const err = TypeError("Two deterministic games should have the same result")
                  console.error(err, game, other, this)
                  throw err
               }
            }
         } else {
            const p1 = game.players.map(player => player.id).sort()
            const p2 = other.players.map(player => player.id).sort()

            // Remove equal players in p2
            for (const id1 of p1) {
               const equal = p2.findIndex(id2 => id1 === id2)
               if (equal === -1) {
                  continue outerloop;
               }
               if (game.result![id1] === game.result![equal]) {
                  p2.splice(equal, 1)
               } else {
                  const err = TypeError("Two deterministic games should have the same result")
                  console.error(err, game, other, this)
                  throw err
               }
            }

            if (p2.length === 0) {
               return "duplicate"
            }
         }
      }
      this.ratingGroups.deterministic.push(game)
      return "not duplicate"
   }

   _updateChangeGameFinished(game: Game) {
      const timestamp = game.timestamp
      if (timestamp < this.firstIntervalTimestamp) {
         throw TypeError("The game was before the first rating period")
      }

      const ratingGroupTheGameIsIn =
         (timestamp - this.firstIntervalTimestamp) -
         (timestamp - this.firstIntervalTimestamp) % this.ratingInterval +
         this.firstIntervalTimestamp

      const current = this.ratingGroups.nonDeterministic.get(ratingGroupTheGameIsIn)
      if (current === undefined) {
         this.ratingGroups.nonDeterministic.set(lastRgTimestamp, [game])
      } else {
         current.push(game)
      }
   }

   recalculateRatings() {
      this.players.forEach(player => player.rating.reset())
      updatePlayerRatings(this, calculateResultFromRatingGroup(
         this.ratingGroups.deterministic.concat(this.ratingGroups.dtRandom)
      ), false)
      const rI = [...this.ratingGroups.nonDeterministic.entries()].sort((a, b) => a[0] - b[0])
      for (let currI = this.firstIntervalTimestamp; rI.length;) {
         if (currI === rI[0][0]) {
            updatePlayerRatings(this, calculateResultFromRatingGroup(rI.shift()![1]))
         } else {
            updatePlayerRatings(this, {})
         }
      }
   }
}

// Record<ID, Record<OpponentID, Relative score>>
function calculateResultFromRatingGroup(rg: RatingGroup): Record<ID, Result> {
   const r: Record<ID, Record<ID, number[]>> = {}
   for (const {result} of rg) {
      if (result !== null) {
         for (const id in result) {
            for (const id2 in result) {
               if (id !== id2) {
                  r[id] ??= {}
                  r[id][id2] ??= []

                  // rel  0.2 0.3 0.5
                  // 0.2   =  2/5 2/7
                  // 0.3  2/5  =  3/8
                  // 0.5  5/7 5/8  =
                  r[id][id2].push(result[id] / (result[id] + result[id2]))
               }
            }
         }
      }
   }
   const rr: Record<ID, Result> = {}
   for (const id in r) {
      rr[id] = {}
      for (const opp in r[id]) {
         rr[id][opp] = __avg(r[id][opp])
      }
   }
   return rr
}

export type ID = Readonly<number | string>
export type Result = Record<ID, number>
export type PlayerMap = Result
export type GameParticipants = Readonly<[Player, Player, ...Player[]]> // Array because maybe the order matters

/// Score != Result
///
/// For example if PlayerA, PlayerA, and PlayerB get scores `[2, 3, 4]`
/// then the result is `{ [PlayerA.id]: 2.5 / 6.5, [PlayerB.id]: 4 / 6.5 }`
export type Scores =
   | [number, number, ...number[]]
   | readonly [number, number, ...number[]]

function convertScoresToResult(
   players: GameParticipants,
   scores: Scores
): Result {

   const playerScores = {} as Record<ID, [number, ...number[]]>

   // bug?: scores = [-1, 5] --> [-1/4, 5/4]
   const sum = __sum(scores)
   for (const [index, score] of scores.entries()) {
      // Prevent NaN from 0 / 0, but don't protect from Infinity, -Infinity, or NaN
      const scoreAsPercentOfTotal = score === 0 ? 0 : score / sum
      if (players[index].id in playerScores) {
         playerScores[players[index].id].push(scoreAsPercentOfTotal)
      } else {
         playerScores[players[index].id] = [scoreAsPercentOfTotal]
      }
   }

   const results = {} as Result
   for (const id in playerScores) {
      results[id] = __avg(playerScores[id])
   }
   return results
}

export class Game {
   startTime: number | null
   finishTime: number | null
   scores: Scores | null
   result: Result | null

   constructor(
      public readonly ruleset: Ruleset,
      public readonly players: GameParticipants,
      startImmediately: boolean = false
   ) {
      this.startTime = startImmediately ? Date.now() : null
      this.finishTime = null
      this.scores = null
      this.result = null

      for (const player of players) {
         if (player.ruleset !== ruleset) {
            console.error({ player, ruleset })
            throw new TypeError(
               "The player's ruleset is different from this game's ruleset"
            )
         }
         if (!player.games.includes(this)) {
            player.games.push(this)
         }
      }
   }

   start(): number {
      if (this.startTime !== null) {
         throw ReferenceError("Game already started")
      }

      return (this.startTime = Date.now()) // intentional return-assign
   }

   finish(scores: Scores): number {
      if (this.finishTime === null) {
         this.finishTime = Date.now()
      } else {
         throw ReferenceError("Game already finished")
      }
      if (scores.length !== this.players.length) {
         throw TypeError(`Scores must correspond to players, expected ${this.players.length} score(s) but got ${scores.length}`)
      }

      this.scores = scores
      this.result = convertScoresToResult(this.players, scores)
      this.ruleset._updateGameFinished(this)
      return this.finishTime
   }

   isDeterministic() {
      return (
         this.ruleset.dtness === DtNess.DETERMINISTIC &&
         this.players.every((player) => player.isDeterministic())
      )
   }

   isDtnessRandom() {
      return (
         this.ruleset.dtness !== DtNess.CHANGE &&
         this.players.every((player) => player.dtness !== DtNess.CHANGE)
      )
   }

   /// Custom timestamp criteria
   get timestamp(): Timestamp {
      if (this.startTime === null || this.finishTime === null) {
         throw new TypeError("Game not finished!!!")
      }
      return (this.startTime + this.finishTime) / 2
   }
}

// TODO: The order of the players don't matter, but the player acts differently based on the order.
export class Player {
   static nextID = 0

   /// Arbitrary unique player hash for rating calculation
   id: ID

   /// Games past or present
   games: Game[]

   rating: Glicko2Rating

   constructor(public ruleset: Ruleset, public dtness = DtNess.CHANGE) {
      this.id = Player.nextID++
      this.games = []
      this.rating = new Glicko2Rating(this)
   }

   isDeterministic() {
      return this.dtness === DtNess.DETERMINISTIC
   }
}

export class Bot extends Player {
   #version: Version
   constructor(
      ruleset: Ruleset,
      dtness: DtNess,
      version?: Version | null,
      public versions: Map<Version, Player> = new Map()
   ) {
      super(ruleset, dtness)
      this.#version = version ?? new Version(0, 1, 0)
      if (!this.versions.has(this.#version)) {
         this.versions.set(this.#version, this)
      }
   }

   get version() {
      return this.#version
   }

   newVersion(version: Version) {
      return this.ruleset.Bot(this.dtness, version, this.versions)
   }
}

export class Glicko2Rating {
   public deviation: number = Defaults.ratingDeviation
   public value: number = Defaults.ratingValue
   public volatility: number
   constructor(public player: Player) {
      this.volatility = player.ruleset.ratingVolatility
   }

   /** Resets the rating */
   reset() {
      this.value = Defaults.ratingValue
      this.deviation = Defaults.ratingDeviation
      this.volatility = this.player.ruleset.ratingVolatility
   }
}

export type VersionStr =
   | `${number}.${number}.${number}`
   | `${number}.${number}.${number}+${string}`
   | `${number}.${number}.${number}-${string}`
   | `${number}.${number}.${number}+${string}-${string}`
function comparePrerelease(thi: string[], vv: string[]) {
   for (const [index, id] of thi.entries()) {
      if (id === vv[index]) {
         continue
      }
      if (/[0-9]+/.test(id)) {
         if (/[0-9]+/.test(vv[index])) {
            return Number(id) < Number(vv[index])
         }
         return true
      } else if (/[0-9]+/.test(vv[index])) {
         return false
      }
      return id < vv[index]
   }
   return thi.length < vv.length
}
/**
 * SemVer implementation
 *
 * If you provide an incomplaint semver string, such as "1/2",
 * then all functionality is UB (undefined behavior)
 */
export class Version {
   major: number
   minor: number
   patch: number
   /// May be indicated by appending a hyphen followed by dot separated identifiers
   prerelease: string | null
   /// May be indicated by appending a plus sign followed by dot separated identifiers
   metadata: string | null
   constructor(
      major: number,
      minor: number,
      patch: number,
      prerelease?: string | null,
      metadata?: string | null
   ) {
      if (!Number.isInteger(major)) {
         throw RangeError(
            `major version part given (${major}) is not an integer`
         )
      }
      if (!Number.isInteger(minor)) {
         throw RangeError(
            `minor version part given (${minor}) is not an integer`
         )
      }
      if (!Number.isInteger(patch)) {
         throw RangeError(
            `patch version part given (${patch}) is not an integer`
         )
      }
      if (major < 0) {
         throw RangeError(
            `major version part given (${major}) is less than zero`
         )
      }
      if (minor < 0) {
         throw RangeError(
            `minor version part given (${minor}) is less than zero`
         )
      }
      if (patch < 0) {
         throw RangeError(
            `patch version part given (${patch}) is less than zero`
         )
      }
      this.major = major
      this.minor = minor
      this.patch = patch
      this.prerelease = prerelease ?? null
      this.metadata = metadata ?? null
   }
   // Less than
   lt(v: Version): string {
      return (
         this.major === v.major
            ? this.minor === v.minor
               ? this.patch === v.patch
                  ? this.prelease === null || this.prerelease === v.prerelease
                     ? false
                     : v.prelease === null
                        ? true
                        : comparePrerelease(this.prerelease.split('.'), v.prerelease.split('.'))
                  : this.patch < v.patch
               : this.minor < v.minor
            : this.major < v.major
      )
   }
   // Equal to
   eq(v: Version) {
      return this.toString() === v.toString()
   }
   // Greater than
   gt(v: Version) {
      return v.lt(this)
   }
   toString(): VersionStr {
      let string: VersionStr =
         `${this.major}.${this.minor}.${this.patch}` as const
      if (this.prerelease !== null) {
         string = `${string}+${this.prerelease}` as const
      }
      if (this.metadata !== null) {
         string = `${string}-${this.metadata}` as const
      }
      return string
   }
}

function iteratorEvery<T>(
   iterable: Iterable<T>,
   callback: (val: T) => boolean
) {
   for (const value of iterable) {
      if (!callback(value)) {
         return false
      }
   }
   return true
}

// http://www.glicko.net/glicko/glicko2.pdf
function updatePlayerRatings(
   ruleset: Ruleset,
   result: Record<ID, Result>,
   updateNonInvolvedPlayers = true
): void {
   const players = updateNonInvolvedPlayers
      ? [...ruleset.players].filter(player => player.id in result)
      : ruleset.players

   // Use Glicko-2 for now
   // Step 1: Initialize all player rating stats (done)

   // Step 2: Convert ratings and RD's onto the Glicko-2 scale
   // + optimization: Calculate g(φ) beforehand
   const μ = {} as Record<ID, number>
   const φ = {} as Record<ID, number>
   const gφ = {} as Record<ID, number>
   for (const player of players) {
      μ[player.id] =
         (player.rating.value - Defaults.ratingValue) / Defaults.glicko2ScaleFactor
      φ[player.id] = player.rating.deviation / Defaults.glicko2ScaleFactor
      gφ[player.id] = _g(φ[player.id])
   }

   for (const player of players) {
      // Setup variables
      const playerμ = μ[player.id]
      const playerφ = φ[player.id]
      const playerσ = player.rating.volatility

      // If no games do Step 6
      const opponentIDs = player.id in result ? Object.keys(result[player.id]) : [] as ID[]
      if (opponentIDs.length === 0) {
         const pre_playerφ = Math.sqrt(__squared(playerφ) + __squared(playerσ))
         const new_playerφ = pre_playerφ
         const new_playerRD = Defaults.glicko2ScaleFactor * new_playerφ
         player.rating.deviation = new_playerRD
         continue;
      }

      // Step 2 continued: Let s be the scores against each opponent
      const relativeScores = result[player.id]

      // Step 3
      // Estimated variance + Eparts optimization
      const [v, Eparts] = _v(μ, gφ, playerμ, opponentIDs)

      // Step 4:
      const sigmaOptimization = opponentIDs.reduce((total: number, id: ID) => total + gφ[id] * (relativeScores[id] - Eparts[id]), 0)
      const delta = v * sigmaOptimization // Because of optimization this is only used once

      // First some _f_optimization
      const playerφSquared = __squared(playerφ)
      const deltaSquared = __squared(delta)
      const systemTauSquared = __squared(ruleset.systemTau)

      // Step 5.1:
      const a = 2 * Math.log(playerφ) // Optimization: ln(φ²) = 2ln(φ)
      const _f_opt = _make_f_opt(deltaSquared, playerφSquared, v, a, systemTauSquared)

      // Step 5.2:
      let A: number = a
      let B: number

      // console.debug(playerφ, a, _f_opt(a - ruleset.systemTau))

      const φφPlusV = playerφSquared + v
      if (deltaSquared > φφPlusV) {
         B = Math.log(deltaSquared - φφPlusV)
      } else {
         let k = 1
         while (_f_opt(a - (k * ruleset.systemTau)) < 0) {
            k++
         }

         B = a - (k * ruleset.systemTau)
      }

      // Step 5.3
      let fA = _f_opt(A)
      let fB = _f_opt(B)

      // Step 5.4
      while (Math.abs(B - A) > ruleset.convergenceTolerance) {
         // 5.4a
         const C = A + ((A - B) * fA) / (fB - fA)
         const fC = _f_opt(C)

         // 5.4b
         if (fC * fB < 0) {
            A = B
            fA = fB
         } else {
            fA = fA / 2
         }

         // 5.4c
         B = C
         fB = fC
      }

      // Step 5.5
      const new_playerσ = Math.E ** (A / 2)

      // Step 6
      const pre_playerφ = Math.sqrt(playerφSquared + __squared(new_playerσ))

      // Step 7
      const new_playerφ = 1 / Math.sqrt(1 / __squared(pre_playerφ) + 1 / v)
      const new_playerμ = playerμ + __squared(new_playerφ) * sigmaOptimization

      // Step 8
      const new_playerRating =
         Defaults.glicko2ScaleFactor * new_playerμ + Defaults.ratingValue
      const new_playerRD = Defaults.glicko2ScaleFactor * new_playerφ

      player.rating.value = new_playerRating
      player.rating.deviation = new_playerRD
      player.rating.volatility = new_playerσ
   }
}

/// Estimated variance of a rating based on game outcomes and opponent stats
/// Returns [variance result, EpartsOptimization]
function _v(
   μ: PlayerMap,
   gφ: PlayerMap,
   playerμ: number,
   opponentIDs: Iterable<ID>
): [number, Record<ID, number>] {
   // [Σ g(opponent φ)² * E(player μ, opponent μ, opponent φ) * (1 - E(player μ, opponent μ, opponent φ))] ^ -1
   // 1 / [Σ gφ² * Epart * (1 - Epart)]

   let total = 0
   const Eparts = {} as Record<ID, number>

   for (const id of opponentIDs) {
      const Epart = _E_optimization(playerμ, μ[id], gφ[id])
      total += gφ[id] * gφ[id] * Epart * (1 - Epart)
      Eparts[id] = Epart
   }

   return [1 / total, Eparts]
}

/* Unused */
function _gSquared(φ: number) {
   // g(φ) = 1 / sqrt(stuff)
   // g(φ)² = 1 / stuff
   return 1 / (1 + 3 * __squared(φ / Math.PI))
}

function _g(φ: number) {
   // Optimization: φ²/π² === (φ/π)²
   return 1 / Math.sqrt(1 + 3 * __squared(φ / Math.PI))
}

/* Unused */
function _E(μ: number, μj: number, φj: number) {
   return 1 / (1 + Math.exp(-1 * _g(φj) * (μ - μj)))
}

function _E_optimization(μ: number, μj: number, gφj: number) {
   return 1 / (1 + Math.exp(-1 * gφj * (μ - μj)))
}

function _make_f_opt(
   deltaSquared: number,
   playerφSquared: number,
   v: number,
   a: number,
   systemTauSquared: number
) {
   return (x: number) => _f_optimization(x, deltaSquared, playerφSquared, v, a, systemTauSquared)
}

function _f_optimization(
   x: number,
   deltaSquared: number,
   playerφSquared: number,
   v: number,
   a: number,
   systemTauSquared: number
) {
   const e2TheX = Math.E ** x
   const tempPart = playerφSquared + v + e2TheX
   return (
      (e2TheX * (deltaSquared - tempPart)) / (2 * __squared(tempPart)) -
      (x - a) / systemTauSquared
   )
}

/* Unused */
function _f(
   x: number,
   delta: number,
   playerφ: number,
   v: number,
   a: number,
   systemTau: number
) {
   const e2TheX = Math.E ** x
   const tempPart = __squared(playerφ) + v + e2TheX
   return (
      (e2TheX * (__squared(delta) - tempPart)) / (2 * __squared(tempPart)) -
      (x - a) / __squared(systemTau)
   )
}

function __squared(n: number) {
   return n * n
}

function __sum(a: number[] | readonly number[]) {
   return a.reduce((b, c) => b + c)
}

function __avg(a: number[] | readonly number[]) {
   return __sum(a) / a.length
}
