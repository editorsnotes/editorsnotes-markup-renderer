"use strict"

var test = require('tape')

test('Get embedded items', function (t) {
  var getEmbeddedItems = require('../get_embedded_items')

  t.plan(4)

  t.deepEqual(getEmbeddedItems('@@n1 @@n2 @@t1'), {
    note: ['1', '2'],
    topic: ['1']
  });


  t.deepEqual(getEmbeddedItems('[label](@@n3)'), {
    note: ['3']
  });


  var attributedQuote = `
> This is a quote
>
> [@@d123]
`

  t.deepEqual(getEmbeddedItems(attributedQuote), {
    document: ['123']
  });


  var documentBlock = `
::: document 14
inside a document block
:::
`
  t.deepEqual(getEmbeddedItems(documentBlock), {
    document: ['14']
  });
})
