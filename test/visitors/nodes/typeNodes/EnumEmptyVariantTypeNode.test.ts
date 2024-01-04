import test from 'ava';
import { enumEmptyVariantTypeNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = enumEmptyVariantTypeNode('initialized');

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[enumEmptyVariantTypeNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `enumEmptyVariantTypeNode [initialized]`
);
