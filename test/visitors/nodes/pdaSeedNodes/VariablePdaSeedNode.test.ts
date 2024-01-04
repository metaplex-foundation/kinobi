import test from 'ava';
import { publicKeyTypeNode, variablePdaSeedNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = variablePdaSeedNode('mint', publicKeyTypeNode());

test(mergeVisitorMacro, node, 2);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[variablePdaSeedNode]', null);
test(deleteNodesVisitorMacro, node, '[publicKeyTypeNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
variablePdaSeedNode [mint]
|   publicKeyTypeNode`
);
