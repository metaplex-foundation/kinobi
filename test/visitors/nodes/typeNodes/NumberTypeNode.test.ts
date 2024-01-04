import test from 'ava';
import { numberTypeNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = numberTypeNode('f64');

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[numberTypeNode]', null);
test(getDebugStringVisitorMacro, node, `numberTypeNode [f64]`);
test(
  'getDebugStringVisitor: bigEndian',
  getDebugStringVisitorMacro,
  numberTypeNode('f64', 'be'),
  `numberTypeNode [f64.bigEndian]`
);
