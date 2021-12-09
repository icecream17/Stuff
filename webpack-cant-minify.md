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

!function(){var O=Object,g=O.getOwnPropertySymbols,i="includes",e={299:function(e,t,n){"use strict"
n.d(t,{Z:function(){return d}})
var r=n(489)
function a(e,t){if(null==e)return{}
var n,r,o=n(853),l=n(531),i=n(20),u=n(804),s=n(791),c=n(184),f=["className","innerRef"],a=function(e,t){if(null==e)return{}
var a={}
for(const n of O.keys(e))t[I](n)||(a[n]=e[n])
return a}(e,t),d=function(e){(0,i.Z)(n,e)
var t=(0,u.Z)(n);function n(){return(0,o.Z)(this,n),t.apply(this,arguments)}return(0,l.Z)(n,[{key:"render",value:function(){var e,t=this.props,n=t.className,o=void 0===n?"Control":n,l=t.innerRef,i=a(t,f)
return(0,c.jsx)("button",(0,r.Z)((0,r.Z)({className:o,type:"button",ref:l},i),{},{children:null!==(e=this.props.children)&&void 0!==e?e:this.props.name}))}}]),n}(s.PureComponent)},725:function(e){"use strict"

```

Ugh
