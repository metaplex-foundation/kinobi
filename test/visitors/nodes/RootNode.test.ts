import test from 'ava';
import { programNode, rootNode } from '../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from './_setup';

const node = rootNode(
  programNode({
    name: 'splToken',
    publicKey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  }),
  [
    programNode({
      name: 'splAddressLookupTable',
      publicKey: 'AddressLookupTab1e1111111111111111111111111',
    }),
  ]
);

test(mergeVisitorMacro, node, 3);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[rootNode]', null);
test(deleteNodesVisitorMacro, node, '[programNode]', null);
test(deleteNodesVisitorMacro, node, '[programNode]splAddressLookupTable', {
  ...node,
  additionalPrograms: [],
});
test(
  getDebugStringVisitorMacro,
  node,
  `
rootNode
|   programNode [splToken.TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA]
|   programNode [splAddressLookupTable.AddressLookupTab1e1111111111111111111111111]`
);
