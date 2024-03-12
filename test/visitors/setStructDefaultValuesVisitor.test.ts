import test from 'ava';
import {
  accountNode,
  assertIsNode,
  definedTypeNode,
  instructionArgumentNode,
  instructionNode,
  noneValueNode,
  numberTypeNode,
  numberValueNode,
  optionTypeNode,
  publicKeyTypeNode,
  setStructDefaultValuesVisitor,
  structFieldTypeNode,
  structTypeNode,
  visit,
} from '../../src';

test('it adds new default values to struct fields', (t) => {
  // Given the following person type with no default values.
  const node = definedTypeNode({
    name: 'person',
    type: structTypeNode([
      structFieldTypeNode({
        name: 'age',
        type: numberTypeNode('u32'),
      }),
      structFieldTypeNode({
        name: 'dateOfBirth',
        type: optionTypeNode(numberTypeNode('i64')),
      }),
    ]),
  });

  // When we set default values for the age and dateOfBirth fields of the person type.
  const result = visit(
    node,
    setStructDefaultValuesVisitor({
      person: {
        age: numberValueNode(42),
        dateOfBirth: noneValueNode(),
      },
    })
  );

  // Then we expect the following tree changes.
  assertIsNode(result, 'definedTypeNode');
  assertIsNode(result.type, 'structTypeNode');
  t.deepEqual(result.type.fields[0].defaultValue, numberValueNode(42));
  t.is(result.type.fields[0].defaultValueStrategy, undefined);
  t.deepEqual(result.type.fields[1].defaultValue, noneValueNode());
  t.is(result.type.fields[1].defaultValueStrategy, undefined);
});

test('it adds new default values with custom strategies to struct fields', (t) => {
  // Given the following token account with no default values.
  const node = accountNode({
    name: 'token',
    data: structTypeNode([
      structFieldTypeNode({
        name: 'discriminator',
        type: numberTypeNode('u8'),
      }),
      structFieldTypeNode({
        name: 'delegateAuthority',
        type: optionTypeNode(publicKeyTypeNode()),
      }),
    ]),
  });

  // When we set default values of that account with custom strategies.
  const result = visit(
    node,
    setStructDefaultValuesVisitor({
      token: {
        discriminator: { value: numberValueNode(42), strategy: 'omitted' },
        delegateAuthority: { value: noneValueNode(), strategy: 'optional' },
      },
    })
  );

  // Then we expect the following tree changes.
  assertIsNode(result, 'accountNode');
  t.deepEqual(result.data.fields[0].defaultValue, numberValueNode(42));
  t.is(result.data.fields[0].defaultValueStrategy, 'omitted');
  t.deepEqual(result.data.fields[1].defaultValue, noneValueNode());
  t.is(result.data.fields[1].defaultValueStrategy, 'optional');
});

test('it adds new default values to instruction arguments', (t) => {
  // Given the following instruction node with no default values for its arguments
  const node = instructionNode({
    name: 'transferTokens',
    arguments: [
      instructionArgumentNode({
        name: 'discriminator',
        type: numberTypeNode('u8'),
      }),
      instructionArgumentNode({
        name: 'amount',
        type: numberTypeNode('u64'),
      }),
    ],
  });

  // When we set default values for its arguments.
  const result = visit(
    node,
    setStructDefaultValuesVisitor({
      transferTokens: {
        discriminator: { value: numberValueNode(42), strategy: 'omitted' },
        amount: numberValueNode(1),
      },
    })
  );

  // Then we expect the following tree changes.
  assertIsNode(result, 'instructionNode');
  t.deepEqual(result.arguments[0].defaultValue, numberValueNode(42));
  t.is(result.arguments[0].defaultValueStrategy, 'omitted');
  t.deepEqual(result.arguments[1].defaultValue, numberValueNode(1));
  t.is(result.arguments[1].defaultValueStrategy, undefined);
});
