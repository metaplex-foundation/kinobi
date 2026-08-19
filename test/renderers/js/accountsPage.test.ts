import test from 'ava';
import {
  accountNode,
  definedTypeLinkNode,
  definedTypeNode,
  enumEmptyVariantTypeNode,
  enumStructVariantTypeNode,
  enumTypeNode,
  enumValueNode,
  fieldDiscriminatorNode,
  numberTypeNode,
  programNode,
  publicKeyTypeNode,
  structFieldTypeNode,
  structTypeNode,
  visit,
} from '../../../src';
import { getRenderMapVisitor } from '../../../src/renderers/js/getRenderMapVisitor';
import { renderMapContains } from './_setup';

test('it narrows omitted scalar enum defaults on account data', (t) => {
  // Given an account whose key field is fixed to a scalar enum variant.
  const node = programNode({
    name: 'mplTokenMetadata',
    publicKey: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
    accounts: [
      accountNode({
        name: 'reservationListV2',
        data: structTypeNode([
          structFieldTypeNode({
            name: 'key',
            type: definedTypeLinkNode('tmKey'),
            defaultValue: enumValueNode('tmKey', 'ReservationListV2'),
            defaultValueStrategy: 'omitted',
          }),
          structFieldTypeNode({
            name: 'masterEdition',
            type: publicKeyTypeNode(),
          }),
        ]),
        discriminators: [fieldDiscriminatorNode('key')],
      }),
    ],
    definedTypes: [
      definedTypeNode({
        name: 'tmKey',
        type: enumTypeNode([
          enumEmptyVariantTypeNode('Uninitialized'),
          enumEmptyVariantTypeNode('ReservationListV2'),
        ]),
      }),
    ],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the decoded account data type uses the enum member, not the full enum,
  // and the field codec asserts that member so struct<Data> needs no `any`.
  const code = renderMap.get('accounts/reservationListV2.ts');
  renderMapContains(t, renderMap, 'accounts/reservationListV2.ts', [
    'export type ReservationListV2AccountData = { key: TmKey.ReservationListV2;',
    'struct<ReservationListV2AccountData>(',
    'mapSerializer(getTmKeySerializer(), (value: TmKey.ReservationListV2): TmKey => value,',
    '(value: TmKey): TmKey.ReservationListV2 => {',
    'if (value === TmKey.ReservationListV2)',
  ]);
  t.false(code.includes('key: TmKey;'), 'Expected key not typed as full TmKey');
  t.false(code.includes('struct<any>'), 'Expected no struct<any> workaround');
});

test('it does not narrow omitted enum defaults on unrelated field types', (t) => {
  // Given a u64 key whose omitted default is an enum member of a different type.
  const node = programNode({
    name: 'mplTokenAuthRules',
    publicKey: 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg',
    accounts: [
      accountNode({
        name: 'frequencyAccount',
        data: structTypeNode([
          structFieldTypeNode({
            name: 'key',
            type: numberTypeNode('u64'),
            defaultValue: enumValueNode('taKey', 'Frequency'),
            defaultValueStrategy: 'omitted',
          }),
          structFieldTypeNode({
            name: 'period',
            type: numberTypeNode('i64'),
          }),
        ]),
        discriminators: [fieldDiscriminatorNode('key')],
      }),
    ],
    definedTypes: [
      definedTypeNode({
        name: 'taKey',
        type: enumTypeNode([
          enumEmptyVariantTypeNode('Uninitialized'),
          enumEmptyVariantTypeNode('Frequency'),
        ]),
      }),
    ],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the field stays a bigint and is not wrapped in mapSerializer.
  const code = renderMap.get('accounts/frequencyAccount.ts');
  renderMapContains(t, renderMap, 'accounts/frequencyAccount.ts', [
    'export type FrequencyAccountAccountData = { key: bigint;',
  ]);
  t.true(code.includes("['key', u64()]"));
  t.false(
    code.includes('key: TaKey.Frequency;'),
    'Expected u64 key not to be narrowed to the enum member'
  );
});

test('it does not narrow omitted empty variants of data enums', (t) => {
  // Given a data enum whose omitted default is an empty variant.
  const node = programNode({
    name: 'myProgram',
    publicKey: '1111',
    accounts: [
      accountNode({
        name: 'foo',
        data: structTypeNode([
          structFieldTypeNode({
            name: 'key',
            type: definedTypeLinkNode('payloadType'),
            defaultValue: enumValueNode('payloadType', 'Uninitialized'),
            defaultValueStrategy: 'omitted',
          }),
        ]),
        discriminators: [fieldDiscriminatorNode('key')],
      }),
    ],
    definedTypes: [
      definedTypeNode({
        name: 'payloadType',
        type: enumTypeNode([
          enumEmptyVariantTypeNode('Uninitialized'),
          enumStructVariantTypeNode(
            'Pubkey',
            structTypeNode([
              structFieldTypeNode({
                name: 'address',
                type: publicKeyTypeNode(),
              }),
            ])
          ),
        ]),
      }),
    ],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the field stays the full data enum, not a scalar member type.
  const code = renderMap.get('accounts/foo.ts');
  renderMapContains(t, renderMap, 'accounts/foo.ts', [
    'export type FooAccountData = { key: PayloadType',
  ]);
  t.false(
    code.includes('key: PayloadType.Uninitialized;'),
    'Expected data-enum empty variant not to be used as a type'
  );
});
