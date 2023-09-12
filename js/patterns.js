//! "Common" patterns in javascript
//!
//! usage of this code is "completely outside of the law",
//! in that no one can get sued no matter what,
//! regarding usage or distribution of this file,
//! to the furthest extent possible by law

/// Clock (definitely went overboard here)
if (typeof globalThis.setInterval === "function" && typeof globalThis.clearInterval === "function") {
    /// Creates a clock based on `setInterval`, which ticks however many given milliseconds plus event loop delay
    /// plus browser/host throttling.
    ///
    /// There is no built-in way to do
    /// ```
    /// some code
    /// don't do anything for x time
    /// more code
    /// ```
    ///
    /// in ECMAScript.
    ///
    /// However, most hosts provide the functions `setTimeout` and `setInterval`, which as mentioned does a function
    /// after _x_ milliseconds (plus event loop delay and browser/host throttling).
    ///
    /// Event loop delay occurs when the browser/host is busy doing some other task,
    /// (all synchronous tasks in the execution stack as well as any microtasks from `queueMicrotask`).
    /// Throttling can come in the form of a minimum (i.e. 0 ms becomes 1 ms), or slowdowns when a tab is deemed inactive.
    /// These delays are generally unavoidable.
    ///
    /// Another case of throttling is when nesting 4 levels of setInterval, this generally causes a 4ms minimum.
    /// Using this class could help with this particular issue, if for some reason you are calling `setTimeout` inside
    /// a function given to `setTimeout`. This provides a global unified interface for using `setInterval` instead.
    ///
    /// For purposes of rendering, it is recommended to use `requestAnimationFrame` instead.
    class Clock {
        // [delay, task]
        #tasks = []
        #tickSpeed
        #intervalId = null
        #paused = false
        #totalTicks = 0
        #sectionTicks = 0
        #sectionStartTime = 0
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
                for (let i = 0; i < this.#tasks.length; i++) {
                    if (--this.#tasks[i][0] <= 0) {
                        for (let j = i; j < this.#tasks.length; j++) {
                            this.#tasks[j]()
                        }
                        this.#tasks.length = i
                        break
                    }
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

            this.#intervalId = setInterval(this.processTick.bind(this), this.#tickSpeed)
            this.#paused = false
            this.#sectionTicks = 0
            this.#sectionStartTime = 0
        }

        /// If you are stopping and starting with the same tick speed,
        /// use `pause` and `unpause` instead!
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
