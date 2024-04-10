import test from 'ava';
import {
  constantPdaSeedNode,
  constantPdaSeedNodeFromProgramId,
  numberTypeNode,
  numberValueNode,
  pdaNode,
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
  constantPdaSeedNode(numberTypeNode('u8'), numberValueNode(123456)),
  variablePdaSeedNode('mint', publicKeyTypeNode()),
]);

test(mergeVisitorMacro, node, 8);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[pdaNode]', null);
test(
  deleteNodesVisitorMacro,
  node,
  ['[variablePdaSeedNode]', '[constantPdaSeedNode]'],
  { ...node, seeds: [] }
);
test(deleteNodesVisitorMacro, node, '[publicKeyTypeNode]', {
  ...node,
  seeds: [constantPdaSeedNode(numberTypeNode('u8'), numberValueNode(123456))],
});
test(
  getDebugStringVisitorMacro,
  node,
  `
pdaNode [associatedToken]
|   variablePdaSeedNode [owner]
|   |   publicKeyTypeNode
|   constantPdaSeedNode
|   |   numberTypeNode [u8]
|   |   numberValueNode [123456]
|   variablePdaSeedNode [mint]
|   |   publicKeyTypeNode`
);
