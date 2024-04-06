import test from 'ava';
import {
  enumEmptyVariantTypeNode,
  enumTypeNode,
  getDebugStringVisitor,
  numberTypeNode,
  optionTypeNode,
  publicKeyTypeNode,
  sizePrefixTypeNode,
  stringTypeNode,
  structFieldTypeNode,
  structTypeNode,
  tupleTypeNode,
  visit,
} from '../../src';

test('it returns a string representing the main information of a node for debugging purposes', (t) => {
  // Given the following tree.
  const node = tupleTypeNode([
    numberTypeNode('u32'),
    structTypeNode([
      structFieldTypeNode({
        name: 'firstname',
        type: sizePrefixTypeNode(stringTypeNode(), numberTypeNode('u64')),
      }),
      structFieldTypeNode({ name: 'age', type: numberTypeNode('u32') }),
      structFieldTypeNode({
        name: 'wallet',
        type: optionTypeNode(publicKeyTypeNode(), {
          prefix: numberTypeNode('u16'),
        }),
      }),
      structFieldTypeNode({
        name: 'industry',
        type: enumTypeNode([
          enumEmptyVariantTypeNode('programming'),
          enumEmptyVariantTypeNode('crypto'),
          enumEmptyVariantTypeNode('music'),
        ]),
      }),
    ]),
  ]);

  // When we get its unique hash string.
  const result = visit(node, getDebugStringVisitor());

  // Then we expect the following string.
  t.deepEqual(
    result,
    'tupleTypeNode(numberTypeNode[u32], structTypeNode(structFieldTypeNode[firstname](stringTypeNode[utf8](prefixedSizeNode(numberTypeNode[u64]))), structFieldTypeNode[age](numberTypeNode[u32]), structFieldTypeNode[wallet](optionTypeNode(numberTypeNode[u16], publicKeyTypeNode)), structFieldTypeNode[industry](enumTypeNode(numberTypeNode[u8], enumEmptyVariantTypeNode[programming], enumEmptyVariantTypeNode[crypto], enumEmptyVariantTypeNode[music]))))'
  );
});

test('it can create indented strings', (t) => {
  // Given the following tree.
  const node = tupleTypeNode([
    numberTypeNode('u32'),
    structTypeNode([
      structFieldTypeNode({
        name: 'firstname',
        type: sizePrefixTypeNode(stringTypeNode(), numberTypeNode('u64')),
      }),
      structFieldTypeNode({ name: 'age', type: numberTypeNode('u32') }),
      structFieldTypeNode({
        name: 'wallet',
        type: optionTypeNode(publicKeyTypeNode(), {
          prefix: numberTypeNode('u16'),
        }),
      }),
      structFieldTypeNode({
        name: 'industry',
        type: enumTypeNode([
          enumEmptyVariantTypeNode('programming'),
          enumEmptyVariantTypeNode('crypto'),
          enumEmptyVariantTypeNode('music'),
        ]),
      }),
    ]),
  ]);

  // When we get its unique hash string.
  const result = visit(node, getDebugStringVisitor({ indent: true }));

  // Then we expect the following string.
  t.deepEqual(
    result,
    `tupleTypeNode
|   numberTypeNode [u32]
|   structTypeNode
|   |   structFieldTypeNode [firstname]
|   |   |   stringTypeNode [utf8]
|   |   |   |   prefixedSizeNode
|   |   |   |   |   numberTypeNode [u64]
|   |   structFieldTypeNode [age]
|   |   |   numberTypeNode [u32]
|   |   structFieldTypeNode [wallet]
|   |   |   optionTypeNode
|   |   |   |   numberTypeNode [u16]
|   |   |   |   publicKeyTypeNode
|   |   structFieldTypeNode [industry]
|   |   |   enumTypeNode
|   |   |   |   numberTypeNode [u8]
|   |   |   |   enumEmptyVariantTypeNode [programming]
|   |   |   |   enumEmptyVariantTypeNode [crypto]
|   |   |   |   enumEmptyVariantTypeNode [music]`
  );
});
