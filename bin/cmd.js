#!/usr/bin/env node

var remove = require('../')

var fs       = require('fs'),
    opts     = require('minimist')(
      process.argv.slice(2), {
        boolean: ['h', 'v', 'd'],
        default: {h: false, v: false, d: false},
        alias: {
          h: 'help',
          v: 'version',
          d: 'debug',
          m: 'module',
          f: 'file',
          o: 'outfile'
        }
      }),
    filepath = opts.f || opts._.pop(),
    modules  = opts.m || opts._,
    out      = (typeof opts.o === 'string')
      ? fs.createWriteStream(opts.o).on('close', () => process.exit(1))
      : process.stdout

main()

function main() {
  if (opts.v) {
    process.stdout.write(
      `udebug v${ require('../package.json').version }\n`)
    return
  }

  if (opts.h) {
    help()
    return
  }

  if (process.stdin.isTTY && filepath) {
    out.write(remove(modules, fs.readFileSync(filepath, 'utf8'), {
      filepath: filepath,
      debug: opts.d
    }))
  }
  else if (!process.stdin.isTTY) {
    var data = ''
    process.stdin
      .on('readable', () => {
        var chunk
        while ((chunk = process.stdin.read()))
          data += chunk
      })
      .on('end', () => out.write(remove(modules, data)))
  } else {
    help()
  }
}

function help() {
  fs.createReadStream(__dirname + '/usage.txt')
    .pipe(process.stdout)
    .on('close', () => process.exit(1))
}
