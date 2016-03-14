var test = require('tape')

var remove = require('../')

test('API `remove` should remove codes to which related specific module', function(t) {
  remove()
  t.fail()
  t.end()
})
