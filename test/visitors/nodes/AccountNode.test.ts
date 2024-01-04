import test from 'ava';
import {
  accountNode,
  numberTypeNode,
  pdaLinkNode,
  publicKeyTypeNode,
  sizeDiscriminatorNode,
  structFieldTypeNode,
  structTypeNode,
} from '../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from './_setup';

const node = accountNode({
  name: 'token',
  data: structTypeNode([
    structFieldTypeNode({ name: 'mint', type: publicKeyTypeNode() }),
    structFieldTypeNode({ name: 'owner', type: publicKeyTypeNode() }),
    structFieldTypeNode({ name: 'amount', type: numberTypeNode('u64') }),
  ]),
  pda: pdaLinkNode('associatedToken'),
  discriminators: [sizeDiscriminatorNode(72)],
  size: 72,
});

test(mergeVisitorMacro, node, 10);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[accountNode]', null);
test(deleteNodesVisitorMacro, node, '[pdaLinkNode]', {
  ...node,
  pda: undefined,
});
test(
  getDebugStringVisitorMacro,
  node,
  `
accountNode [token]
|   structTypeNode
|   |   structFieldTypeNode [mint]
|   |   |   publicKeyTypeNode
|   |   structFieldTypeNode [owner]
|   |   |   publicKeyTypeNode
|   |   structFieldTypeNode [amount]
|   |   |   numberTypeNode [u64]
|   pdaLinkNode [associatedToken]
|   sizeDiscriminatorNode`
);
