#!/usr/bin/env node
var fs = require('fs')
var url = require('url')
var path = require('path')
var Prince = require('prince')
var http = require('http')
var ecstatic = require('ecstatic')
var argv = require('minimist')(process.argv.slice(2))

var site = path.join(__dirname, '../_site')
var books = path.join(site, 'books-prerendered')

// start a local server that Prince can target
http.createServer(
  ecstatic({ root: site })
).listen(8080)
console.log('Listening on :8080')

var book = path.basename(argv._[0])
var pdf = argv.o

console.log('Rendering ' + book + ' to ' + pdf)
Prince()
  .inputs(url.resolve('http://localhost:8080/books-prerendered/', book))
  .output(pdf)
  .option('style', 'local-fonts.css')
  .timeout(60000)
  .execute()
  .then(done)
  .catch(done)

function done (err, result) {
  if (err) { console.error('ERROR', err) }
  if (result) {
    console.log(result.stdout)
    console.error(result.stderr)
  }
  process.exit()
}
