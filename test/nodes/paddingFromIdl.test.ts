import test from 'ava';
import {
  arrayValueNode,
  instructionArgumentNodeFromIdl,
  numberValueNode,
  structFieldTypeNodeFromIdl,
} from '../../src';

//
// structFieldTypeNodeFromIdl
//

test('it sets padding defaults for struct fields with a u8 array', (t) => {
  const node = structFieldTypeNodeFromIdl({
    name: 'padding',
    type: { array: ['u8', 3] },
    attrs: ['padding'],
  });
  t.deepEqual(
    node.defaultValue,
    arrayValueNode([numberValueNode(0), numberValueNode(0), numberValueNode(0)])
  );
  t.is(node.defaultValueStrategy, 'omitted');
});

test('it sets padding defaults for struct fields with a bytes array', (t) => {
  const node = structFieldTypeNodeFromIdl({
    name: 'padding',
    type: { array: ['bytes', 2] },
    attrs: ['padding'],
  });
  t.deepEqual(
    node.defaultValue,
    arrayValueNode([numberValueNode(0), numberValueNode(0)])
  );
  t.is(node.defaultValueStrategy, 'omitted');
});

test('it does not set defaults for struct fields without padding attr', (t) => {
  const node = structFieldTypeNodeFromIdl({
    name: 'count',
    type: 'u8',
  });
  t.is(node.defaultValue, undefined);
  t.is(node.defaultValueStrategy, undefined);
});

test('it does not set defaults for struct fields with other attrs', (t) => {
  const node = structFieldTypeNodeFromIdl({
    name: 'data',
    type: { array: ['u8', 4] },
    attrs: ['something_else'],
  });
  t.is(node.defaultValue, undefined);
  t.is(node.defaultValueStrategy, undefined);
});

test('it throws for struct padding fields with unsupported type', (t) => {
  t.throws(
    () =>
      structFieldTypeNodeFromIdl({
        name: 'padding',
        type: 'u8',
        attrs: ['padding'],
      }),
    { message: /Unsupported padding type/ }
  );
});

test('it throws for struct padding fields with unsupported array element type', (t) => {
  t.throws(
    () =>
      structFieldTypeNodeFromIdl({
        name: 'padding',
        type: { array: ['u64', 3] },
        attrs: ['padding'],
      }),
    { message: /Unsupported padding array element type/ }
  );
});

test('it throws for struct padding fields with invalid array size', (t) => {
  t.throws(
    () =>
      structFieldTypeNodeFromIdl({
        name: 'padding',
        type: { array: ['u8', 0] },
        attrs: ['padding'],
      }),
    { message: /Invalid padding array size/ }
  );
});

//
// instructionArgumentNodeFromIdl
//

test('it sets padding defaults for instruction args with a u8 array', (t) => {
  const node = instructionArgumentNodeFromIdl({
    name: 'padding',
    type: { array: ['u8', 4] },
    attrs: ['padding'],
  });
  t.deepEqual(
    node.defaultValue,
    arrayValueNode([
      numberValueNode(0),
      numberValueNode(0),
      numberValueNode(0),
      numberValueNode(0),
    ])
  );
  t.is(node.defaultValueStrategy, 'omitted');
});

test('it does not set defaults for instruction args without padding attr', (t) => {
  const node = instructionArgumentNodeFromIdl({
    name: 'amount',
    type: 'u64',
  });
  t.is(node.defaultValue, undefined);
  t.is(node.defaultValueStrategy, undefined);
});

test('it throws for instruction arg padding with unsupported type', (t) => {
  t.throws(
    () =>
      instructionArgumentNodeFromIdl({
        name: 'padding',
        type: 'u8',
        attrs: ['padding'],
      }),
    { message: /Unsupported padding type/ }
  );
});

test('it throws for instruction arg padding with unsupported element type', (t) => {
  t.throws(
    () =>
      instructionArgumentNodeFromIdl({
        name: 'padding',
        type: { array: ['publicKey', 2] },
        attrs: ['padding'],
      }),
    { message: /Unsupported padding array element type/ }
  );
});

test('it throws for instruction arg padding with invalid size', (t) => {
  t.throws(
    () =>
      instructionArgumentNodeFromIdl({
        name: 'padding',
        type: { array: ['u8', -1] },
        attrs: ['padding'],
      }),
    { message: /Invalid padding array size/ }
  );
});
