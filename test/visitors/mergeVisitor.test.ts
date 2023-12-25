import test from 'ava';
import {
  mergeVisitor,
  numberTypeNode,
  publicKeyTypeNode,
  tupleTypeNode,
  visit,
} from '../../src';

// This visitor sets the node kind for all leaves and combines
// them together such that each node lists the kind of its children.
const mergeKindVisitor = mergeVisitor(
  (node) => node.kind as string,
  (node, values) => `${node.kind}(${values.join(',')})`
);

test('it sets a value for all leaves and merges node values together', async (t) => {
  // Given the following 3-nodes tree.
  const node = tupleTypeNode([numberTypeNode('u32'), publicKeyTypeNode()]);

  // When we visit the tree with the mergeKindVisitor.
  const result = visit(node, mergeKindVisitor);

  // Then we get the following result.
  t.is(result, 'tupleTypeNode(numberTypeNode,publicKeyTypeNode)');
});

test('it can be used to count nodes', async (t) => {
  // Given the following 3-nodes tree.
  const node = tupleTypeNode([numberTypeNode('u32'), publicKeyTypeNode()]);

  // When we visit the tree with a visitor that counts nodes.
  const visitor = mergeVisitor(
    () => 1,
    (_, values) => values.reduce((a, b) => a + b, 1)
  );
  const result = visit(node, visitor);

  // Then we expect to have 3 nodes.
  t.is(result, 3);
});
