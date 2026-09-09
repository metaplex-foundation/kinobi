---
'@metaplex-foundation/kinobi': minor
---

- `updateDefinedTypesVisitor` and `updateAccountsVisitor` now also accept an array of `{ select, update }` entries, where `select` is any `NodeSelector` (including functions) and `update` can be a function computing the updates per matched node. This allows pattern-based renames such as prefixing every type matching a regex, with all `definedTypeLinkNode`s (and account/PDA link nodes) following the rename.
- `renderJavaScriptVisitor`, `renderJavaScriptExperimentalVisitor` and `renderRustVisitor` accept a new `extraRenderMaps` option: additional `RenderMap` visitors written alongside the generated client in the same pass. Backed by the new `mergeRenderMapVisitors` helper.
- `JavaScriptImportMap` is now exported so custom renderers can reuse it.
