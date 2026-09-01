import test from 'ava';
import {
  arrayTypeNode,
  constantValueNode,
  definedTypeNode,
  hiddenPrefixTypeNode,
  numberTypeNode,
  numberValueNode,
  preOffsetTypeNode,
  programNode,
  publicKeyTypeNode,
  remainderOptionTypeNode,
  remainderSizeNode,
  rootNode,
  sizePrefixTypeNode,
  stringTypeNode,
  structFieldTypeNode,
  structTypeNode,
  visit,
  zeroableOptionTypeNode,
} from '../../../src';
import { getRenderMapVisitor } from '../../../src/renderers/js/getRenderMapVisitor';
import { renderMapContains } from './_setup';

test('it emits the zeroableOption helper in shared/index.ts when a type uses it', (t) => {
  // Given a root whose only defined type uses a zeroableOptionTypeNode.
  const node = rootNode([
    programNode({
      name: 'tokenExtensions',
      publicKey: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
      definedTypes: [
        definedTypeNode({
          name: 'mintCloseAuthority',
          type: structTypeNode([
            structFieldTypeNode({
              name: 'closeAuthority',
              type: zeroableOptionTypeNode(publicKeyTypeNode()),
            }),
          ]),
        }),
      ],
    }),
  ]);

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the shared module contains the on-demand zeroableOption helper.
  renderMapContains(t, renderMap, 'shared/index.ts', [
    'export function zeroableOption',
  ]);
});

test('it omits the zeroableOption helper from shared/index.ts when nothing uses it', (t) => {
  // Given a root whose defined type does NOT use zeroableOptionTypeNode.
  const node = rootNode([
    programNode({
      name: 'splMemo',
      publicKey: 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
      definedTypes: [
        definedTypeNode({
          name: 'simple',
          type: structTypeNode([
            structFieldTypeNode({ name: 'value', type: numberTypeNode('u8') }),
          ]),
        }),
      ],
    }),
  ]);

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the shared module exists (other helpers are unconditional) but does
  // NOT include the zeroableOption/remainderOption/sizePrefix helpers. This is
  // the regression test for the ordering bug: if `visitRoot` renders
  // `sharedPage.njk` before the program/type manifests are visited,
  // `sharedSerializers` would still be empty even for the *positive* cases
  // above, and this negative case alone would not catch it. The pairs of
  // tests together pin the correct behavior.
  t.true(renderMap.has('shared/index.ts'));
  const code = renderMap.get('shared/index.ts');
  t.false(
    code.includes('export function zeroableOption'),
    `Expected no zeroableOption helper but found one:\n${code}`
  );
  t.false(
    code.includes('export function remainderOption'),
    `Expected no remainderOption helper but found one:\n${code}`
  );
  t.false(
    code.includes('export function sizePrefix'),
    `Expected no sizePrefix helper but found one:\n${code}`
  );
});

test('it emits the remainderOption helper in shared/index.ts when a type uses it', (t) => {
  // Given a root whose only defined type uses a remainderOptionTypeNode.
  const node = rootNode([
    programNode({
      name: 'tokenExtensions',
      publicKey: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
      definedTypes: [
        definedTypeNode({
          name: 'extra',
          type: structTypeNode([
            structFieldTypeNode({
              name: 'value',
              type: remainderOptionTypeNode(numberTypeNode('u8')),
            }),
          ]),
        }),
      ],
    }),
  ]);

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the shared module contains the on-demand remainderOption helper.
  renderMapContains(t, renderMap, 'shared/index.ts', [
    'export function remainderOption',
  ]);
});

test('it emits the sizePrefix helper in shared/index.ts when a type uses it', (t) => {
  // Given a root whose only defined type uses a sizePrefixTypeNode wrapping a
  // struct (a TLV body).
  const node = rootNode([
    programNode({
      name: 'tokenExtensions',
      publicKey: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
      definedTypes: [
        definedTypeNode({
          name: 'extra',
          type: sizePrefixTypeNode(
            structTypeNode([
              structFieldTypeNode({
                name: 'amount',
                type: numberTypeNode('u64'),
              }),
            ]),
            numberTypeNode('u16')
          ),
        }),
      ],
    }),
  ]);

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the shared module contains the on-demand sizePrefix helper.
  renderMapContains(t, renderMap, 'shared/index.ts', [
    'export function sizePrefix',
  ]);
});

