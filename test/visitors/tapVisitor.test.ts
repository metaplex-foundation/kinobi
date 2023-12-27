import test from 'ava';
import {
  NumberTypeNode,
  mergeVisitor,
  numberTypeNode,
  publicKeyTypeNode,
  tapVisitor,
  tupleTypeNode,
  visit,
} from '../../src';

test('it returns a new instance of the same visitor whilst tapping into one of its visits', (t) => {
  // Given the following tree.
  const node = tupleTypeNode([
    numberTypeNode('u32'),
    tupleTypeNode([numberTypeNode('u32'), publicKeyTypeNode()]),
  ]);

  // And a sum visitor that counts the nodes.
  const visitor = mergeVisitor(
    () => 1,
    (_, values) => values.reduce((a, b) => a + b, 1)
  );

  // And a tap visitor that taps into the numberTypeNode visit and counts them.
  let numberOfNumberNodes = 0;
  const tappedVisitor = tapVisitor(visitor, 'numberTypeNode', (node) => {
    node satisfies NumberTypeNode;
    numberOfNumberNodes++;
  });

  // When we visit the tree using the tapped visitor.
  const result = visit(node, tappedVisitor);

  // Then we get the expected result.
  t.is(result, 5);

  // And the tapped counter is also correct.
  t.is(numberOfNumberNodes, 2);
});
