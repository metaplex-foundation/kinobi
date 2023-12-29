import test from 'ava';
import {
  NumberTypeNode,
  PublicKeyTypeNode,
  TupleTypeNode,
  Visitor,
  numberTypeNode,
  publicKeyTypeNode,
  tupleTypeNode,
  visit,
} from '../../src';

test('it can create visitors as plain objects', (t) => {
  // Given the following tree.
  const node = tupleTypeNode([
    numberTypeNode('u32'),
    tupleTypeNode([numberTypeNode('u32'), publicKeyTypeNode()]),
  ]);

  // And a plain object visitor that counts the nodes with different weights.
  const visitor: Visitor<
    number,
    'tupleTypeNode' | 'numberTypeNode' | 'publicKeyTypeNode'
  > = {
    visitTupleType(node) {
      const castedChildren = node.children as (
        | TupleTypeNode
        | NumberTypeNode
        | PublicKeyTypeNode
      )[];
      return castedChildren
        .map((child) => visit(child, this))
        .reduce((a, b) => a + b, 10);
    },
    visitNumberType() {
      return 1;
    },
    visitPublicKeyType() {
      return 2;
    },
  };

  // When we visit the tree using that visitor.
  const result = visit(node, visitor);

  // Then we expect the count.
  t.is(result, 24);
});