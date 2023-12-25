import test from 'ava';
import {
  bottomUpTransformerVisitor,
  isNumberTypeNode,
  numberTypeNode,
  publicKeyTypeNode,
  stringTypeNode,
  tupleTypeNode,
  visit,
} from '../../src';

test('it can transform nodes into other nodes', (t) => {
  // Given the following tree.
  const node = tupleTypeNode([
    numberTypeNode('u32'),
    tupleTypeNode([numberTypeNode('u32'), publicKeyTypeNode()]),
  ]);

  // And a transformer visitor that transforms all number nodes into string nodes.
  const visitor = bottomUpTransformerVisitor([
    (node) => (isNumberTypeNode(node) ? stringTypeNode() : node),
  ]);

  // When we visit the tree using that visitor.
  const result = visit(node, visitor);

  // Then we expect the number nodes to have been transformed into string nodes.
  t.deepEqual(
    result,
    tupleTypeNode([
      stringTypeNode(),
      tupleTypeNode([stringTypeNode(), publicKeyTypeNode()]),
    ])
  );
});

test.todo('it can transform nodes using node selectors');

test.todo('it can create partial transformer visitors');
