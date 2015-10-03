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

  * `note` (arr): An array of Notes as represented in the Editors' Notes API.
    Notes' `title` attributes will be used to generate inline labels.

  * `topic` (arr): An array of Topics as represented in the Editors' Notes API.
    Topics' `preferred_name` attributes will be used to generate inline labels.

  * `document` (arr): An array of Documents as represented in the Editors'
    Notes API. Documents' `zotero_data`, `csl_data`, and `description` will be
    used to generate inline labels or citations, in that order of preference.

  * `citation_style` (string): CSL style for formatted document citations.
    Default is `chicago-author-date`.

The `note`, `topic`, and `document` items will determine the text that will be
transcluded into the rendered markup HTML. If a transcluded item has no matching
representation, the rendered HTML will include the message `([item type] not
found)`.
