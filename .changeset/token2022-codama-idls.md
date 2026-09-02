---
'@metaplex-foundation/kinobi': minor
---

Add support for loading Codama-standard IDLs (such as SPL Token-2022's) via `createFromJson` and rendering them with the JavaScript (Umi) renderer.

Codama roots are normalized on load into Kinobi's node model: `program`/`additionalPrograms` are flattened into `programs`, collection `count` nodes are mapped to `size` nodes, size-prefixed/fixed-size strings and bytes are collapsed to their native sized form, names are camel-cased, defaults are filled in, display-only metadata is dropped, and the root is re-stamped with the `kinobi` standard.

This adds the Codama-standard nodes v1.0 lacked — the `constantValueNode`/`bytesValueNode` value nodes and the `zeroableOptionTypeNode`, `remainderOptionTypeNode`, `sizePrefixTypeNode`, `fixedSizeTypeNode`, `hiddenPrefixTypeNode`, and `preOffsetTypeNode` type nodes — and teaches the JavaScript renderer to emit their serializers, backed by helpers emitted into the generated `shared` folder only when used. This includes a `remainderArray` helper for remainder-counted arrays of variable-size items (Umi's built-in `array({ size: 'remainder' })` only supports fixed-size items), which is what makes Token-2022's extension TLV list work. The renderer also emits a `find<Name>Pda` helper for PDAs that aren't linked to an account of their own (such as Token-2022's `associatedToken` PDA), and `EnumStructVariantTypeNode`/`EnumTupleVariantTypeNode` now accept a size-prefixed/fixed-size-wrapped body (Token-2022's length-prefixed extension variants).

Correctness is proven by a byte-for-byte roundtrip test that decodes and re-encodes real captured Token-2022 mint and token account bytes with the generated Umi serializers. Output for existing Anchor/Shank IDLs is byte-for-byte unchanged.
