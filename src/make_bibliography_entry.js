"use strict";

module.exports = function (cslEngine, citation) {
  var select = [{ id: citation.id }]
    , bibliography = cslEngine.makeBibliography({ select })
    , bibItems = bibliography[1]

  return bibItems[0].trim();
}
