import test from 'ava';
import { programIdPdaSeedNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = programIdPdaSeedNode();

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[programIdPdaSeedNode]', null);
test(getDebugStringVisitorMacro, node, `programIdPdaSeedNode`);
