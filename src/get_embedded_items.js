"use strict";

var renderNull = function () { return 'NULL' }
  , parser

parser = require('editorsnotes-markup-parser')({
  projectBaseURL: '/',
  resolveItemText: renderNull,
  makeCitationText: renderNull
});

function getENReferences(nodeArray, items) {
  items = items || {};

  return nodeArray.reduce(function (acc, node) {
    if (node.meta && node.meta.enItemType) {
      let itemType = node.meta.enItemType
        , itemID = node.meta.enItemID

      if (!acc.hasOwnProperty(itemType)) acc[itemType] = [];
      if (acc[itemType].indexOf(itemID) === -1) acc[itemType].push(itemID);
    }

    return node.children ? getENReferences(node.children, acc) : acc;
  }, items)
}

module.exports = function (text) {
  return getENReferences(parser.parse(text))
}
