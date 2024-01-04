import test from 'ava';
import {
  mapEntryValueNode,
  publicKeyValueNode,
  stringValueNode,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = mapEntryValueNode(
  stringValueNode('Alice'),
  publicKeyValueNode('GaxDPeNfXXgtwJXwHiDYVSDiM53RchFSRFTn2z2Jztuw')
);

test(mergeVisitorMacro, node, 3);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[mapEntryValueNode]', null);
test(deleteNodesVisitorMacro, node, '[stringValueNode]', null);
test(deleteNodesVisitorMacro, node, '[publicKeyValueNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
mapEntryValueNode
|   stringValueNode [Alice]
|   publicKeyValueNode [GaxDPeNfXXgtwJXwHiDYVSDiM53RchFSRFTn2z2Jztuw]`
);
