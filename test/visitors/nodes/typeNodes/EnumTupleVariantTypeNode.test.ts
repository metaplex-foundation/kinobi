import test from 'ava';
import {
  enumEmptyVariantTypeNode,
  enumTupleVariantTypeNode,
  isNode,
  numberTypeNode,
  sizePrefixTypeNode,
  tupleTypeNode,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = enumTupleVariantTypeNode(
  'coordinates',
  tupleTypeNode([numberTypeNode('u32'), numberTypeNode('u32')])
);

test(mergeVisitorMacro, node, 4);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[enumTupleVariantTypeNode]', null);
test(
  deleteNodesVisitorMacro,
  node,
  '[tupleTypeNode]',
  enumEmptyVariantTypeNode('coordinates')
);
test(
  deleteNodesVisitorMacro,
  node,
  '[numberTypeNode]',
  enumEmptyVariantTypeNode('coordinates')
);
test(
  getDebugStringVisitorMacro,
  node,
  `
enumTupleVariantTypeNode [coordinates]
|   tupleTypeNode
|   |   numberTypeNode [u32]
|   |   numberTypeNode [u32]`
);

// Symmetric with EnumStructVariantTypeNode: a Codama-standard IDL may wrap
// the tuple body in a `sizePrefixTypeNode`/`fixedSizeTypeNode` too. No
// variant in the real Token-2022 IDL currently does this, but the node
// shapes are kept symmetric.
const wrappedNode = enumTupleVariantTypeNode(
  'label',
  sizePrefixTypeNode(tupleTypeNode([numberTypeNode('u32')]), numberTypeNode('u16'))
);

test('it keeps a sizePrefixTypeNode wrapper around the tuple body', (t) => {
  t.true(isNode(wrappedNode.tuple, 'sizePrefixTypeNode'));
});

test('identityVisitor: wrapped tuple body', identityVisitorMacro, wrappedNode);
test('mergeVisitor: wrapped tuple body', mergeVisitorMacro, wrappedNode, 5);
test(
  'getDebugStringVisitor: wrapped tuple body',
  getDebugStringVisitorMacro,
  wrappedNode,
  `
enumTupleVariantTypeNode [label]
|   sizePrefixTypeNode
|   |   tupleTypeNode
|   |   |   numberTypeNode [u32]
|   |   numberTypeNode [u16]`
);
