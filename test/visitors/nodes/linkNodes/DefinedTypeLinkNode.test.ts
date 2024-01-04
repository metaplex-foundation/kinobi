import test from 'ava';
import { definedTypeLinkNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = definedTypeLinkNode('tokenState', 'splToken');

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[definedTypeLinkNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `definedTypeLinkNode [tokenState.from:splToken]`
);
