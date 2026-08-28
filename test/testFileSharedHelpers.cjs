const k = require('../dist/cjs');

// A tiny synthetic "Gizmo" program, built directly with Kinobi's node
// builders (no IDL file), that exercises the same six shared serializer
// helpers Token-2022's Codama IDL exercises:
//   - zeroableOption
//   - sizePrefix
//   - remainderOption + hiddenPrefix + remainderArray + padLeftSerializer
//
// This mirrors the exact composition the real Token-2022 mint uses for its
// extension TLV list:
//   remainderOption(hiddenPrefix(remainderArray(getExtensionSerializer()), [
//     padLeftSerializer(u8(), 83).serialize(1),
//   ]))
// See test/packages/js-token2022/test/sharedHelpers.test.ts for the
// runtime assertions against the code rendered from this shape.

const gizmoExtension = k.definedTypeNode({
  name: 'gizmoExtension',
  type: k.enumTypeNode([
    k.enumStructVariantTypeNode(
      'variantA',
      k.structTypeNode([
        k.structFieldTypeNode({ name: 'value', type: k.numberTypeNode('u8') }),
      ])
    ),
    k.enumStructVariantTypeNode(
      'variantB',
      k.structTypeNode([
        k.structFieldTypeNode({ name: 'value', type: k.numberTypeNode('u64') }),
      ])
    ),
  ]),
});

const gizmo = k.definedTypeNode({
  name: 'gizmo',
  type: k.structTypeNode([
    // Exercises `zeroableOption`.
    k.structFieldTypeNode({
      name: 'authority',
      type: k.zeroableOptionTypeNode(k.publicKeyTypeNode()),
    }),
    // Exercises `sizePrefix` (wrap path).
    k.structFieldTypeNode({
      name: 'sized',
      type: k.sizePrefixTypeNode(
        k.structTypeNode([
          k.structFieldTypeNode({
            name: 'amount',
            type: k.numberTypeNode('u64'),
          }),
        ]),
        k.numberTypeNode('u16')
      ),
    }),
    // Exercises `remainderOption` + `hiddenPrefix` + `remainderArray` +
    // `padLeftSerializer` — the same composition Token-2022 uses for its
    // account extension TLV list.
    k.structFieldTypeNode({
      name: 'extensions',
      type: k.remainderOptionTypeNode(
        k.hiddenPrefixTypeNode(
          k.arrayTypeNode(
            k.definedTypeLinkNode('gizmoExtension'),
            k.remainderCountNode()
          ),
          [
            k.constantValueNode(
              k.preOffsetTypeNode(k.numberTypeNode('u8'), 4, 'padded'),
              k.numberValueNode(1)
            ),
          ]
        )
      ),
    }),
  ]),
});

const kinobi = k.createFromRoot(
  k.rootNode(
    k.programNode({
      name: 'gizmoProgram',
      publicKey: '11111111111111111111111111111111',
      definedTypes: [gizmoExtension, gizmo],
    })
  )
);

kinobi.accept(
  k.renderJavaScriptVisitor('./test/packages/js-token2022/src/generated')
);
