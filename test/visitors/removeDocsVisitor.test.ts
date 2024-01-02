import test from 'ava';
import {
  numberTypeNode,
  publicKeyTypeNode,
  removeDocsVisitor,
  structFieldTypeNode,
  structTypeNode,
  visit,
} from '../../src';

test('it empties the docs array of any node that contains docs', (t) => {
  // Given the following struct node with docs.
  const node = structTypeNode([
    structFieldTypeNode({
      name: 'owner',
      type: publicKeyTypeNode(),
      docs: ['The owner of the account.'],
    }),
    structFieldTypeNode({
      name: 'authority',
      type: publicKeyTypeNode(),
      docs: ['The wallet allowed to modify the account.'],
    }),
    structFieldTypeNode({
      name: 'amount',
      type: numberTypeNode('u64'),
      docs: ['The amount of tokens in basis points.'],
    }),
  ]);

  // When we remove the docs from the node.
  const result = visit(node, removeDocsVisitor());

  // Then we expect the following node.
  t.deepEqual(
    result,
    structTypeNode([
      structFieldTypeNode({
        name: 'owner',
        type: publicKeyTypeNode(),
        docs: [],
      }),
      structFieldTypeNode({
        name: 'authority',
        type: publicKeyTypeNode(),
        docs: [],
      }),
      structFieldTypeNode({
        name: 'amount',
        type: numberTypeNode('u64'),
        docs: [],
      }),
    ])
  );
});

test('it can create partial visitors', (t) => {
  // Given the following struct node with docs.
  const node = structTypeNode([
    structFieldTypeNode({
      name: 'owner',
      type: publicKeyTypeNode(),
      docs: ['The owner of the account.'],
    }),
  ]);

  // And a remove docs visitor that only supports struct type nodes.
  const visitor = removeDocsVisitor(['structTypeNode']);

  // When we use it on our struct node.
  const result = visit(node, visitor);

  // Then we expect the same node back.
  t.deepEqual(result, node);

  // And we expect an error when visiting an unsupported node.
  // @ts-expect-error
  t.throws(() => visit(node.fields[1], visitor));
});
