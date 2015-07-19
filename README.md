# Editors' Notes markup renderer
A server to render Editors' Notes markup, with support for formatting citations
from Zotero or CSL data.

# Running
Installing this package will create a binary called `editorsnotes_renderer`.
Run it with `editorsnotes_renderer [--host=127.0.0.1] [--port=7194]`

# API
The server exposes a single root endpoint. It *must* be POSTed to with a JSON
object containing a `data` key with text that will be parsed as Editors' Notes
markup.

One GET parameter is understood by the server, the `only_transcluded_items`
flag.  If set, the response will be a JSON object containing `document`,
`topic`, and `note` keys containing arrays of the objects which would be
transcluded in a rendered note.

If this flag is not set, the response will be an HTML string representing the
markup data rendered, with respect to the following POST parameters:

  * `url_root` (string): The root of all links to items (i.e. /projects/emma/)
  * `note` (object): key-value map of note IDs to their titles
  * `topic` (object): key-value map of topic IDs to their preferred names
  * `document_zotero_json` (object): key-value map of document IDs to their
    Zotero data.
  * `document_csl_json` (object): Same as `document_zotero_json`, but with data
    that will be understood as CSL, not Zotero, JSON
  * `document_description` (object): key-value map of document IDs to their HTML
    descriptions.
  * `citation_style` (string): CSL style for formatted document citations.
    Default is `chicago-author-date`.

The `note`, `topic`, and `document*` maps will determine the text that will be
transcluded into the rendered note HTML. If a transcluded item has no matching
representation, the rendered HTML will include the message `([item type] not
found)`.

Document transclusion goes through the following steps, in order:

  1. If a document ID is present in `document_zotero_json`, convert it to CSL
     JSON, then format it with the CSL processor and transclude it.
  2. If a document ID is present in `document_csl_json`, format it with the
     CSL processor and transclude it.
  3. If a document ID is present in `document_description`, transclude it
     directly.
  4. Add the text `(document not found)`
