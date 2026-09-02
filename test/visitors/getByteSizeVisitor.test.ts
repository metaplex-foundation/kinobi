import test from 'ava';
import {
  LinkableDictionary,
  Node,
  Visitor,
  enumEmptyVariantTypeNode,
  enumStructVariantTypeNode,
  enumTupleVariantTypeNode,
  enumTypeNode,
  fixedSizeNode,
  fixedSizeTypeNode,
  getByteSizeVisitor,
  hiddenPrefixTypeNode,
  constantValueNode,
  numberTypeNode,
  numberValueNode,
  preOffsetTypeNode,
  publicKeyTypeNode,
  remainderOptionTypeNode,
  sizePrefixTypeNode,
  stringTypeNode,
  structFieldTypeNode,
  structTypeNode,
  tupleTypeNode,
  visit,
  zeroableOptionTypeNode,
} from '../../src';

const macro = test.macro((t, node: Node, expectedSize: number | null) => {
  t.is(
    visit(
      node,
      getByteSizeVisitor(new LinkableDictionary()) as Visitor<number | null>
    ),
    expectedSize
  );
});

test('it gets the size of public keys', macro, publicKeyTypeNode(), 32);
test('it gets the size of u8 numbers', macro, numberTypeNode('u8'), 1);
test('it gets the size of i8 numbers', macro, numberTypeNode('i8'), 1);
test('it gets the size of u16 numbers', macro, numberTypeNode('u16'), 2);
test('it gets the size of i16 numbers', macro, numberTypeNode('i16'), 2);
test('it gets the size of u32 numbers', macro, numberTypeNode('u32'), 4);
test('it gets the size of i32 numbers', macro, numberTypeNode('i32'), 4);
test('it gets the size of u64 numbers', macro, numberTypeNode('u64'), 8);
test('it gets the size of i64 numbers', macro, numberTypeNode('i64'), 8);
test('it gets the size of u128 numbers', macro, numberTypeNode('u128'), 16);
test('it gets the size of i128 numbers', macro, numberTypeNode('i128'), 16);
test('it gets the size of f32 numbers', macro, numberTypeNode('f32'), 4);
test('it gets the size of f64 numbers', macro, numberTypeNode('f64'), 8);

test(
  'it gets the size of fixed structs',
  macro,
  structTypeNode([
    structFieldTypeNode({ name: 'age', type: numberTypeNode('u32') }),
    structFieldTypeNode({
      name: 'firstname',
      type: stringTypeNode({ size: fixedSizeNode(42) }),
    }),
  ]),
  4 + 42
);
test(
  'it gets the size of variable structs',
  macro,
  structTypeNode([
    structFieldTypeNode({ name: 'age', type: numberTypeNode('u32') }),
    structFieldTypeNode({ name: 'firstname', type: stringTypeNode() }),
  ]),
  null
);
test(
  'it gets the size of scalar enums',
  macro,
  enumTypeNode(
    [
      enumEmptyVariantTypeNode('A'),
      enumEmptyVariantTypeNode('B'),
      enumEmptyVariantTypeNode('C'),
    ],
    { size: numberTypeNode('u64') }
  ),
  8
);
test(
  'it gets the size of fixed data enums',
  macro,
  enumTypeNode(
    [
      enumTupleVariantTypeNode('A', tupleTypeNode([numberTypeNode('u32')])),
      enumStructVariantTypeNode(
        'B',
        structTypeNode([
          structFieldTypeNode({ name: 'x', type: numberTypeNode('u16') }),
          structFieldTypeNode({ name: 'y', type: numberTypeNode('u16') }),
        ])
      ),
    ],
    { size: numberTypeNode('u8') }
  ),
  1 + 4
);
test(
  'it gets the size of variable data enums',
  macro,
  enumTypeNode([
    enumEmptyVariantTypeNode('A'),
    enumTupleVariantTypeNode('B', tupleTypeNode([numberTypeNode('u32')])),
  ]),
  null
);
test(
  'it gets the size of an enum whose struct variant is wrapped in a ' +
    'sizePrefixTypeNode (the Codama TLV-body case)',
  macro,
  enumTypeNode(
    [
      enumStructVariantTypeNode(
        'A',
        sizePrefixTypeNode(
          structTypeNode([
            structFieldTypeNode({ name: 'x', type: numberTypeNode('u16') }),
            structFieldTypeNode({ name: 'y', type: numberTypeNode('u16') }),
          ]),
          numberTypeNode('u16')
        )
      ),
    ],
    { size: numberTypeNode('u8') }
  ),
  // prefix (u8=1) + [sizePrefixTypeNode's own u16 prefix (2) + struct (2+2)]
  1 + (2 + 4)
);
test(
  'it gets a variable size for an enum whose sizePrefixTypeNode-wrapped ' +
    'struct variant contains a variable-size field',
  macro,
  enumTypeNode(
    [
      enumStructVariantTypeNode(
        'A',
        sizePrefixTypeNode(
          structTypeNode([
            structFieldTypeNode({ name: 'name', type: stringTypeNode() }),
          ]),
          numberTypeNode('u16')
        )
      ),
    ],
    { size: numberTypeNode('u8') }
  ),
  null
);

test(
  'it gets the size of fixed size types',
  macro,
  fixedSizeTypeNode(stringTypeNode(), 8),
  8
);
test(
  'it gets the size of zeroable option types',
  macro,
  zeroableOptionTypeNode(publicKeyTypeNode()),
  32
);
test(
  'it gets the size of remainder option types',
  macro,
  remainderOptionTypeNode(numberTypeNode('u8')),
  null
);
test(
  'it gets the size of size-prefixed types with a variable inner type',
  macro,
  sizePrefixTypeNode(stringTypeNode(), numberTypeNode('u32')),
  null
);
test(
  'it gets the size of size-prefixed types with a fixed inner type',
  macro,
  sizePrefixTypeNode(numberTypeNode('u8'), numberTypeNode('u32')),
  5
);
test(
  'it gets the size of pre-offset types',
  macro,
  preOffsetTypeNode(numberTypeNode('u8'), 83, 'padded'),
  null
);
test(
  'it gets the size of hidden prefix types',
  macro,
  hiddenPrefixTypeNode(numberTypeNode('u8'), [
    constantValueNode(numberTypeNode('u8'), numberValueNode(1)),
  ]),
  null
);
