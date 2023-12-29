import test from 'ava';
import {
  DefinedTypeNode,
  NumberTypeNode,
  definedTypeNode,
  mergeVisitor,
  numberTypeNode,
  programNode,
  publicKeyTypeNode,
  rootNode,
  structTypeNode,
  tapDefinedTypesVisitor,
  tapVisitor,
  tupleTypeNode,
  visit,
  voidVisitor,
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

  // And the tapped visitor is a new instance.
  t.not(visitor, tappedVisitor);
});

test('it can extract all defined types from the root visit', (t) => {
  // Given a root node with the following defined types.
  const node = rootNode([
    programNode({
      name: 'programA',
      publicKey: '1111',
      version: 'v1.0.0',
      accounts: [],
      instructions: [],
      definedTypes: [
        definedTypeNode({ name: 'typeA', data: structTypeNode([]) }),
        definedTypeNode({ name: 'typeB', data: structTypeNode([]) }),
      ],
      errors: [],
    }),
    programNode({
      name: 'programA',
      publicKey: '1111',
      version: 'v1.0.0',
      accounts: [],
      instructions: [],
      definedTypes: [
        definedTypeNode({ name: 'typeC', data: structTypeNode([]) }),
      ],
      errors: [],
    }),
  ]);

  // And a tapped visitor that extract all defined types.
  let extractedDefinedTypes: DefinedTypeNode[] = [];
  const tappedVisitor = tapDefinedTypesVisitor(
    voidVisitor(),
    (definedTypes) => {
      extractedDefinedTypes = definedTypes;
    }
  );

  // When we visit the tree using the tapped visitor.
  visit(node, tappedVisitor);

  // Then we expect the following extracted defined types.
  t.deepEqual(extractedDefinedTypes, [
    node.programs[0].definedTypes[0],
    node.programs[0].definedTypes[1],
    node.programs[1].definedTypes[0],
  ]);
});
