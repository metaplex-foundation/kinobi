import test from 'ava';
import { accountValueNode, instructionAccountNode } from '../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from './_setup';

const node = instructionAccountNode({
  name: 'owner',
  isWritable: true,
  isSigner: 'either',
  isOptional: false,
  defaultValue: accountValueNode('authority'),
});

test(mergeVisitorMacro, node, 2);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[instructionAccountNode]', null);
test(deleteNodesVisitorMacro, node, '[accountValueNode]', {
  ...node,
  defaultValue: undefined,
});
test(
  getDebugStringVisitorMacro,
  node,
  `
instructionAccountNode [owner.writable.optionalSigner]
|   accountValueNode [authority]`
);
