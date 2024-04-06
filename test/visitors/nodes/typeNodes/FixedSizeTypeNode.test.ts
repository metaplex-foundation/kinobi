import test from 'ava';
import {
  fixedSizeTypeNode,
  remainderSizeNode,
  stringTypeNode,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = fixedSizeTypeNode(
  stringTypeNode({ size: remainderSizeNode() }),
  42
);

test(mergeVisitorMacro, node, 3);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[stringTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[fixedSizeTypeNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
fixedSizeTypeNode [42]
|   stringTypeNode [utf8]
|   |   remainderSizeNode
`
);
