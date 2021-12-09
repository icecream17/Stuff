# webpack can't minify lol

I've noticed that I've changed nothing yet the new webpack increases the amount of text in the supposedly "minified" bundle.
So let's look at it part by part and see what can be minified.

When first looking at this, most viewers see this and assume that webpack did a pretty good job:

```js
/*! For license information please see main.b03ff304.js.LICENSE.txt */
AlotOfCode]4[tr[gpk][34ti43ctw3t34y][porwwk354t4orewpgowj5y[pije[ps4j90gjspg[o[5ph5w]phoj5s[0h5r'5ohkthw45h[w0h]po53j4]3otgjes]43poj
//# sourceMappingURL=main.b03ff304.js.map
```

However, using automatic semicolon insertion, semicolons can be replaced by newlines.
A semicolon is 1 character, and a newline is 1 character, so it all works out.

This way it's easier to see the code, let's take the chunk until the first semicolon:

```js
!function(){var e={299:function(e,t,n){"use strict"
```

What!? Why isn't it using newer syntax, that would obviously save many characters:

```js
!(()=>{stuff})

!function(){stuff}
```

It's not a problem with browserslist. That's set to

```json
      ">0.2%",
      "not dead",
      "since 2021"
```

And it's 2021! No way any browsers on 2021 don't support... oh no. Why. Edge 96 has partial support!?
Why????

I mean, the newer syntax would still work on Edge 96 but I'm still blaming them instead of webpack.

Anyways here's the matching browsers as of 2021-12-9:
```
A surprising amount of versions were removed because of >0.2%

Edge 94 to 96
Firefox 93 to 95
Chrome 91 to 96
Safari 14.1 to 15.1
Opera 80 to 81 (not 82???)
Safari & Chrome for iOS 14.5 to 15.1
Chrome 96 for Android
Firefox 94 for Android
Samsung Internet 15.0
```

At least everyone supports `let`

Let's keep going.

```js
!function(){var e={299:function(e,t,n){"use strict"
n.d(t,{Z:function(){return d}})
var r=n(489)
function a(e,t){if(null==e)return{}
var n,r,a=function(e,t){if(null==e)return{}
var n,r,a={},o=Object.keys(e)
for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n])
return a}(e,t)
```

Same circumstance with Edge 96 and shorthand functions.

Look at this huge declaration:

```js
a=function(e,t){if(null==e)return{}
var n,r,a={},o=Object.keys(e)
for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n])
return a}(e,t)

// Using for...of (supported) removes the need to declare "o" or "n" or "r"

a=function(e,t){if(null==e)return{}
var a={}
for(const n of Object.keys(e))t.indexOf(n)>=0||(a[n]=e[n])
return a}(e,t)

// Array#includes is also supported

a=function(e,t){if(null==e)return{}
var a={}
for(const n of Object.keys(e))t.includes(n)||(a[n]=e[n])
return a}(e,t)

// Using reduce or foreach would be shorter, but remember no anonymous functions.
```

New code:

```js
!function(){var e={299:function(e,t,n){"use strict"
n.d(t,{Z:function(){return d}})
var r=n(489)
function a(e,t){if(null==e)return{}
var n,r,a=function(e,t){if(null==e)return{}
var a={}
for(const n of Object.keys(e))t.includes(n)||(a[n]=e[n])
return a}(e,t)
```

Next part:

```js
if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e)
for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var o=n(853),l=n(531),i=n(20),u=n(804),s=n(791),c=n(184),f=["className","innerRef"],d=function(e){(0,i.Z)(n,e)
```

This could easily be simplified:

```js
// New variables: O g I
!function(){var O=Object,g=O.getOwnPropertySymbols,I="includes",e= ...

... for(const n of O.keys(e))t[I](n) ...

if(g){for(const n of g(e))t[I](n)||O.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}...
```

Notice all the variables at the end! That can be moved to the initial variable declaration inside `function a`

