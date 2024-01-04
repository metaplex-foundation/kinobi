import test from 'ava';
import { instructionByteDeltaNode, numberValueNode } from '../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from './_setup';

const node = instructionByteDeltaNode(numberValueNode(42), {
  subtract: true,
});

test(mergeVisitorMacro, node, 2);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[instructionByteDeltaNode]', null);
test(deleteNodesVisitorMacro, node, '[numberValueNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
instructionByteDeltaNode [subtract.withHeader]
|   numberValueNode [42]`
);
