import test from 'ava';
import { fixedSizeNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = fixedSizeNode(42);

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[fixedSizeNode]', null);
test(getDebugStringVisitorMacro, node, `fixedSizeNode [42]`);
