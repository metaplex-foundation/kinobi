import test from 'ava';
import {
  definedTypeNode,
  programNode,
  publicKeyTypeNode,
  rootNode,
  visit,
  zeroableOptionTypeNode,
} from '../../../src';
import { getRenderMapVisitor } from '../../../src/renderers/js/getRenderMapVisitor';
import { codeDoesNotContain, renderMapContains } from './_setup';

const programWith = (type: Parameters<typeof definedTypeNode>[0]['type']) =>
  programNode({
    name: 'myProgram',
    publicKey: '11111111111111111111111111111111',
    definedTypes: [definedTypeNode({ name: 'myType', type })],
  });

test('it emits shared serializer helpers when they are used', (t) => {
  // Given a program using a zeroable option type.
  const node = rootNode(programWith(zeroableOptionTypeNode(publicKeyTypeNode())));

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the shared page contains the helper.
  renderMapContains(t, renderMap, 'shared/index.ts', [
    'export function zeroableOption',
  ]);
});

test('it omits shared serializer helpers when they are unused', (t) => {
  // Given a program using only plain types.
  const node = rootNode(programWith(publicKeyTypeNode()));

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the shared page is unchanged from the legacy output.
  codeDoesNotContain(t, renderMap.get('shared/index.ts'), [
    'zeroableOption',
    'remainderOption',
    'hiddenPrefix',
    'sizePrefix(',
    'padLeftSerializer',
  ]);
  renderMapContains(t, renderMap, 'shared/index.ts', [
    'export function getAccountMetasAndSigners',
  ]);
});
