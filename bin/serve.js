#!/usr/bin/env node

// vim: filetype=javascript

"use strict";

var http = require('http')
  , url = require('url')
  , jsonBody = require('body/json')
  , argv = require('optimist').default({ port: 7194, host: '127.0.0.1' }).argv

function embeddedItems(res, data) {
  var getEmbeddedItems = require('../lib/get_embedded_items')
    , items = getEmbeddedItems(data)

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(items));
}

function renderedTemplate(res, opts) {
  var renderTemplate = require('../lib/render_template')
    , cslEngine = require('../lib/csl_engine')
    , html = renderTemplate(opts, cslEngine)

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(html);
}

function handleServerError(res, err) {
  res.statusCode = 500;
  res.setHeader('Content-Type', 'text/plain');
  res.end(err.toString());
}

http.createServer(function (req, res) {
  var parsed = url.parse(req.url, true);

  if (parsed.pathname !== '/') {
    res.statusCode = 404;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    // Method Not Allowed
    res.statusCode = 405;
    res.end();
    return;
  }

  jsonBody(req, function (err, json) {
    if (err) {
      res.statusCode = 400;
      res.end();
      return;
    }

    if (!json.data) {
      // Unprocessable Entity
      res.statusCode = 422;
      res.end('Missing "data" key with Editors\'s Notes markup\n');
      return;
    }

    json.projectBaseURL = json.url_root;

    try {
      if (parsed.query.only_transcluded_items) {
        embeddedItems(res, json.data);
      } else {
        renderedTemplate(res, json);
      }
    } catch (serverErr) {
      handleServerError(res, serverErr);
    }
  });
}).listen(argv.port, argv.host);

console.log('Server running at ' + argv.host + ':' + argv.port);
