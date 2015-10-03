"use strict";

var test = require('tape')

test('Render a template', function (t) {
  var renderTemplate = require('../render_template')
    , cslEngine = require('../csl_engine')
    , opts

  t.plan(1);

  opts = {
    data: 'Here I am citing [see @@d1, p. 3; @@d2].',
    projectBaseURL: '/',
    document: [
      {
        id: 1,
        zotero_data: {
          itemType: 'book',
          title: 'The Society of the Spectacle',
          creators: [
            { creatorType: 'author', lastName: 'Debord', firstName: 'Guy' }
          ],
          date: '1967'
        }
      },
      {
        id: 2,
        zotero_data: {
          itemType: 'book',
          title: 'The Society of the Spectacle',
          creators: [
            { creatorType: 'author', lastName: 'Debord', firstName: 'Guy' }
          ],
          date: '1967'
        }
      }
    ]
  }

  t.equal(
    renderTemplate(opts, cslEngine),
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
    , cslEngine = require('../csl_engine')
    , opts

  t.plan(1);

  opts = {
    data: '# Heading\n::: document 400\nin a block\n:::',
    projectBaseURL: '/',
    document: [
      {
        id: 400,
        zotero_data: {
          itemType: 'book',
          title: 'Two Kinds of Power',
          creators: [
            { creatorType: 'author', lastName: 'Wilson', firstName: 'Patrick' }
          ],
          date: '1968'
        }
      }
    ]
  }

  t.equal(
    renderTemplate(opts, cslEngine),
    '<h1>Heading</h1>\n' +
    '<div class="doc-block">' +
      '<div class="doc">Wilson, Patrick. 1968. <i>Two Kinds of Power</i>.</div>' +
      '<p>in a block</p>\n' +
    '</div>'
  )
});

test('Render a note title', function (t) {
  var renderTemplate = require('../render_template')
    , cslEngine = require('../csl_engine')
    , opts

  t.plan(1);

  opts = {
    data: 'I am referring to @@n12.',
    projectBaseURL: '/',
    note: [
      {
        id: 12,
        title: 'A NOTE'
      }
    ]
  }

  t.equal(
    renderTemplate(opts, cslEngine),
    '<p>I am referring to <a class="en-item en-item-note" rel="http://editorsnotes.org/v#note" href="/notes/12/">' +
      'A NOTE' +
    '</a>.</p>\n'
  )

});
