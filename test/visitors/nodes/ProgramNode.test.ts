import test from 'ava';
import {
  accountNode,
  definedTypeNode,
  enumTypeNode,
  errorNode,
  instructionNode,
  pdaNode,
  programNode,
  structTypeNode,
} from '../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from './_setup';

const node = programNode({
  name: 'splToken',
  publicKey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  version: '1.2.3',
  pdas: [pdaNode('associatedToken', [])],
  accounts: [
    accountNode({ name: 'mint', data: structTypeNode([]) }),
    accountNode({ name: 'token', data: structTypeNode([]) }),
  ],
  instructions: [
    instructionNode({ name: 'mintTokens' }),
    instructionNode({ name: 'transferTokens' }),
  ],
  definedTypes: [
    definedTypeNode({ name: 'tokenState', type: enumTypeNode([]) }),
  ],
  errors: [
    errorNode({ name: 'invalidMint', code: 1, message: 'Invalid mint' }),
    errorNode({ name: 'invalidToken', code: 2, message: 'Invalid token' }),
  ],
});

test(mergeVisitorMacro, node, 13);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[programNode]', null);
test(deleteNodesVisitorMacro, node, '[pdaNode]', { ...node, pdas: [] });
test(deleteNodesVisitorMacro, node, '[accountNode]', { ...node, accounts: [] });
test(deleteNodesVisitorMacro, node, '[instructionNode]', {
  ...node,
  instructions: [],
});
test(deleteNodesVisitorMacro, node, '[definedTypeNode]', {
  ...node,
  definedTypes: [],
});
test(deleteNodesVisitorMacro, node, '[errorNode]', { ...node, errors: [] });
test(
  getDebugStringVisitorMacro,
  node,
  `
programNode [splToken.TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA]
|   pdaNode [associatedToken]
|   accountNode [mint]
|   |   structTypeNode
|   accountNode [token]
|   |   structTypeNode
|   instructionNode [mintTokens]
|   instructionNode [transferTokens]
|   definedTypeNode [tokenState]
|   |   enumTypeNode
|   |   |   numberTypeNode [u8]
|   errorNode [1.invalidMint]
|   errorNode [2.invalidToken]`
);
