var debug = require('debug')

var d1 = debug('foo'),
    d2 = function() {}

function a() {
  var d2 = debug('bar')
  d1()
  d2()
}

d2()
