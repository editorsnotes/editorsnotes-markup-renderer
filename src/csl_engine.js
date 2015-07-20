"use strict";

var fs = require('fs')
  , citeproc = require('citeproc-js-node')
  , sys = new citeproc.simpleSys()

sys.addLocale('en-US', fs.readFileSync(__dirname + '/../csl/locales-en-US.xml', 'utf-8'))

module.exports = sys.newEngine(
  fs.readFileSync(__dirname + '/../csl/chicago-author-date.csl', 'utf-8'),
  'en-US',
  null
)
