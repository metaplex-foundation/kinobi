import test from 'ava';
import { programLinkNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = programLinkNode('mplCandyGuard', 'mplCandyMachine');

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[programLinkNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `programLinkNode [mplCandyGuard.from:mplCandyMachine]`
);
