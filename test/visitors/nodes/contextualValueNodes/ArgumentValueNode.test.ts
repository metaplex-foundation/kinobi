import test from 'ava';
import { argumentValueNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = argumentValueNode('space');

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[argumentValueNode]', null);
test(getDebugStringVisitorMacro, node, `argumentValueNode [space]`);
