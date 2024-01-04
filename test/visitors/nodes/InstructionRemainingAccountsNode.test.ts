import test from 'ava';
import {
  argumentValueNode,
  instructionRemainingAccountsNode,
} from '../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from './_setup';

const node = instructionRemainingAccountsNode(
  argumentValueNode('remainingAccounts'),
  { isWritable: true, isSigner: 'either' }
);

test(mergeVisitorMacro, node, 2);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[instructionRemainingAccountsNode]', null);
test(deleteNodesVisitorMacro, node, '[argumentValueNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
instructionRemainingAccountsNode [writable.optionalSigner]
|   argumentValueNode [remainingAccounts]`
);
