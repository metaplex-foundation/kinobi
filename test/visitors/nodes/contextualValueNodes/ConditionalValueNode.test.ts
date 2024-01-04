import test from 'ava';
import {
  accountValueNode,
  argumentValueNode,
  conditionalValueNode,
  enumValueNode,
  programIdValueNode,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = conditionalValueNode({
  condition: argumentValueNode('tokenStandard'),
  value: enumValueNode('tokenStandard', 'ProgrammableNonFungible'),
  ifTrue: accountValueNode('mint'),
  ifFalse: programIdValueNode(),
});

test(mergeVisitorMacro, node, 6);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[conditionalValueNode]', null);
test(deleteNodesVisitorMacro, node, '[enumValueNode]', {
  ...node,
  value: undefined,
});
test(deleteNodesVisitorMacro, node, '[accountValueNode]', {
  ...node,
  ifTrue: undefined,
});
test(deleteNodesVisitorMacro, node, '[programIdValueNode]', {
  ...node,
  ifFalse: undefined,
});
test(
  deleteNodesVisitorMacro,
  node,
  ['[accountValueNode]', '[programIdValueNode]'],
  null
);
test(
  getDebugStringVisitorMacro,
  node,
  `
conditionalValueNode
|   argumentValueNode [tokenStandard]
|   enumValueNode [programmableNonFungible]
|   |   definedTypeLinkNode [tokenStandard]
|   accountValueNode [mint]
|   programIdValueNode`
);
