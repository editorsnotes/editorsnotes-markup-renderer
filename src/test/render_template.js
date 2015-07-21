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

test('Render a document block with a bibliography', function (t) {
  var renderTemplate = require('../render_template')
    , opts

  t.plan(1);

  opts = {
    data: '# Heading\n::: document 400\nin a block\n:::',
    projectBaseURL: '/',
    document_zotero_json: {
      400: {
        itemType: 'book',
        title: 'Two Kinds of Power',
        creators: [
          { creatorType: 'author', lastName: 'Wilson', firstName: 'Patrick' }
        ],
        date: '1968'
      }
    }
  }

  t.equal(
    renderTemplate(opts),
    '<h1>Heading</h1>\n' +
    '<div class="doc-block">' +
      '<div class="doc">Wilson, Patrick. 1968. <i>Two Kinds of Power</i>.</div>' +
      '<p>in a block</p>\n' +
    '</div>'
  )
});
