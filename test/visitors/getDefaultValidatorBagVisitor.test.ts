import test from 'ava';
import {
  NodeStack,
  ValidatorBag,
  getDefaultValidatorBagVisitor,
  programNode,
  publicKeyTypeNode,
  structFieldTypeNode,
  structTypeNode,
  tupleTypeNode,
  visit,
} from '../../src';

test('it validates program nodes', (t) => {
  // Given the following program node with empty strings.
  const node = programNode({
    name: '',
    publicKey: '',
    version: '',
    origin: undefined,
    accounts: [],
    instructions: [],
    definedTypes: [],
    errors: [],
  });

  // When we validate it using the default validator bag visitor.
  const bag = visit(node, getDefaultValidatorBagVisitor());

  // Then we expect the following validation errors.
  const stack = new NodeStack([]);
  t.deepEqual(
    bag,
    new ValidatorBag()
      .error('Program has no name.', node, stack)
      .error('Program has no public key.', node, stack)
      .warn('Program has no version.', node, stack)
      .info('Program has no origin.', node, stack)
  );
});

test('it validates nested nodes', (t) => {
  // Given the following tuple with nested issues.
  const node = tupleTypeNode([
    tupleTypeNode([]),
    structTypeNode([
      structFieldTypeNode({ name: 'owner', type: publicKeyTypeNode() }),
      structFieldTypeNode({ name: 'owner', type: publicKeyTypeNode() }),
    ]),
  ]);

  // When we validate it using the default validator bag visitor.
  const bag = visit(node, getDefaultValidatorBagVisitor());

  // Then we expect the following validation errors.
  const tupleNode = node.children[0];
  const structNode = node.children[1];
  t.deepEqual(
    bag,
    new ValidatorBag()
      .warn('Tuple has no items.', tupleNode, new NodeStack([node]))
      .error(
        'Struct field name "owner" is not unique.',
        structNode.fields[0],
        new NodeStack([node])
      )
  );
});
