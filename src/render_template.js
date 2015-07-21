"use strict";

/* eslint camelcase:0 */

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
    items[key].id = items[key].system_id = key;
  });

  Object.keys(cslJSON).forEach(function (id) {
    var key = baseID + id;
    if (key in items) return;
    items[key] = cslJSON[id];
    items[key].id = items[key].system_id = key;
  });

  Object.keys(descriptions).forEach(function (id) {
    var key = baseID + id;
    if (key in items) return;
    items[key] = { type: '', title: descriptions[id] };
    items[key].id = items[key].system_id = key;
  });

  return items;
}

module.exports = function renderTemplate(opts) {
  var cslEngine = require('./csl_engine')
    , cslPrefix = Math.random().toString().slice(3) + 'd'
    , cslItems = getCSLItems(opts, cslPrefix)
    , parser
    , prefix
    , suffix
    , removeSuffix
    , delimiter

  opts.note = opts.note || {};
  opts.topic = opts.topic || {};

  prefix = cslEngine.citation.opt.layout_prefix;
  suffix = cslEngine.citation.opt.layout_suffix;
  delimiter = cslEngine.citation.opt.layout_delimiter;

  removeSuffix = function (str) {
    var idx = str.lastIndexOf(suffix);
    return idx === -1 ? str : str.slice(0, idx);
  }

  cslEngine.sys.items = cslItems;
  cslEngine.updateItems(Object.keys(cslItems), true);

  parser = require('editorsnotes-markup-parser')({
    projectBaseURL: opts.projectBaseURL,
    resolveItemText: function (itemType, itemID) {
      return opts[itemType][itemID] || itemNotFound(itemType);
    },
    makeInlineCitation: function (citations) {
      var citationData
        , citationText

      citationData = {
        citationItems: citations.map(function (citation) {
          return {
            id: cslPrefix + citation.id,
            prefix: citation.prefix,
            suffix: citation.locator
          }
        }),
        properties: {}
      }

      citationText = cslEngine.previewCitationCluster(citationData, [], [], 'text');

      return {
        prefix,
        suffix,
        delimiter,
        citations: removeSuffix(citationText)
          .replace(prefix, '')
          .split(delimiter)
      }
    },
    makeBibliographyEntry: function (citation) {
      return cslEngine.makeBibliography({ select: [ { id: cslPrefix + citation.id } ] })[1][0].trim()
    }
  });

  return parser.render(opts.data);
}
