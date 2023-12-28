import test from 'ava';
import {
  extendVisitor,
  mergeVisitor,
  numberTypeNode,
  publicKeyTypeNode,
  tupleTypeNode,
  visit,
} from '../../src';

test('it returns a new visitor that extends a subset of visits', (t) => {
  // Given the following 3-nodes tree.
  const node = tupleTypeNode([
    numberTypeNode('u32'),
    tupleTypeNode([numberTypeNode('u64'), publicKeyTypeNode()]),
  ]);

  // And an extended sum visitor that adds an extra 10 to tuple and public key nodes.
  const baseVisitor = mergeVisitor(
    () => 1,
    (_, values) => values.reduce((a, b) => a + b, 1)
  );
  const visitor = extendVisitor(baseVisitor, {
    // @ts-ignore
    visitTupleType: (node, next) => next(node) + 10,
    // @ts-ignore
    visitPublicKeyType: (node, next) => next(node) + 10,
  });

  // When we visit the tree using that visitor.
  const result = visit(node, visitor);

  // Then we expect the following count.
  t.is(result, 35);

  // And the extended visitor is a new instance.
  t.not(baseVisitor, visitor);
});

test.todo('it cannot extends nodes that are not supported by the base visitor');
