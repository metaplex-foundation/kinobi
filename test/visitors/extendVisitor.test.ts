import test from 'ava';
import {
  extendVisitor,
  mergeVisitor,
  numberTypeNode,
  publicKeyTypeNode,
  tupleTypeNode,
  visit,
  voidVisitor,
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
    visitTupleType: (node, next) => next(node) + 10,
    visitPublicKeyType: (node, next) => next(node) + 10,
  });

  // When we visit the tree using that visitor.
  const result = visit(node, visitor);

  // Then we expect the following count.
  t.is(result, 35);

  // And the extended visitor is a new instance.
  t.not(baseVisitor, visitor);
});

test('it cannot extends nodes that are not supported by the base visitor', (t) => {
  // Given the following 3-nodes tree.
  const node = tupleTypeNode([
    numberTypeNode('u32'),
    tupleTypeNode([numberTypeNode('u64'), publicKeyTypeNode()]),
  ]);

  // And a base visitor that only supports tuple nodes.
  const baseVisitor = voidVisitor(['tupleTypeNode']);

  // Then we expect an error when we try to extend other nodes for that visitor.
  t.throws(
    () =>
      extendVisitor(baseVisitor, {
        // @ts-expect-error
        visitNumberType: () => undefined,
      }),
    {
      message:
        'Cannot extend visitor with function "visitNumberType" as the base visitor does not support it.',
    }
  );
});
