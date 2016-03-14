# remove-module

[![travis-ci](https://img.shields.io/travis/keik/remove-module.svg?style=flat-square)](https://travis-ci.org/keik/remove-module)
[![npm-version](https://img.shields.io/npm/v/remove-module.svg?style=flat-square)](https://npmjs.org/package/remove-module)

Remove code to which related specific module using AST.


# Install

```
npm install remove-module
```


# CLI

```
rmmodule debug src.js
```

will remove codes to which related `debug` module from src.js and print results to stdout, or output to the file with `-o` option:

```
rmmodule debug src.js -o dist.js
```

and you can pass `-d` option to enable source map.

Stdin is also available:

```
echo 'var debug = require("debug")' | rmmodule debug
```


# API

```javascript
var remove = require('remove-module')
```


## `remove(modules, code[, opts])`

Remove [visionmedia/debug](https://github.com/visionmedia/debug) related code from `code` using AST.

<dl>
  <dt>
    <code>modules</code> : <code>array.&lt;string&gt;</code>
  </dt>
  <dd>
    array of module names we want to remove
  </dd>

  <dt>
    <code>code</code> : <code>string</code>
  </dt>
  <dd>
    target code
  </dd>

  <dt>
    <code>opts.filepath</code> : <code>string</code>
  </dt>
  <dd>
    filepath to attach source map
  </dd>

  <dt>
    <code>opts.debug</code> : <code>boolean</code>
  </dt>
  <dd>
    attach source map or not
  </dd>
</dl>


# Example
```js
var remove = require('remove-module')

var code = [
  'var debug = require("debug"),',
  '    d     = debug("MYAPP")   ',
  '                             ',
  'function greet() {           ',
  '  d("#greet called")         ',
  '  return "hi"                ',
  '}                            '
].join('\n')

process.stdout.write(remove('debug', code, {filepath: 'a.js', debug: true}))
```

will output:

```js
function greet() {
    return 'hi';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImEuanMiXSwibmFtZXMiOlsiZ3JlZXQiXSwibWFwcGluZ3MiOiJBQUdBLFNBQVNBLEtBQVQsR0FBaUI7QUFBQSxJQUVmLE9BQU8sSUFBUCxDQUZlO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZGVidWcgPSByZXF1aXJlKFwiZGVidWdcIiksXG4gICAgZCAgICAgPSBkZWJ1ZyhcIk1ZQVBQXCIpICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuZnVuY3Rpb24gZ3JlZXQoKSB7ICAgICAgICAgICBcbiAgZChcIiNncmVldCBjYWxsZWRcIikgICAgICAgICBcbiAgcmV0dXJuIFwiaGlcIiAgICAgICAgICAgICAgICBcbn0gICAgICAgICAgICAgICAgICAgICAgICAgICAgIl19
```


# Test

```
% npm install
% npm test
```


# License

MIT (c) keik
