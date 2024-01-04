import test from 'ava';
import { sizeDiscriminatorNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = sizeDiscriminatorNode(42);

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[sizeDiscriminatorNode]', null);
test(getDebugStringVisitorMacro, node, `sizeDiscriminatorNode [42]`);
