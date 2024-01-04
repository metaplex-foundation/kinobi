import test from 'ava';
import { accountLinkNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = accountLinkNode('token', 'splToken');

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[accountLinkNode]', null);
test(getDebugStringVisitorMacro, node, `accountLinkNode [token.from:splToken]`);