```js
// new code
!function(){var O=Object,g=O.getOwnPropertySymbols,i="includes",e={299:function(e,t,n){"use strict"
n.d(t,{Z:function(){return d}})
var r=n(489)
function a(e,t){if(null==e)return{}
var n,r,a=function(e,t){if(null==e)return{}
var a={}
for(const n of O.keys(e))t[i](n)||(a[n]=e[n])
return a}(e,t)
if(g){for(const n of g(e))t.includes(n)||O.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}var o=n(853),l=n(531),i=n(20),u=n(804),s=n(791),c=n(184),f=["className","innerRef"],d=function(e){(0,i.Z)(n,e)...

// newer code

!function(){var O=Object,g=O.getOwnPropertySymbols,i="includes",e={299:function(e,t,n){"use strict"
n.d(t,{Z:function(){return d}})
var r=n(489)
function a(e,t){if(null==e)return{}
var n,r,a=function(e,t){if(null==e)return{}
var a={}
for(const n of O.keys(e))t[I](n)||(a[n]=e[n])
return a}(e,t),o=n(853),l=n(531),i=n(20),u=n(804),s=n(791),c=n(184),f=["className","innerRef"],d=function(e){(0,i.Z)(n,e)...

<d finishes>
if(g){for(const n of g(e))t[I](n)||O.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}

// d continued
var t=(0,u.Z)(n);function n(){return(0,o.Z)(this,n),t.apply(this,arguments)}return(0,l.Z)(n,[{key:"render",value:function(){var e,t=this.props,n=t.className,o=void 0===n?"Control":n,l=t.innerRef,i=a(t,f)
return(0,c.jsx)("button",(0,r.Z)((0,r.Z)({className:o,type:"button",ref:l},i),{},{children:null!==(e=this.props.children)&&void 0!==e?e:this.props.name}))}}]),n}(s.PureComponent)},725:function(e){"use strict"

// whattt is this?
d=function(e){
  (0,i.Z)(n,e)
  var t=(0,u.Z)(n);
  function n(){
    return(0,o.Z)(this,n),
      t.apply(this,arguments)
  }
  return(0,l.Z)(
    n,[
      {
        key:"render",
        value:function(){
          var e,t=this.props,n=t.className,o=void 0===n?"Control":n,l=t.innerRef,i=a(t,f)
          return(0,c.jsx)(
            "button",(0,r.Z)(
              (0,r.Z)({className:o,type:"button",ref:l},i),
              {},
              {children:null!==(e=this.props.children)&&void 0!==e?e:this.props.name}
            )
          )
        }
      }
    ]
  ),n
}(s.PureComponent)},725:function(e){"use strict"

// D looks safe so the newer code is

!function(){var O=Object,g=O.getOwnPropertySymbols,i="includes",e={299:function(e,t,n){"use strict"
n.d(t,{Z:function(){return d}})
var r=n(489)
function a(e,t){if(null==e)return{}
var n,r,o=n(853),l=n(531),i=n(20),u=n(804),s=n(791),c=n(184),f=["className","innerRef"],a=function(e,t){if(null==e)return{}
var a={}
for(const n of O.keys(e))t[I](n)||(a[n]=e[n])
return a}(e,t),d=function(e){(0,i.Z)(n,e)
var t=(0,u.Z)(n);function n(){return(0,o.Z)(this,n),t.apply(this,arguments)}return(0,l.Z)(n,[{key:"render",value:function(){var e,t=this.props,n=t.className,o=void 0===n?"Control":n,l=t.innerRef,i=a(t,f)
return(0,c.jsx)("button",(0,r.Z)((0,r.Z)({className:o,type:"button",ref:l},i),{},{children:null!==(e=this.props.children)&&void 0!==e?e:this.props.name}))}}]),n}(s.PureComponent)
if(g){for(const n of g(e))t[I](n)||O.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}},725:function(e){"use strict"

```

Hmm, `(0, a.b)` makes `a.b[[this]] !== a`. So why not declare `function T(v){return v}` and call `T(a.b)` instead? It's shorter!

Although T has to be used 23 times to actually equalize the declaration, and it doesn't help next to things like "return"

