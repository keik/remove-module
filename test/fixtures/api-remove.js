var fs    = require('fs'),
    path  = require('path'),
    debug = require('debug'),
    bows  = require('bows'),
    d1     = debug('foo'),
    d2     = bows('bar')

fs.statSync('.')
path.resolve()
d1(0)
d2(1)
console.log(2)
