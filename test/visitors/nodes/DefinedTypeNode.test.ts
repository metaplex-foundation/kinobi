import test from 'ava';
import {
  definedTypeNode,
  fixedSizeTypeNode,
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
      type: fixedSizeTypeNode(stringTypeNode(), 42),
    }),
    structFieldTypeNode({ name: 'age', type: numberTypeNode('u64') }),
  ]),
});

test(mergeVisitorMacro, node, 7);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[definedTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[structTypeNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
definedTypeNode [person]
|   structTypeNode
|   |   structFieldTypeNode [name]
|   |   |   fixedSizeTypeNode [42]
|   |   |   |   stringTypeNode [utf8]
|   |   structFieldTypeNode [age]
|   |   |   numberTypeNode [u64]`
);
