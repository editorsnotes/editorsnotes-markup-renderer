"use strict";

var test = require('tape')

test('Render a template', function (t) {
  var renderTemplate = require('../render_template')
    , opts

  t.plan(1);

  opts = {
    data: 'Here I am citing [@@d1, p. 3].',
    projectBaseURL: '/',
    document_zotero_json: {
      1: {
        itemType: 'book',
        title: 'The Society of the Spectacle',
        creators: [
          { creatorType: 'author', lastName: 'Debord', firstName: 'Guy' }
        ],
        date: '1967'
      }
    }
  }

  t.equal(
    renderTemplate(opts),
    '<p>Here I am citing <cite>(Debord 1967, p. 3)</cite>.</p>\n'
  );
});
