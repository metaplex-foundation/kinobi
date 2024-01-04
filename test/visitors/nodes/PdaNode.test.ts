import test from 'ava';
import {
  pdaNode,
  programIdPdaSeedNode,
  publicKeyTypeNode,
  variablePdaSeedNode,
} from '../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from './_setup';

const node = pdaNode('associatedToken', [
  variablePdaSeedNode('owner', publicKeyTypeNode()),
  programIdPdaSeedNode(),
  variablePdaSeedNode('mint', publicKeyTypeNode()),
]);

test(mergeVisitorMacro, node, 6);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[pdaNode]', null);
test(
  deleteNodesVisitorMacro,
  node,
  ['[variablePdaSeedNode]', '[programIdPdaSeedNode]'],
  { ...node, seeds: [] }
);
test(deleteNodesVisitorMacro, node, '[publicKeyTypeNode]', {
  ...node,
  seeds: [programIdPdaSeedNode()],
});
test(
  getDebugStringVisitorMacro,
  node,
  `
pdaNode [associatedToken]
|   variablePdaSeedNode [owner]
|   |   publicKeyTypeNode
|   programIdPdaSeedNode
|   variablePdaSeedNode [mint]
|   |   publicKeyTypeNode`
);
