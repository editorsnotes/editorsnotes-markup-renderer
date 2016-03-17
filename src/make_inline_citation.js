"use strict";

// Assumes items have already been loaded into the engine and updated
module.exports = function (cslEngine, citations) {
  var prefix = cslEngine.citation.opt.layout_prefix
    , suffix = cslEngine.citation.opt.layout_suffix
    , delimiter = cslEngine.citation.opt.layout_delimiter
    , citationData
    , citationText

  function removeSuffix(str) {
    var idx = str.lastIndexOf(suffix);
    return idx === -1 ? str : str.slice(0, idx);
  }

  citationData = {
    citationItems: citations.map(function (citation) {
      return {
        id: citation.id,
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
      .map(text => text.trim())
  }
}
