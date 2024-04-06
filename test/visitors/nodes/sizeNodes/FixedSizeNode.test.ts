import test from 'ava';
import { fixedCountNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = fixedCountNode(42);

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[fixedCountNode]', null);
test(getDebugStringVisitorMacro, node, `fixedCountNode [42]`);
