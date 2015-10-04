"use strict";

/* eslint camelcase:0 */

var zoteroToCSL = require('zotero-to-csl')

// Documents should be an object with documents keyed by ID
module.exports = function(documents) {
  var items = {}

  Object.keys(documents).forEach(function (documentID) {
    var doc = documents[documentID]
      , key = documentID

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
