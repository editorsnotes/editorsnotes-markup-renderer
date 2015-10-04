"use strict";

function byID(arr) {
  var ret = {}

  arr.forEach(function (item) {
    var id = item.topic_node_id || item.id;
    ret[id] = item;
  });

  return ret;
}

// Data should be an object with keys for note, topic, document that each
// have arrays of items' json
module.exports = function (data) {
  var itemsByID = {}
    , types = ['note', 'topic', 'document']

  types.forEach(function (type) {
    itemsByID[type] = byID(data[type] || []);
  });

  return itemsByID;
}
