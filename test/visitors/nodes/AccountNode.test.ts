import test from 'ava';
import {
  accountNode,
  deleteNodesVisitor,
  getDebugStringVisitor,
  identityVisitor,
  mergeVisitor,
  numberTypeNode,
  pdaLinkNode,
  publicKeyTypeNode,
  sizeDiscriminatorNode,
  structFieldTypeNode,
  structTypeNode,
  visit,
} from '../../../src';

const node = accountNode({
  name: 'token',
  data: structTypeNode([
    structFieldTypeNode({ name: 'mint', type: publicKeyTypeNode() }),
    structFieldTypeNode({ name: 'owner', type: publicKeyTypeNode() }),
    structFieldTypeNode({ name: 'amount', type: numberTypeNode('u64') }),
  ]),
  pda: pdaLinkNode('associatedToken'),
  discriminators: [sizeDiscriminatorNode(72)],
  size: 72,
});

test('mergeVisitor', (t) => {
  const visitor = mergeVisitor(
    () => 1,
    (_, values) => values.reduce((a, b) => a + b, 1)
  );
  const result = visit(node, visitor);
  t.is(result, 10);
});

test('identityVisitor', (t) => {
  const visitor = identityVisitor();
  const result = visit(node, visitor);
  t.deepEqual(result, node);
  t.not(result, node);
});

test('deleteNodesVisitor', (t) => {
  const visitor = deleteNodesVisitor(['[pdaLinkNode]']);
  const result = visit(node, visitor);
  t.deepEqual(result, { ...node, pda: undefined });
  t.not(result, node);
});

test('getDebugStringVisitor', (t) => {
  const visitor = getDebugStringVisitor({ indent: true });
  const result = visit(node, visitor);
  t.is(
    result,
    `
accountNode [token]
|   structTypeNode
|   |   structFieldTypeNode [mint]
|   |   |   publicKeyTypeNode
|   |   structFieldTypeNode [owner]
|   |   |   publicKeyTypeNode
|   |   structFieldTypeNode [amount]
|   |   |   numberTypeNode [u64]
|   pdaLinkNode [associatedToken]
|   sizeDiscriminatorNode
`.trim()
  );
});
