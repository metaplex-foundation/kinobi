import test from 'ava';
import { fieldDiscriminatorNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = fieldDiscriminatorNode('discriminator', 42);

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[fieldDiscriminatorNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `fieldDiscriminatorNode [discriminator.offset:42]`
);
