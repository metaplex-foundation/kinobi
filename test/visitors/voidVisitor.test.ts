import test from 'ava';
import {
  numberTypeNode,
  publicKeyTypeNode,
  tupleTypeNode,
  visit,
  voidVisitor,
} from '../../src';

test('it visits all nodes and returns void', (t) => {
  // Given the following tree.
  const node = tupleTypeNode([
    numberTypeNode('u32'),
    tupleTypeNode([numberTypeNode('u32'), publicKeyTypeNode()]),
  ]);

  // And a void visitor overriden such that it counts the tuple nodes.
  const visitor = voidVisitor();
  const parentVisitTupleType = visitor.visitTupleType;
  let counter = 0;
  visitor.visitTupleType = (node) => {
    counter++;
    return parentVisitTupleType(node);
  };

  // When we visit the tree using that visitor.
  const result = visit(node, visitor);

  // Then we expect the counter to match the amount of tuple nodes.
  t.is(counter, 2);

  // And a void result.
  t.is(result, undefined);
});
