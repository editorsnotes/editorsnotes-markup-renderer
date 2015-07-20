"use strict";

var test = require('tape')

test('Render a template', function (t) {
  var renderTemplate = require('../render_template')
    , opts

  t.plan(1);

  opts = {
    data: 'Here I am citing [see @@d1, p. 3; @@d2].',
    projectBaseURL: '/',
    document_zotero_json: {
      1: {
        itemType: 'book',
        title: 'The Society of the Spectacle',
        creators: [
          { creatorType: 'author', lastName: 'Debord', firstName: 'Guy' }
        ],
        date: '1967'
      },
      2: {
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
    '<p>Here I am citing <cite>(' +
      '<a rel="http://editorsnotes.org/v#document" href="/documents/1/">' +
        'see Debord 1967a, p. 3' +
      '</a>; ' +
      '<a rel="http://editorsnotes.org/v#document" href="/documents/2/">' +
        'Debord 1967b' +
      '</a>' +
    ')</cite>.</p>\n'
  );
});
