/* Creates new elements for you
 * 1. Create a new save. (optional)
 *    There's also a handy function:

     createNewSave()

 * 2. (ctrl+shift+i opens the console in my browser)
      Copy and paste all of this code in the console.
 *
 *    Note: generally copying and pasting code is dangerous.
 *          For example, _you_ can access your password... and code has the ability to click...
 *
 * 3. Anyways, after that, type _one_ of the following:

     step()
     stepForever()

 */

// You can change this! However if the number is too low (say, 0ms), the browser just replaces it with a minimum.
let delay = 10 // milliseconds

function getElements () {
   return Array.from(document.querySelectorAll('#element-game-root .elem'))
}

function getNewElements () {
   return getElements().filter(element => !seen.has(element))
}

function click (something) {
   let clickEvent = new MouseEvent('click')
   something.dispatchEvent(clickEvent)
}

function slowDown () {
   return new Promise(finish => 
      setTimeout(finish, delay)
   )
}

async function tryCombination (elem1, elem2) {
   await slowDown()

   // Unselect any elements
   click(document.body)

   // Then click elem1 and elem2
   click(elem1)
   click(elem2)
}

async function closeSuggestionBoxIfAny () {
   const suggestionClose = document.querySelector('#suggest .suggest-close')
   if (suggestionClose !== null) {
      await slowDown()
      click(suggestionClose)
   }
}

let seen = new Set(getElements())
let tiers = [getElements()]
let currentStep = [0, 0] // tier 0 vs tier 0

async function step () {
   console.log(`"Tier" ${currentStep[0]} vs ${currentStep[1]}
                ${tiers[currentStep[0]].length * tiers[currentStep[1]].length} combinations`)

   for (const element1 of tiers[currentStep[0]]) {
      for (const element2 of tiers[currentStep[1]]) {
         await tryCombination(element1, element2)
         await closeSuggestionBoxIfAny()
      }
   }

   // Update current step
   // Does combos like this:
      /*
       * 0 0
       * 0 1
       * 1 1
       * 0 2
       * 1 2
       * 2 2
       * 0 3
       * 1 3
       * 2 3
       * 3 3
       * 0 4
       * etc
       */
   if (currentStep[0] === currentStep[1]) {
      currentStep = [0, currentStep[1] + 1]
   } else {
      currentStep[0]++
   }

   let newElements = getNewElements()
   for (const element of newElements) {
      seen.add(element)
   }

   tiers.push(newElements)
   return `Created ${newElements.length} new elements`
}

async function stepForever () {
   while (true) {
      let stepResult = await step()
      console.log(stepResult)
   }
}

function lastOf (something) {
   return something[something.length - 1]
}

async function createNewSave () {
   delay = 1000

   // Click menu
   click(document.querySelector('.top-bar > .top-bar-button'))
   await slowDown()
  
   // Click 3rd option (index 2; computers count from 0)
   click(document.querySelector('.settings-categories').children[2])
   await slowDown()
  
   // Create new file
     // 1. Change option to "create"
   document.getElementById('modify-savefile').selectedIndex =
     [].indexOf.call(
        document.getElementById('modify-savefile').children,
        document.getElementById('modify-savefile-create')
     )
   document.getElementById('modify-savefile').dispatchEvent(new Event('change'))
   await slowDown()
  
     // 2. Change name, click "Ok" or something
   document.querySelector('.dialog-form input').value += ': brute force!!!'
   click(document.querySelector('.dialog-buttons').children[0])
   await slowDown()
  

   // Then change file to new file just created
   document.getElementById('change-savefile').selectedIndex = document.getElementById('change-savefile').options.length - 1
   document.getElementById('change-savefile').dispatchEvent(new Event('change'))
   await slowDown()
  
   // Exit the menu
   click(lastOf(document.querySelector('.settings-categories').children))

   delay = 10
}
