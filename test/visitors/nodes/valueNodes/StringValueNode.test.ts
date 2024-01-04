import test from 'ava';
import { stringValueNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = stringValueNode('Hello world!');

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[stringValueNode]', null);
test(getDebugStringVisitorMacro, node, `stringValueNode [Hello world!]`);
