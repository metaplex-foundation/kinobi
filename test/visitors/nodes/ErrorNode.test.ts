import test from 'ava';
import { errorNode } from '../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from './_setup';

const node = errorNode({
  name: 'InvalidTokenOwner',
  code: 42,
  message:
    'The provided account does not match the owner of the token account.',
});

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[errorNode]', null);
test(getDebugStringVisitorMacro, node, `errorNode [42.invalidTokenOwner]`);
