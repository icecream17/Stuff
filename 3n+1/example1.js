let testNumber = BigInt(293) // Whatever number you want to try
let stepNumber = 1n
let intervalID = setInterval(() => {
   if (testNumber === 1n) clearInterval(intervalID)
   document.body.innerText += `\n${stepNumber++}:\xa0${testNumber}`
   if (testNumber % 2n === 0n) testNumber /= 2n
   else testNumber = 3n*testNumber + 1n
}, 10)
