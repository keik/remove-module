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
 * @param {object} [opts] options
 * @param {string} [opts.filepath] filepath to attach source map
 * @param {boolean} [opts.debug] attach source map or not
 * @returns {string} transformed code
 */
function remove(modules, code, opts) {

  modules = Array.isArray(modules) ? modules : [modules]
  opts = opts || {}

  var ast = esprima.parse(code, {
    sourceType: 'module',
    loc: opts.debug
  })

  var removee,
      assigned = [[]]

  var _padding = '' // for logging

  estraverse.replace(ast, {

    enter: function(node, parent) {
      d((_padding += ' ') + '[enter] ' + node.type + ' ' + (node.value || node.property && node.property.name || '*') + ' ' + (node.name || '*'))

      if (removee === parent)
        this.skip()

      switch(node.type) {
      case syntax.ImportDeclaration:
        if (modules.indexOf(node.source.value) > -1) {
          removee = node
          this.skip()
        }
        break
      case syntax.CallExpression:
        if (node.callee.name === 'require'
            && node.arguments[0] && modules.indexOf(node.arguments[0].value) > -1)
          removee = node
        break
      case syntax.BlockStatement:
        assigned.push([])
        break
      case syntax.Property:
        if (Array.prototype.concat.apply([], assigned).indexOf(node.value.name) > -1) {
          removee = node
          this.skip()
        }
        break
      case syntax.Identifier:
        if (Array.prototype.concat.apply([], assigned).indexOf(node.name) > -1) {
          // Identifier will be removed basically,
          // except in the case that parent MemberExpression's root object is no-marked
          if (parent.type === syntax.MemberExpression && parent.object) {
            if (Array.prototype.concat.apply([], assigned).indexOf(parent.object.name) > -1)
              removee = node
          } else
            removee = node
        }
        break
      }
    },

    leave: function(node, parent) {
      d((_padding =
         _padding.substr(1)) + ' [leave] ' + node.type + ' ' + (node.value || node.property && node.property.name || '*') + ' ' + (node.name || '*'))

      if (node === removee) {
        d(_padding + ' @@ remove ' + node.type + ' @@')
        this.remove()
        switch(node.type) {
        case syntax.ImportDeclaration:
          node.specifiers.forEach(function(specifier) {
            assigned[assigned.length - 1].push(specifier.local.name)
          })
          break
        case syntax.VariableDeclarator:
          assigned[assigned.length - 1].push(node.id.name)
          break
        case syntax.AssignmentExpression:
          if (node.left != null) {
            assigned[assigned.length - 1].push(node.left.name)
            removee = parent
          }
          break
        case syntax.Identifier:
          switch(parent.type) {
          case syntax.CallExpression:
          case syntax.MemberExpression:
          case syntax.SwitchCase:
          case syntax.AssignmentExpression:
          case syntax.Property:
          case syntax.UnaryExpression:
            removee = parent
          }
          break
        case syntax.CallExpression:
        case syntax.MemberExpression:
          removee = parent
          break
        }
      }

      switch(node.type) {
      case syntax.BlockStatement:
        assigned.pop()
        break
      case syntax.VariableDeclaration:
        if (node.declarations.length === 0) {
          d(_padding + ' @@ remove ' + node.type + ' @@')
          this.remove()
        }
        break
      case syntax.ExpressionStatement:
        if (node.expression == null) {
          d(_padding + ' @@ remove ' + node.type + ' @@')
          this.remove()
        }
        break
      case syntax.IfStatement:
        if (node.test == null || node.consequent == null) {
          d(_padding + ' @@ remove ' + node.type + ' @@')
          this.remove()
        }
        break
      case syntax.WhileStatement:
      case syntax.ForStatement:
      case syntax.ForInStatement:
        if ((node.test == null && node.right == null) || node.body == null) {
          d(_padding + ' @@ remove ' + node.type + ' @@')
          this.remove()
        }
        break
      case syntax.NewExpression:
        if (node.callee == null)
          this.remove()
        break
      case syntax.SwitchStatement:
        if (node.discriminant == null) {
          d(_padding + ' @@ remove ' + node.type + ' @@')
          this.remove()
        }
        break
      case syntax.LogicalExpression:
        if (node.right == null || node.left == null)
          if (node.operator === '&&') {
            this.remove()
          } else if (node.operator === '||') {
            return node.right ? node.right : node.left
          }
        break
      }
      return node
    }
  })

  d('[results] %j', ast)
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
