
try {
   document
} catch (error) {
   throw new ReferenceError("This probably isn't setup correctly", error)
}

// ~~~ Normalize html ~~~
// Remove all html
for (const child of document.children) {
   child.remove()
}

// Add <!DOCTYPE html>
document.appendChild(
   document.implementation.createDocumentType('html', '', ''))

// Add <html></html>
const htmlElement = document.createElement('html')
document.appendChild(htmlElement)

console.assert(document.documentElement === htmlElement, "???")

// Add <head></head>
htmlElement.appendChild(document.createElement('head'))

// Add <body></body>
htmlElement.appendChild(document.createElement('body'))
