import test from 'ava';
import {
  accountValueNode,
  pdaLinkNode,
  pdaSeedValueNode,
  pdaValueNode,
  publicKeyValueNode,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = pdaValueNode(pdaLinkNode('associatedToken'), [
  pdaSeedValueNode('mint', accountValueNode('mint')),
  pdaSeedValueNode(
    'owner',
    publicKeyValueNode('8sphVBHQxufE4Jc1HMuWwWdKgoDjncQyPHwxYhfATRtF')
  ),
]);

test(mergeVisitorMacro, node, 6);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[pdaValueNode]', null);
test(deleteNodesVisitorMacro, node, '[pdaLinkNode]', null);
test(deleteNodesVisitorMacro, node, '[pdaSeedValueNode]', {
  ...node,
  seeds: [],
});
test(
  getDebugStringVisitorMacro,
  node,
  `
pdaValueNode
|   pdaLinkNode [associatedToken]
|   pdaSeedValueNode [mint]
|   |   accountValueNode [mint]
|   pdaSeedValueNode [owner]
|   |   publicKeyValueNode [8sphVBHQxufE4Jc1HMuWwWdKgoDjncQyPHwxYhfATRtF]`
);
