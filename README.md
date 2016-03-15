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
Usage: rmmodule [modules] <file> [options]

Options:

     --module, -m  A module name you want to remove.

       --file, -f  A file you want to transform.

    --outfile, -o  Write the debug striped code to this file.
                   If unspecified, rmmodule prints to stdout.

      --debug, -d  Enable source maps that allow you to debug your files
                   separately.

       --help, -h  Show this message.
```

For example, if you want to remove `debug` from your code,

```
rmmodule debug src.js
```

will remove codes to which related `debug` module from src.js and print results to stdout, or

```
rmmodule debug src.js -o dist.js
```

will output to the file with `-o` option.

You can pass `-d` option to enable source map.

Stdin is also available:

```
% echo 'var debug = require("debug"), fs = require("fs")' | rmmodule debug
var fs = require('fs');
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
