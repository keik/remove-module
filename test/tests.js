var test = require('tape'),
    fs   = require('fs'),
    path = require('path')

var remove = require('../')

fs.readdirSync('./test/fixtures').forEach(function(fixture) {

  test(fixture, function(t) {
    var dirpath = path.join('./test/fixtures/', fixture),
        files = fs.readdirSync(dirpath)

    files.filter(function(file) {
      return /^fixture/.test(file)
    }).forEach(function(file) {
      var code = fs.readFileSync(path.join(dirpath, file), 'utf8'),
          expected = fs.readFileSync(path.join(dirpath, file.replace('fixture', 'expected')), 'utf8'),
          transformed = remove('debug', code)

      t.equal(transformed, expected, file)
    })

    t.end()
  })

})

test('arguments', function(t) {

  var CODE = [
    'var fs = require(\'fs\'), path = require(\'path\'), debug = require(\'debug\'), bows = require(\'bows\'), d1 = debug(\'foo\'), d2 = bows(\'bar\');',
    'fs.statSync(\'.\');',
    'path.resolve();',
    'd1(0);',
    'd2(1);',
    'console.log(2);',
    ''].join('\n')

  var transformed,
      expected

  transformed = remove([null, 'debug'], CODE)
  expected = [
      'var fs = require(\'fs\'), path = require(\'path\'), bows = require(\'bows\'), d2 = bows(\'bar\');',
      'fs.statSync(\'.\');',
      'path.resolve();',
      'd2(1);',
      'console.log(2);',
      ''
  ].join('\n')
  t.equal(transformed, expected, 'modules: [null, \'debug\']')

  transformed = remove([undefined, 'debug', 'bows'], CODE)
  expected = [
    'var fs = require(\'fs\'), path = require(\'path\');',
    'fs.statSync(\'.\');',
    'path.resolve();',
    'console.log(2);',
    ''
  ].join('\n')
  t.equal(transformed, expected, 'modules: [undefined, \'debug\', \'bows\']')

  transformed = remove([true, 'debug', 'bows', 'fs'], CODE)
  expected = [
    'var path = require(\'path\');',
    'path.resolve();',
    'console.log(2);',
    ''
  ].join('\n')
  t.equal(transformed, expected, 'modules: [true, \'debug\', \'bows\', \'fs\']')
  t.end()

})
