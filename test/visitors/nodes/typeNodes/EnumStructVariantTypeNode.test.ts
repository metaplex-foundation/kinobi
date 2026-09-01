import test from 'ava';
import {
  enumEmptyVariantTypeNode,
  enumStructVariantTypeNode,
  isNode,
  numberTypeNode,
  sizePrefixTypeNode,
  structFieldTypeNode,
  structTypeNode,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = enumStructVariantTypeNode(
  'mouseClick',
  structTypeNode([
    structFieldTypeNode({ name: 'x', type: numberTypeNode('u32') }),
    structFieldTypeNode({ name: 'y', type: numberTypeNode('u32') }),
  ])
);

test(mergeVisitorMacro, node, 6);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[enumStructVariantTypeNode]', null);
test(
  deleteNodesVisitorMacro,
  node,
  '[structTypeNode]',
  enumEmptyVariantTypeNode('mouseClick')
);
test(
  deleteNodesVisitorMacro,
  node,
  '[structFieldTypeNode]',
  enumEmptyVariantTypeNode('mouseClick')
);
test(
  getDebugStringVisitorMacro,
  node,
  `
enumStructVariantTypeNode [mouseClick]
|   structTypeNode
|   |   structFieldTypeNode [x]
|   |   |   numberTypeNode [u32]
|   |   structFieldTypeNode [y]
|   |   |   numberTypeNode [u32]`
);

// A Codama-standard IDL may wrap the struct body in a
// `sizePrefixTypeNode`/`fixedSizeTypeNode` (e.g. a TLV length-prefixed
// extension body); that wrapper carries real byte-layout information and
// must survive canonicalization rather than be unwrapped away.
const wrappedNode = enumStructVariantTypeNode(
  'tokenMetadata',
  sizePrefixTypeNode(
    structTypeNode([
      structFieldTypeNode({ name: 'updateAuthority', type: numberTypeNode('u32') }),
    ]),
    numberTypeNode('u16')
  )
);

test('it keeps a sizePrefixTypeNode wrapper around the struct body', (t) => {
  t.true(isNode(wrappedNode.struct, 'sizePrefixTypeNode'));
});

test('identityVisitor: wrapped struct body', identityVisitorMacro, wrappedNode);
test('mergeVisitor: wrapped struct body', mergeVisitorMacro, wrappedNode, 6);
test(
  'getDebugStringVisitor: wrapped struct body',
  getDebugStringVisitorMacro,
  wrappedNode,
  `
enumStructVariantTypeNode [tokenMetadata]
|   sizePrefixTypeNode
|   |   structTypeNode
|   |   |   structFieldTypeNode [updateAuthority]
|   |   |   |   numberTypeNode [u32]
|   |   numberTypeNode [u16]`
);
