import test from 'ava';
import { booleanValueNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = booleanValueNode(true);

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[booleanValueNode]', null);
test(getDebugStringVisitorMacro, node, `booleanValueNode [true]`);
