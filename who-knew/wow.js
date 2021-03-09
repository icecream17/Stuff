// test-262, built-ins, Array, 15.4.5.1-5-1.js
let array = []
array[2**32 - 1] = "Not an array element"
console.log(array)
console.log(array.length) // 0
