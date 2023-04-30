//! "Common" patterns in javascript
//!
//! usage of this code is "completely outside of the law",
//! in that no one can get sued no matter what,
//! regarding usage or distribution of this file,
//! to the furthest extent possible by law

/// Clock (definitely went overboard here)
if (typeof globalThis.setInterval === "function" && typeof globalThis.clearInterval === "function") {
    class Clock {
        // [delay, task]
        #tasks = []
        #tickSpeed
        #intervalId = null
        #paused = false
        #totalTicks = 0
        #sectionTicks = 0
        /// Note that msPerTick is a minimum tick length, not a maximum
        /// Tasks are theoretically done in chronological order; if you don't want one task to block others,
        /// use async tasks.
        constructor (msPerTick) {
            this.setMsPerTick(msPerTick)
        }

        setMsPerTick (msPerTick = 77) {
            if (!Number.isFinite(msPerTick)) {
                throw TypeError("Expected msPerTick to be a finite number");
            }
            if (msPerTick <= 0) {
                throw RangeError(`Expected msPerTick to be a positive number, got ${msPerTick}`);
            }
            if (this.#intervalId != null) {
                this.stop()
                this.start(msPerTick)
                return "Warning: Changing tick speed while the clock is running\n" +
                       "can cause the browser to throttle the setTimeout calls"
            } else {
                this.#tickSpeed = msPerTick
            }
        }

        addTask (taskCallback, ticksToDelay) {
            if (!Number.isFinite(ticksToDelay)) {
                throw TypeError("Expected a finite number of ticks")
            }

            // Maintain a sorted list from longest delay to shortest; this algorithm is inefficient but whatever
            this.#tasks.splice(this.#tasks.findLastIndex(task => task[0] >= ticksToDelay) + 1, 0, [ticksToDelay, taskCallback])
        }
    
        processTick () {
            if (this.#intervalId !== null && !this.#paused) {
                this.#totalTicks++
                this.#sectionTicks++
                for (const task of this.#tasks) {
                    task[0]--
                }
                while (this.#tasks.length && this.#tasks[this.#tasks.length - 1][0] <= 0) {
                    this.#tasks.pop()()
                }
            }
        }
        
        /**
         * Overrides msPerTick, if starting a new section
         * @returns {"clock already started!" | true}
         */
        start (msPerTick) {
            if (this.#intervalId !== null) {
                return "clock already started!"
            }
            
            if (msPerTick != null) {
                this.setMsPerTick(msPerTick)
            }
            
            this.#intervalId = setInterval(this.processTick, this.#tickSpeed)
            this.#paused = false
            this.#sectionTicks = 0
        }
    
        stop () {
            if (this.#intervalId === null) {
                return "clock already stopped!"
            }
            
            clearInterval(this.#intervalId)
            this.#intervalId = null
            this.#paused = false
        }
    
        pause () {
            this.#paused = true
        }
    
        unpause () {
            this.#paused = false
        }
    }
}
