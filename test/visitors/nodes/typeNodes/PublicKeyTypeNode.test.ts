import test from 'ava';
import { publicKeyTypeNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = publicKeyTypeNode();

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[publicKeyTypeNode]', null);
test(getDebugStringVisitorMacro, node, `publicKeyTypeNode`);
