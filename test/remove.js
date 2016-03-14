var test = require('tape'),
    fs   = require('fs')

var remove = require('../')

test('API `remove` should remove codes to which related specific module', function(t) {

  t.test('pattern 1', function(t) {
    t.fail()
    t.end()
  })

})

test('API `remove` should not remove codes when `modules` arguments is not `string` or `array` of it', function(t) {

  var CODE = fs.readFileSync(__dirname + '/fixtures/remove.js', 'utf8')

  t.test('`modules` is null', function(t) {
    var transformed = remove(null, CODE)
    var expected = [
      "var fs = require('fs'), debug = require('debug'), d = debug('foo');",
      "d(0);",
      ''
    ].join('\n')

    t.equal(transformed, expected)
    t.end()
  })

  t.test('`modules` is undefined', function(t) {
    var transformed = remove(undefined, CODE)
    var expected = [
      "var fs = require('fs'), debug = require('debug'), d = debug('foo');",
      "d(0);",
      ''
    ].join('\n')

    t.equal(transformed, expected)
    t.end()
  })

  t.test('`modules` is boolean', function(t) {
    var transformed = remove(true, CODE)
    var expected = [
      "var fs = require('fs'), debug = require('debug'), d = debug('foo');",
      "d(0);",
      ''
    ].join('\n')

    t.equal(transformed, expected)
    t.end()
  })

  t.test('`modules` is array which contains null', function(t) {
    var transformed = remove([null, 'debug'], CODE)
    var expected = [
      "var fs = require('fs');",
      ''
    ].join('\n')

    t.equal(transformed, expected)
    t.end()
  })

  t.test('`modules` is undefined', function(t) {
    var transformed = remove([undefined, 'debug'], CODE)
    var expected = [
      "var fs = require('fs');",
      ''
    ].join('\n')

    t.equal(transformed, expected)
    t.end()
  })

  t.test('`modules` is boolean', function(t) {
    var transformed = remove([true, 'debug'], CODE)
    var expected = [
      "var fs = require('fs');",
      ''
    ].join('\n')

    t.equal(transformed, expected)
    t.end()
  })

})
