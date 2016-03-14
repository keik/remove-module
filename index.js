var d = require('debug')('remove-module')

var esprima    = require('esprima'),
    estraverse = require('estraverse'),
    escodegen  = require('escodegen'),
    syntax     = estraverse.Syntax,
    convert    = require('convert-source-map'),
    merge      = require('merge-source-map')

module.exports = remove

/**
 * @param {array.<string>} modules array of module names we want to remove
 * @param {string} code target code
 * @param {object} opts options
 * @param {string} opts.filepath filepath to attach source map
 * @param {boolean} opts.debug attach source map or not
 * @returns {string} transformed code
 */
function remove(modules, code, opts) {

  opts = opts || {}

  var ast = esprima.parse(code, {
    sourceType: 'module',
    loc: opts.debug
  })

  var _padding = '' // for logging

  estraverse.replace(ast, {

    enter: function(node, parent) {
      d(_padding += ' ', '[enter]', node.type, node.value || '*', node.name || '*')
    },

    leave: function(node, parent) {
      d((_padding = _padding.substr(1)) + ' ', '[leave]', node.type, node.value || '*', node.name || '*')
    }
  })

  var gen = escodegen.generate(ast, {
    sourceMap: opts.debug && opts.filepath,
    sourceContent: opts.debug && code,
    sourceMapWithCode: true
  })

  var origMap = convert.fromSource(code) && convert.fromSource(code).toObject(),
      newMap  = gen.map && gen.map.toString(),
      mergedMap = merge(origMap, JSON.parse(newMap)),
      mapComment = mergedMap ? convert.fromObject(mergedMap).toComment() : ''

  return gen.code + '\n' + mapComment
}
