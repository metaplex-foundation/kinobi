import test from 'ava';
import { stringValueNode, structFieldValueNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = structFieldValueNode('name', stringValueNode('Alice'));

test(mergeVisitorMacro, node, 2);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[structFieldValueNode]', null);
test(deleteNodesVisitorMacro, node, '[stringValueNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
structFieldValueNode [name]
|   stringValueNode [Alice]`
);
