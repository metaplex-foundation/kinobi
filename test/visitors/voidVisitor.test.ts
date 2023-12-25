import test from 'ava';
import {
  numberTypeNode,
  publicKeyTypeNode,
  tupleTypeNode,
  visit,
  voidVisitor,
} from '../../src';

test('it visits all nodes and returns void', (t) => {
  // Given the following 3-nodes tree.
  const node = tupleTypeNode([
    numberTypeNode('u32'),
    tupleTypeNode([numberTypeNode('u32'), publicKeyTypeNode()]),
  ]);

  // And a void visitor overriden such that it counts the number nodes.
  const visitor = voidVisitor();
  const parentVisitNumberType = visitor.visitNumberType;
  let counter = 0;
  visitor.visitNumberType = (node) => {
    counter++;
    return parentVisitNumberType(node);
  };

  // When we visit the tree using that visitor.
  const result = visit(node, visitor);

  // Then we expect the counter to match the amount of number nodes.
  t.is(counter, 2);

  // And a void result.
  t.is(result, undefined);
});
