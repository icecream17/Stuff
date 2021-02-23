console.log([
   // globalThis properties
   globalThis,
   Infinity,
   NaN,
   undefined,
   eval,
   isFinite,
   isNaN,
   parseFloat,
   parseInt,
   decodeURI,
   decodeURIComponent,
   encodeURI,
   encodeURIComponent,
   Array,
   ArrayBuffer,
   BigInt,
   BigInt64Array,
   BigUint64Array,
   Boolean,
   DataView,
   Date,
   Error,
   EvalError,
   FinalizationRegistry,
   Float32Array,
   Float64Array,
   Function,
   Int8Array,
   Int16Array,
   Int32Array,
   Map,
   Number,
   Object,
   Promise,
   Proxy,
   RangeError,
   ReferenceError,
   RegExp,
   Set,
   SharedArrayBuffer,
   String,
   Symbol,
   SyntaxError,
   TypeError,
   Uint8Array,
   Uint8ClampedArray,
   Uint16Array,
   Uint32Array,
   URIError,
   WeakMap,
   WeakRef,
   WeakSet,
   Atomics,
   JSON,
   Math,
   Reflect,
   Object.getPrototypeOf(globalThis), // <Host-defined. Guaranteed to exist, at least.>

   // 1. [Object instance] Inherits from Object
   Object.prototype,
   Object.prototype.hasOwnProperty,
   Object.prototype.isPrototypeOf,
   Object.prototype.propertyIsEnumerable,
   Object.prototype.toLocaleString,
   Object.prototype.toString,
   Object.prototype.valueOf,


   // Infinity properties
   // 1. [Number instance] Inherits from Number
   Number.prototype,
   Number.prototype.toExponential,
   Number.prototype.toFixed,
   Number.prototype.toLocaleString,
   Number.prototype.toPrecision,
   Number.prototype.toString,
   Number.prototype.valueOf,


   // eval properties
   // 1. Function instance
   eval.length, // === 1
   eval.name, // === "eval"
   eval.prototype,

   // 2. Inherits from Function <https://tc39.es/ecma262/#sec-built-in-function-objects>
   Function.prototype,
   Function.prototype.apply,
   Function.prototype.bind,
   Function.prototype.call,
   // Function.prototype.constructor,
   Function.prototype.toString,
   Function.prototype[Symbol.hasInstance],

   // 3. Errors within eval
   // 3.1 <A lottt of errors! In fact... every possible non-module/Script error. Sigh>
   // 3.1.1 <Syntax errors>
   (() => {
      try {
         eval('let x, x;');
      } catch (error) {
         return error;
      }
   })(),
   (() => {
      try {
         eval('var x; let x;');
      } catch (error) {
         return error;
      }
   })(),
   (() => {
      try {
         eval('label: label: 1');
      } catch (error) {
         return error;
      }
   })(),
   (() => {
      try {
         eval('break label');
      } catch (error) {
         return error;
      }
   })(),
   (() => {
      try {
         eval('continue label');
      } catch (error) {
         return error;
      }
   })(),
   // <Script StatementList Statement VariableStatement BindingIdentifier>
   (() => {
      try {
         eval('"use strict"; var eval');
      } catch (error) {
         return error;
      }
   })(),
   (() => {
      try {
         eval('"use strict"; var yield');
      } catch (error) {
         return error;
      }
   })(),
   // <Still BindingIdentifier, but different thing. In this case a generator _expression_>
   (() => {
      try {
         eval('(function* yield (){})');
      } catch (error) {
         return error;
      }
   })(),
   // <Did you know this error existed? You've probably never even tried this.>
   (() => {
      try {
         eval('async await => 1');
      } catch (error) {
         return error;
      }
   })(),
   // <Ok, done with BindingIdentifier... now it's Expression. Great. <AssignmentExpression>>
   (() => {
      try {
         eval('var x = 1 = 1');
      } catch (error) {
         return error;
      }
   })(),
   (() => {
      try {
         eval('"use strict"; var a = [eval] = [1]');
      } catch (error) {
         return error;
      }
   })(),
   (() => {
      try {
         eval('var [...[1, 2]] = []');
      } catch (error) {
         return error;
      }
   })(),
   (() => {
      try {
         eval('var [[1]] = [[8]]');
      } catch (error) {
         return error;
      }
   })(),
   (() => {
      try {
         eval('"use strict"; var [[eval]] = [[8]]');
      } catch (error) {
         return error;
      }
   })(),
   (() => {
      try {
         eval('"use strict"; var eval = 8');
      } catch (error) {
         return error;
      }
   })(),
   (() => {
      try {
         eval('var x = {jump} = {jump() {super()}}');
      } catch (error) {
         return error;
      }
   })(),
   (() => {
      try {
         eval('if (true) label: function a () {};');
      } catch (error) {
         return error;
      }
   })(),
   // <Only different because of Browsers, see B.3.2>
   (() => {
      try {
         eval('"use strict"; if (true) label: function a () {};');
      } catch (error) {
         return error;
      }
   })()
])
