"use strict";

/* eslint camelcase:0 */

var zoteroToCSL = require('zotero-to-csl')

function itemNotFound(type) {
  return `(${type} not found)`
}

function getCSLItems(documents, baseID) {
  var items = {}

  Object.keys(documents).forEach(function (documentID) {
    var doc = documents[documentID]
      , key = baseID + documentID

    if (doc.zotero_data) {
      items[key] = zoteroToCSL(doc.zotero_data);
    } else if (doc.csl_data) {
      items[key] = doc.csl_data;
    } else {
      items[key] = { type: '', title: doc.description };
    }

    items[key].id = items[key].system_id = key;
  });

  return items;
}

function byID(arr) {
  var ret = {}

  arr.forEach(function (item) {
    var id = item.topic_node_id || item.id;
    ret[id] = item;
  });

  return ret;
}

module.exports = function renderTemplate(opts, cslEngine) {
  var cslPrefix = Math.random().toString().slice(3) + 'd'
    , itemsByID = {}
    , cslItems
    , parser
    , prefix
    , suffix
    , removeSuffix
    , delimiter

  ['note', 'topic', 'document'].forEach(function (type) {
    itemsByID[type] = byID(opts[type] || []);
  });

  cslItems = getCSLItems(itemsByID.document, cslPrefix)

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
      if (itemType === 'topic') {
        let topic = itemsByID.topic[itemID];
        return topic ? topic.preferred_name : itemNotFound('topic');
      } else if (itemType === 'note') {
        let note = itemsByID.note[itemID];
        return note ? note.title : itemNotFound('note');
      }
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
