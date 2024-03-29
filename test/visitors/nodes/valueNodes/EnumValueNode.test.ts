import test from 'ava';
import {
  definedTypeLinkNode,
  enumValueNode,
  numberValueNode,
  stringValueNode,
  structFieldValueNode,
  structValueNode,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = enumValueNode(
  definedTypeLinkNode('entity'),
  'person',
  structValueNode([
    structFieldValueNode('name', stringValueNode('Alice')),
    structFieldValueNode('age', numberValueNode(42)),
  ])
);

test(mergeVisitorMacro, node, 7);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[enumValueNode]', null);
test(deleteNodesVisitorMacro, node, '[definedTypeLinkNode]', null);
test(deleteNodesVisitorMacro, node, '[structValueNode]', {
  ...node,
  value: undefined,
});
test(
  getDebugStringVisitorMacro,
  node,
  `
enumValueNode [person]
|   definedTypeLinkNode [entity]
|   structValueNode
|   |   structFieldValueNode [name]
|   |   |   stringValueNode [Alice]
|   |   structFieldValueNode [age]
|   |   |   numberValueNode [42]`
);
