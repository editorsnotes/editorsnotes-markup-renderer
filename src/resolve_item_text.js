"use strict";

function itemNotFound(type) {
  return `(${type} not found)`
}

module.exports = function (itemsByID, itemType, itemID) {
  if (itemType === 'topic') {
    let topic = itemsByID.topic[itemID];
    return topic ? topic.preferred_name : itemNotFound('topic');
  } else if (itemType === 'note') {
    let note = itemsByID.note[itemID];
    return note ? note.title : itemNotFound('note');
  } else {
    throw new Error(`Could not get label for item type ${itemType}`);
  }
}
