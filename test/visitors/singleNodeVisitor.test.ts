import test from 'ava';
import {
  ProgramNode,
  numberTypeNode,
  publicKeyTypeNode,
  rootNode,
  rootNodeVisitor,
  singleNodeVisitor,
  tupleTypeNode,
  visit,
} from '../../src';

test('it visits a single node and return a custom value', (t) => {
  // Given the following tree.
  const node = tupleTypeNode([
    numberTypeNode('u32'),
    tupleTypeNode([numberTypeNode('u32'), publicKeyTypeNode()]),
  ]);

  // And a visitor that counts the number of direct items in a tuple node.
  const visitor = singleNodeVisitor(
    'tupleTypeNode',
    (node) => node.children.length
  );

  // When we visit the tree using that visitor.
  const result = visit(node, visitor);

  // Then we expect 2 direct items in the tuple node.
  t.deepEqual(result, 2);

  // And no other nodes can be visited.
  // @ts-expect-error
  t.throws(() => visit(numberTypeNode(), visitor));
  // @ts-expect-error
  t.throws(() => visit(publicKeyTypeNode(), visitor));
});

test('it can create rootNode only visitors that return new rootNode instances', (t) => {
  // Given an empty root node.
  const node = rootNode([]);

  // And a root node visitor that adds a program node.
  const visitor = rootNodeVisitor((node) =>
    rootNode([...node.programs, {} as ProgramNode])
  );

  // When we visit the empty root node using that visitor.
  const result = visit(node, visitor);

  // Then we expect the returned root node to have one program node.
  t.deepEqual(result.programs.length, 1);
});
