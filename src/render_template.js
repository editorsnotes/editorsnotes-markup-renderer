"use strict";

var zoteroToCSL = require('zotero-to-csl')

function itemNotFound(type) {
  return `(${type} not found)`
}

function getCSLItems(data, baseID) {
  var items = {}
    , zoteroJSON = data.document_zotero_json || {}
    , cslJSON = data.document_csl_json || {}
    , descriptions = data.document_description || {}

  Object.keys(zoteroJSON).forEach(function (id) {
    var key = baseID + id;
    items[key] = zoteroToCSL(zoteroJSON[id]);
    items[key].id = key;
  });

  Object.keys(cslJSON).forEach(function (id) {
    var key = baseID + id;
    if (key in items) return;
    items[key] = cslJSON[id];
    items[key].id = key;
  });

  Object.keys(descriptions).forEach(function (id) {
    var key = baseID + id;
    if (key in items) return;
    items[key] = { type: '', title: descriptions[id] };
    items[key].id = key;
  });

  return items;
}

module.exports = function renderTemplate(opts) {
  var cslEngine = require('./csl_engine')
    , cslPrefix = Math.random().toString().slice(3) + 'd'
    , cslItems = getCSLItems(opts, cslPrefix)
    , parser

  opts.note = opts.note || {};
  opts.topic = opts.topic || {};

  cslEngine.sys.items = cslItems;
  cslEngine.updateItems(Object.keys(cslItems), true);

  parser = require('editorsnotes-markup-parser')({
    projectBaseURL: opts.projectBaseURL,
    resolveItemText: function (itemType, itemID) {
      return opts[itemType][itemID] || itemNotFound(itemType);
    },
    makeCitationText: function (citation, inline) {
      var citationData
        , citationText

      citationData = {
        citationItems: [
          {
            id: cslPrefix + citation.id,
            prefix: citation.prefix,
            suffix: citation.locator
          }
        ],
        properties: {}
      }

      // NOTE: I haven't yet tested the makeBibliography command
      citationText = inline ?
        cslEngine.previewCitationCluster(citationData, [], [], 'text') :
        cslEngine.makeBibliography({ select: [ { id: cslPrefix + citation.id } ] })

      return citationText;
    }
  });

  return parser.render(opts.data);
}