test('it emits the padLeftSerializer helper in shared/index.ts when a type uses it', (t) => {
  // Given a root whose only defined type uses a preOffsetTypeNode (padded strategy).
  const node = rootNode([
    programNode({
      name: 'tokenExtensions',
      publicKey: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
      definedTypes: [
        definedTypeNode({
          name: 'extra',
          type: preOffsetTypeNode(numberTypeNode('u8'), 83, 'padded'),
        }),
      ],
    }),
  ]);

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the shared module contains the on-demand padLeftSerializer helper.
  renderMapContains(t, renderMap, 'shared/index.ts', [
    'export function padLeftSerializer',
  ]);
});

test('it emits the hiddenPrefix helper in shared/index.ts when a type uses it', (t) => {
  // Given a root whose only defined type uses a hiddenPrefixTypeNode.
  const node = rootNode([
    programNode({
      name: 'tokenExtensions',
      publicKey: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
      definedTypes: [
        definedTypeNode({
          name: 'extra',
          type: hiddenPrefixTypeNode(numberTypeNode('u8'), [
            constantValueNode(numberTypeNode('u8'), numberValueNode(1)),
          ]),
        }),
      ],
    }),
  ]);

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the shared module contains the on-demand hiddenPrefix helper.
  renderMapContains(t, renderMap, 'shared/index.ts', [
    'export function hiddenPrefix',
  ]);
});

test('it emits the remainderArray helper in shared/index.ts when a type uses it', (t) => {
  // Given a root whose only defined type uses a remainder-sized array of a
  // variable-size item (a stringTypeNode).
  const node = rootNode([
    programNode({
      name: 'tokenExtensions',
      publicKey: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
      definedTypes: [
        definedTypeNode({
          name: 'extra',
          type: structTypeNode([
            structFieldTypeNode({
              name: 'items',
              type: arrayTypeNode(stringTypeNode(), remainderSizeNode()),
            }),
          ]),
        }),
      ],
    }),
  ]);

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the shared module contains the on-demand remainderArray helper.
  renderMapContains(t, renderMap, 'shared/index.ts', [
    'export function remainderArray',
  ]);
});

test('it omits the remainderArray helper from shared/index.ts when a remainder array item is FIXED-size', (t) => {
  // Given a root whose only defined type uses a remainder-sized array of a
  // FIXED-size item (u8) — the byte-identical legacy path.
  const node = rootNode([
    programNode({
      name: 'tokenExtensions',
      publicKey: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
      definedTypes: [
        definedTypeNode({
          name: 'extra',
          type: structTypeNode([
            structFieldTypeNode({
              name: 'items',
              type: arrayTypeNode(numberTypeNode('u8'), remainderSizeNode()),
            }),
          ]),
        }),
      ],
    }),
  ]);

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the shared module does NOT include the remainderArray helper.
  t.true(renderMap.has('shared/index.ts'));
  const code = renderMap.get('shared/index.ts');
  t.false(
    code.includes('export function remainderArray'),
    `Expected no remainderArray helper but found one:\n${code}`
  );
});

test('it omits the padLeftSerializer/hiddenPrefix helpers from shared/index.ts when nothing uses them', (t) => {
  // Given a root whose defined type does NOT use preOffsetTypeNode or
  // hiddenPrefixTypeNode.
  const node = rootNode([
    programNode({
      name: 'splMemo',
      publicKey: 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
      definedTypes: [
        definedTypeNode({
          name: 'simple',
          type: structTypeNode([
            structFieldTypeNode({ name: 'value', type: numberTypeNode('u8') }),
          ]),
        }),
      ],
    }),
  ]);

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the shared module exists but does NOT include either helper.
  t.true(renderMap.has('shared/index.ts'));
  const code = renderMap.get('shared/index.ts');
  t.false(
    code.includes('export function padLeftSerializer'),
    `Expected no padLeftSerializer helper but found one:\n${code}`
  );
  t.false(
    code.includes('export function hiddenPrefix'),
    `Expected no hiddenPrefix helper but found one:\n${code}`
  );
});
