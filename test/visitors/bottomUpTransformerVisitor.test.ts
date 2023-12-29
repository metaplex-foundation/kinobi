import test from 'ava';
import {
  bottomUpTransformerVisitor,
  isNumberTypeNode,
  isTypeNode,
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

test('it can transform nodes using node selectors', (t) => {
  // Given the following tree.
  const node = tupleTypeNode([
    numberTypeNode('u32'),
    tupleTypeNode([numberTypeNode('u32'), publicKeyTypeNode()]),
  ]);

  // And a transformer visitor that selects all number nodes and transforms them into string nodes.
  const visitor = bottomUpTransformerVisitor([
    {
      select: '[numberTypeNode]',
      transform: () => stringTypeNode(),
    },
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

test('it can create partial transformer visitors', (t) => {
  // Given the following tree.
  const node = tupleTypeNode([
    numberTypeNode('u32'),
    tupleTypeNode([numberTypeNode('u32'), publicKeyTypeNode()]),
  ]);

  // And a transformer visitor that wraps every node into another tuple node
  // but that does not transform public key nodes.
  const visitor = bottomUpTransformerVisitor(
    [(node) => (isTypeNode(node) ? tupleTypeNode([node]) : node)],
    ['tupleTypeNode', 'numberTypeNode']
  );

  // When we visit the tree using that visitor.
  const result = visit(node, visitor);

  // Then we expect the following tree.
  t.deepEqual(
    result,
    tupleTypeNode([
      tupleTypeNode([
        tupleTypeNode([numberTypeNode('u32')]),
        tupleTypeNode([
          tupleTypeNode([
            tupleTypeNode([numberTypeNode('u32')]),
            publicKeyTypeNode(),
          ]),
        ]),
      ]),
    ])
  );

  // And the public key node cannot be visited.
  // @ts-expect-error
  t.throws(() => visit(publicKeyTypeNode(), visitor));
});

test('it can be used to delete nodes', (t) => {
  // Given the following tree.
  const node = tupleTypeNode([
    numberTypeNode('u32'),
    tupleTypeNode([numberTypeNode('u32'), publicKeyTypeNode()]),
  ]);

  // And a transformer visitor that deletes all number nodes.
  const visitor = bottomUpTransformerVisitor([
    { select: '[numberTypeNode]', transform: () => null },
  ]);

  // When we visit the tree using that visitor.
  const result = visit(node, visitor);

  // Then we expect the number nodes to have been deleted.
  t.deepEqual(result, tupleTypeNode([tupleTypeNode([publicKeyTypeNode()])]));
});
