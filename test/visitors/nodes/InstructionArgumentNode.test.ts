import test from 'ava';
import {
  instructionArgumentNode,
  numberTypeNode,
  numberValueNode,
} from '../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from './_setup';

const node = instructionArgumentNode({
  name: 'amount',
  type: numberTypeNode('u64'),
  defaultValue: numberValueNode(1),
});

test(mergeVisitorMacro, node, 3);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[instructionArgumentNode]', null);
test(deleteNodesVisitorMacro, node, '[numberTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[numberValueNode]', {
  ...node,
  defaultValue: undefined,
});
test(
  getDebugStringVisitorMacro,
  node,
  `
instructionArgumentNode [amount]
|   numberTypeNode [u64]
|   numberValueNode [1]`
);