If `function T(v,...A){return v(...A)}`, 23+11=34, but saves 2 characters `(0,a.b)(args) into T(a.b,args)`, so only needs 17 calls to equalize.

There's only 3 uses for T right now so it's not useful.

```js
Old variables: e,t,n,d,a,r,o,l,i,u,s,c,f
New variables: O,g,I
             ? T,v
```

Here's 725:

```js
,725:function(e){"use strict"
var t=Object.getOwnPropertySymbols,n=Object.prototype.hasOwnProperty,r=Object.prototype.propertyIsEnumerable
function a(e){if(null===e||void 0===e)throw new TypeError("Object.assign cannot be called with null or undefined")
return Object(e)}e.exports=function(){try{if(!Object.assign)return!1
var e=new String("abc")
if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1
for(var t={},n=0;n<10;n++)t["_"+String.fromCharCode(n)]=n
if("0123456789"!==Object.getOwnPropertyNames(t).map((function(e){return t[e]})).join(""))return!1
var r={}
return"abcdefghijklmnopqrst".split("").forEach((function(e){r[e]=e})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(a){return!1}}()?Object.assign:function(e,o){for(var l,i,u=a(e),s=1;s<arguments.length;s++){for(var c in l=Object(arguments[s]))n.call(l,c)&&(u[c]=l[c])
if(t){i=t(l)
for(var f=0;f<i.length;f++)r.call(l,i[f])&&(u[i[f]]=l[i[f]])}}return u}}

// O=Object,S=O.getOwnPropertySymbols,P=O.prototype,E=P.propertyIsEnumerable,N=O.getOwnPropertyNames
// join("") --> join`` (same for split)
// null===e||void 0===e --> null==e
!function(){var O=Object,S=O.getOwnPropertySymbols,P=O.prototype,E=P.propertyIsEnumerable,N=O.getOwnPropertyNames,e={299:function(e,t,n){"use strict"
n.d(t,{Z:function(){return d}})
var r=n(489)
function a(e,t){if(null==e)return{}
var n,r,o=n(853),l=n(531),i=n(20),u=n(804),s=n(791),c=n(184),f=["className","innerRef"],a=function(e,t){if(null==e)return{}
var a={}
for(const n of O.keys(e))t[I](n)||(a[n]=e[n])
return a}(e,t),d=function(e){(0,i.Z)(n,e)
var t=(0,u.Z)(n);function n(){return(0,o.Z)(this,n),t.apply(this,arguments)}return(0,l.Z)(n,[{key:"render",value:function(){var e,t=this.props,n=t.className,o=void 0===n?"Control":n,l=t.innerRef,i=a(t,f)
return(0,c.jsx)("button",(0,r.Z)((0,r.Z)({className:o,type:"button",ref:l},i),{},{children:null!==(e=this.props.children)&&void 0!==e?e:this.props.name}))}}]),n}(s.PureComponent)
if(S){for(const n of S(e))t[I](n)||E.call(e,n)&&(a[n]=e[n])}},725:function(e){"use strict"
var n=P.hasOwnProperty,t=S,r=E
function a(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined")
return Object(e)}e.exports=function(){try{if(!O.assign)return!1
var e=new String("abc")
if(e[5]="de","5"===N(e)[0])return!1
for(var t={},n=0;n<10;n++)t["_"+String.fromCharCode(n)]=n
if("0123456789"!==N(t).map((function(e){return t[e]})).join``)return!1
var r={}
return"abcdefghijklmnopqrst".split``.forEach((function(e){r[e]=e})),"abcdefghijklmnopqrst"===O.keys(O.assign({},r)).join``}catch(a){return!1}}()?O.assign:function(e,o){for(var l,i,u=a(e),s=1;s<arguments.length;s++){for(var c in l=O(arguments[s]))n.call(l,c)&&(u[c]=l[c])
if(t){i=t(l)
for(var f=0;f<i.length;f++)E.call(l,i[f])&&(u[i[f]]=l[i[f]])}}return u}}
```
