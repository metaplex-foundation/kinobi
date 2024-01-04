import test from 'ava';
import {
  definedTypeNode,
  fixedSizeNode,
  numberTypeNode,
  stringTypeNode,
  structFieldTypeNode,
  structTypeNode,
} from '../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from './_setup';

const node = definedTypeNode({
  name: 'person',
  type: structTypeNode([
    structFieldTypeNode({
      name: 'name',
      type: stringTypeNode({ size: fixedSizeNode(32) }),
    }),
    structFieldTypeNode({ name: 'age', type: numberTypeNode('u64') }),
  ]),
});

test(mergeVisitorMacro, node, 7);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[structTypeNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
definedTypeNode [person]
|   structTypeNode
|   |   structFieldTypeNode [name]
|   |   |   stringTypeNode [utf8]
|   |   |   |   fixedSizeNode [32]
|   |   structFieldTypeNode [age]
|   |   |   numberTypeNode [u64]`
);
