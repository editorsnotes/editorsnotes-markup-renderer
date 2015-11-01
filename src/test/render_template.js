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
      '<a href="/documents/1/" class="ENInlineReference ENInlineReference-document">' +
        'see Debord 1967a, p. 3' +
      '</a>; ' +
      '<a href="/documents/2/" class="ENInlineReference ENInlineReference-document">' +
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
    data: '# Heading\n::: document @@d400\nin a block\n:::',
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
    '<section class="ENDocumentBlock">' +
      '<div><a href="/documents/400/" class="ENDocumentBlock--Citation">' +
      'Wilson, Patrick. 1968. <i>Two Kinds of Power</i>.' +
      '</a></div>' +
      '<p>in a block</p>\n' +
    '</section>'
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
    '<p>I am referring to <a href="/notes/12/" class="ENInlineReference ENInlineReference-note">' +
      'A NOTE' +
    '</a>.</p>\n'
  )

});
