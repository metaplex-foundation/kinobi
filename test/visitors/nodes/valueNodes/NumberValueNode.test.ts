import test from 'ava';
import { numberValueNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = numberValueNode(42);

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[numberValueNode]', null);
test(getDebugStringVisitorMacro, node, `numberValueNode [42]`);
