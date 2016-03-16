var debug = require('debug'),
    d = debug('my-app')

a({
  b: d,
  c: function() {
    e(function () {
      f({
        g: function() {
          d()
        }
      })
    })
  }
})
