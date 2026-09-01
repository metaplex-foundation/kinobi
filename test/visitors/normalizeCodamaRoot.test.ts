import test from 'ava';
import {
  assertIsNode,
  fixedSizeNode,
  normalizeCodamaRoot,
  prefixedSizeNode,
  remainderSizeNode,
  numberTypeNode,
  type CodamaRootInput,
} from '../../src';

function codamaProgram(definedTypes: unknown[] = []): unknown {
  return {
    kind: 'programNode',
    name: 'testProgram',
    publicKey: '11111111111111111111111111111111',
    version: '1.0.0',
    docs: [],
    accounts: [],
    instructions: [],
    definedTypes,
    pdas: [],
    errors: [],
  };
}

function codamaRoot(
  program: unknown,
  additionalPrograms: unknown[] = []
): CodamaRootInput {
  return {
    kind: 'rootNode',
    standard: 'codama',
    version: '1.0.0',
    program,
    additionalPrograms,
  } as unknown as CodamaRootInput;
}

function definedTypeWithType(type: unknown, name = 'myType'): unknown {
  return { kind: 'definedTypeNode', name, docs: [], type };
}

test('countToSize: fixedCountNode becomes fixedSizeNode', (t) => {
  const type = {
    kind: 'arrayTypeNode',
    item: { kind: 'publicKeyTypeNode' },
    count: { kind: 'fixedCountNode', value: 5 },
  };
  const root = normalizeCodamaRoot(
    codamaRoot(codamaProgram([definedTypeWithType(type)]))
  );
  const resultType = root.programs[0].definedTypes[0].type;
  assertIsNode(resultType, 'arrayTypeNode');
  t.deepEqual(resultType.size, fixedSizeNode(5));
  t.false('count' in resultType);
});

test('countToSize: prefixedCountNode becomes prefixedSizeNode', (t) => {
  const type = {
    kind: 'arrayTypeNode',
    item: { kind: 'publicKeyTypeNode' },
    count: {
      kind: 'prefixedCountNode',
      prefix: { kind: 'numberTypeNode', format: 'u16', endian: 'le' },
    },
  };
  const root = normalizeCodamaRoot(
    codamaRoot(codamaProgram([definedTypeWithType(type)]))
  );
  const resultType = root.programs[0].definedTypes[0].type;
  assertIsNode(resultType, 'arrayTypeNode');
  t.deepEqual(resultType.size, prefixedSizeNode(numberTypeNode('u16')));
  t.false('count' in resultType);
});

test('countToSize: remainderCountNode becomes remainderSizeNode', (t) => {
  const type = {
    kind: 'setTypeNode',
    item: { kind: 'publicKeyTypeNode' },
    count: { kind: 'remainderCountNode' },
  };
  const root = normalizeCodamaRoot(
    codamaRoot(codamaProgram([definedTypeWithType(type)]))
  );
  const resultType = root.programs[0].definedTypes[0].type;
  assertIsNode(resultType, 'setTypeNode');
  t.deepEqual(resultType.size, remainderSizeNode());
  t.false('count' in resultType);
});

test('sizePrefixTypeNode wrapping a stringTypeNode collapses into size', (t) => {
  const type = {
    kind: 'sizePrefixTypeNode',
    type: { kind: 'stringTypeNode', encoding: 'utf8' },
    prefix: { kind: 'numberTypeNode', format: 'u32', endian: 'le' },
  };
  const root = normalizeCodamaRoot(
    codamaRoot(codamaProgram([definedTypeWithType(type)]))
  );
  const resultType = root.programs[0].definedTypes[0].type;
  assertIsNode(resultType, 'stringTypeNode');
  t.is(resultType.encoding, 'utf8');
  t.deepEqual(resultType.size, prefixedSizeNode(numberTypeNode('u32')));
});

test('fixedSizeTypeNode wrapping a bytesTypeNode collapses into size', (t) => {
  const type = {
    kind: 'fixedSizeTypeNode',
    type: { kind: 'bytesTypeNode' },
    size: 8,
  };
  const root = normalizeCodamaRoot(
    codamaRoot(codamaProgram([definedTypeWithType(type)]))
  );
  const resultType = root.programs[0].definedTypes[0].type;
  assertIsNode(resultType, 'bytesTypeNode');
  t.deepEqual(resultType.size, fixedSizeNode(8));
});

test('optionTypeNode with fixed+prefix survives canonicalization unscathed', (t) => {
  // Codama's optionTypeNode { item, fixed, prefix } already matches v1.0's
  // OptionTypeNode shape field-for-field; generic recursion (rule 7) is
  // enough and identityVisitor.visitOptionType defaults the v1.0-only
  // `idlOption` to 'option' when it's absent.
  const type = {
    kind: 'optionTypeNode',
    fixed: true,
    item: { kind: 'publicKeyTypeNode' },
    prefix: { kind: 'numberTypeNode', format: 'u32', endian: 'le' },
  };
  const root = normalizeCodamaRoot(
    codamaRoot(codamaProgram([definedTypeWithType(type)]))
  );
  const resultType = root.programs[0].definedTypes[0].type;
  assertIsNode(resultType, 'optionTypeNode');
  t.is(resultType.fixed, true);
  t.is(resultType.idlOption, 'option');
  t.deepEqual(resultType.prefix, numberTypeNode('u32'));
  t.is(resultType.item.kind, 'publicKeyTypeNode');
});

