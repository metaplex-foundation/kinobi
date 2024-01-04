import test from 'ava';
import { pdaLinkNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = pdaLinkNode('associatedToken', 'splToken');

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[pdaLinkNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `pdaLinkNode [associatedToken.from:splToken]`
);
