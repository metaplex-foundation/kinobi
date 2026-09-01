import test from 'ava';
import {
  definedTypeNode,
  numberTypeNode,
  programNode,
  publicKeyTypeNode,
  rootNode,
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
  // NOT include the zeroableOption helper. This is the regression test for
  // the ordering bug: if `visitRoot` renders `sharedPage.njk` before the
  // program/type manifests are visited, `sharedSerializers` would still be
  // empty even for the *positive* case above, and this negative case alone
  // would not catch it. The pair of tests together pin the correct behavior.
  t.true(renderMap.has('shared/index.ts'));
  const code = renderMap.get('shared/index.ts');
  t.false(
    code.includes('export function zeroableOption'),
    `Expected no zeroableOption helper but found one:\n${code}`
  );
});
