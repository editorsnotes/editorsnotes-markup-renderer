"use strict";

var resolveItemText = require('./resolve_item_text')
  , makeInlineCitation = require('./make_inline_citation')
  , makeBibliographyEntry = require('./make_bibliography_entry')
  , formatItems = require('./format_items')
  , getCSLItems = require('./csl_from_documents')

module.exports = function renderTemplate(opts, cslEngine) {
  var itemsByID = formatItems(opts)
    , cslItems
    , parser

  cslItems = getCSLItems(itemsByID.document)
  cslEngine.sys.items = cslItems;
  cslEngine.updateItems(Object.keys(cslItems), true);

  parser = require('editorsnotes-markup-parser')({
    projectBaseURL: opts.projectBaseURL,
    resolveItemText: resolveItemText.bind(null, itemsByID),
    makeInlineCitation: makeInlineCitation.bind(null, cslEngine),
    makeBibliographyEntry: makeBibliographyEntry.bind(null, cslEngine)
  });

  return parser.render(opts.data, {});
}
