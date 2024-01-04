import test from 'ava';
import {
  numberTypeNode,
  prefixedSizeNode,
  stringTypeNode,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = stringTypeNode({
  size: prefixedSizeNode(numberTypeNode('u32')),
});

test(mergeVisitorMacro, node, 3);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[stringTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[prefixedSizeNode]', null);
test(deleteNodesVisitorMacro, node, '[numberTypeNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
stringTypeNode [utf8]
|   prefixedSizeNode
|   |   numberTypeNode [u32]`
);

// Different encoding.
test(
  'getDebugStringVisitor: different encoding',
  getDebugStringVisitorMacro,
  stringTypeNode({ encoding: 'base58' }),
  `
stringTypeNode [base58]
|   prefixedSizeNode
|   |   numberTypeNode [u32]`
);