test('sizePrefixTypeNode wrapping a structTypeNode keeps the wrapper', (t) => {
  const type = {
    kind: 'sizePrefixTypeNode',
    type: {
      kind: 'structTypeNode',
      fields: [
        {
          kind: 'structFieldTypeNode',
          name: 'a',
          type: { kind: 'numberTypeNode', format: 'u8', endian: 'le' },
        },
      ],
    },
    prefix: { kind: 'numberTypeNode', format: 'u16', endian: 'le' },
  };
  const root = normalizeCodamaRoot(
    codamaRoot(codamaProgram([definedTypeWithType(type)]))
  );
  const resultType = root.programs[0].definedTypes[0].type;
  assertIsNode(resultType, 'sizePrefixTypeNode');
  assertIsNode(resultType.type, 'structTypeNode');
  assertIsNode(resultType.prefix, 'numberTypeNode');
  t.is(resultType.prefix.format, 'u16');
  t.is(resultType.type.fields.length, 1);
});

test('Codama-only `display` metadata is stripped, even on node kinds with no dedicated identityVisitor handler', (t) => {
  // `numberTypeNode` has no explicit `identityVisitor` handler (it falls back
  // to a shallow `{ ...node }` copy), so unlike e.g. `instructionNode` it
  // would NOT otherwise drop an unknown `display` key on its own. The real
  // Token-2022 IDL attaches Codama-only UI metadata this way (a bare
  // `numberTypeNode` carrying `display: { kind: 'amountNumberDisplayNode', ... }`),
  // so the loader must strip it itself rather than rely on identityVisitor.
  const type = {
    kind: 'numberTypeNode',
    format: 'u64',
    endian: 'le',
    display: {
      kind: 'amountNumberDisplayNode',
      decimals: { kind: 'injectedValueNode', key: 'decimals' },
    },
  };
  const root = normalizeCodamaRoot(
    codamaRoot(codamaProgram([definedTypeWithType(type)]))
  );
  const resultType = root.programs[0].definedTypes[0].type;
  assertIsNode(resultType, 'numberTypeNode');
  t.deepEqual(resultType, numberTypeNode('u64'));
  t.false('display' in resultType);
});

test.failing(
  'KNOWN GAP: a sizePrefixTypeNode/fixedSizeTypeNode wrapping the struct/tuple ' +
    'of an enum variant does not fit v1.0s EnumStructVariantTypeNode/EnumTupleVariantTypeNode ' +
    '(struct/tuple must be bare) -- see task-04-report.md',
  (t) => {
    // The real Token-2022 IDL's `extension` enum has 28 struct variants
    // (e.g. `tokenMetadata`) whose `.struct` is a `sizePrefixTypeNode`
    // wrapping a `structTypeNode` (the TLV u16 length prefix). Per this
    // task's transform rules, that wrapper is intentionally KEPT (it is
    // NOT a bare string/bytes leaf, so it doesn't collapse into `size`).
    // But v1.0's `EnumStructVariantTypeNode.struct` requires a bare
    // `StructTypeNode`, and `identityVisitor.visitEnumStructVariantType`
    // asserts exactly that -- so canonicalization throws. This is a
    // pre-existing v1.0 node-shape gap (not something this loader can fix
    // without either losing the TLV length-prefix byte-layout information,
    // or widening EnumStructVariantTypeNode/EnumTupleVariantTypeNode's
    // types -- both are judgment calls outside this task's scope).
    const variant = {
      kind: 'enumStructVariantTypeNode',
      name: 'tokenMetadata',
      struct: {
        kind: 'sizePrefixTypeNode',
        type: {
          kind: 'structTypeNode',
          fields: [
            {
              kind: 'structFieldTypeNode',
              name: 'updateAuthority',
              type: { kind: 'publicKeyTypeNode' },
            },
          ],
        },
        prefix: { kind: 'numberTypeNode', format: 'u16', endian: 'le' },
      },
    };
    const type = {
      kind: 'enumTypeNode',
      variants: [{ kind: 'enumEmptyVariantTypeNode', name: 'uninitialized' }, variant],
      size: { kind: 'numberTypeNode', format: 'u8', endian: 'le' },
    };
    // Expected (once resolved) to succeed and keep the sizePrefixTypeNode
    // wrapper around the variant's struct. Currently throws instead:
    // "Expected structTypeNode, got sizePrefixTypeNode."
    const root = normalizeCodamaRoot(
      codamaRoot(codamaProgram([definedTypeWithType(type, 'extension')]))
    );
    const resultType = root.programs[0].definedTypes[0].type;
    assertIsNode(resultType, 'enumTypeNode');
    const resultVariant = resultType.variants[1];
    assertIsNode(resultVariant, 'enumStructVariantTypeNode');
    assertIsNode(resultVariant.struct, 'sizePrefixTypeNode');
  }
);

test('root program + additionalPrograms become a flat programs array', (t) => {
  const root = normalizeCodamaRoot(
    codamaRoot(codamaProgram(), [codamaProgram(), codamaProgram()])
  );
  t.is(root.kind, 'rootNode');
  t.is(root.programs.length, 3);
  t.false('standard' in root);
  t.false('version' in root);
  t.false('program' in root);
  t.false('additionalPrograms' in root);
});
