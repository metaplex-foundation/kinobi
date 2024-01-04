import test from 'ava';
import {
  accountValueNode,
  argumentValueNode,
  resolverValueNode,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = resolverValueNode('myCustomResolver', {
  importFrom: 'hooked',
  dependsOn: [accountValueNode('mint'), argumentValueNode('tokenStandard')],
});

test(mergeVisitorMacro, node, 3);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[resolverValueNode]', null);
test(
  deleteNodesVisitorMacro,
  node,
  ['[accountValueNode]', '[argumentValueNode]'],
  { ...node, dependsOn: undefined }
);
test(
  getDebugStringVisitorMacro,
  node,
  `
resolverValueNode [myCustomResolver.from:hooked]
|   accountValueNode [mint]
|   argumentValueNode [tokenStandard]`
);
