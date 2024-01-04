import test from 'ava';
import {
  publicKeyTypeNode,
  publicKeyValueNode,
  structFieldTypeNode,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = structFieldTypeNode({
  name: 'owner',
  type: publicKeyTypeNode(),
  defaultValue: publicKeyValueNode(
    'CzC5HidG6kR5J4haV7pKZmenYYVS7rw3SoBkqeStxZ9U'
  ),
});

test(mergeVisitorMacro, node, 3);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[structFieldTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[publicKeyTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[publicKeyValueNode]', {
  ...node,
  defaultValue: undefined,
});
test(
  getDebugStringVisitorMacro,
  node,
  `
structFieldTypeNode [owner]
|   publicKeyTypeNode
|   publicKeyValueNode [CzC5HidG6kR5J4haV7pKZmenYYVS7rw3SoBkqeStxZ9U]`
);
