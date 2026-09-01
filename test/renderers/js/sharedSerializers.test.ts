import test from 'ava';
import {
  definedTypeNode,
  numberTypeNode,
  programNode,
  publicKeyTypeNode,
  remainderOptionTypeNode,
  rootNode,
  sizePrefixTypeNode,
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
