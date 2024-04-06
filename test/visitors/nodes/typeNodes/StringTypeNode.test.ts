import test from 'ava';
import { stringTypeNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = stringTypeNode();

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[stringTypeNode]', null);
test(getDebugStringVisitorMacro, node, `stringTypeNode [utf8]`);

// Different encoding.
test(
  'getDebugStringVisitor: different encoding',
  getDebugStringVisitorMacro,
  stringTypeNode('base58'),
  `stringTypeNode [base58]`
);
