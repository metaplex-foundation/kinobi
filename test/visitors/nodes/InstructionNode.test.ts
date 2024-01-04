import test from 'ava';
import {
  fieldDiscriminatorNode,
  instructionAccountNode,
  instructionArgumentNode,
  instructionByteDeltaNode,
  instructionNode,
  instructionRemainingAccountsNode,
  numberTypeNode,
  numberValueNode,
  publicKeyTypeNode,
  resolverValueNode,
} from '../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from './_setup';

const node = instructionNode({
  name: 'transferSol',
  accounts: [
    instructionAccountNode({
      name: 'source',
      isWritable: true,
      isSigner: true,
    }),
    instructionAccountNode({
      name: 'destination',
      isWritable: true,
      isSigner: false,
    }),
  ],
  arguments: [
    instructionArgumentNode({
      name: 'discriminator',
      type: numberTypeNode('u32'),
    }),
    instructionArgumentNode({
      name: 'amount',
      type: numberTypeNode('u64'),
    }),
  ],
  discriminators: [fieldDiscriminatorNode('discriminator')],
});

test(mergeVisitorMacro, node, 8);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[instructionNode]', null);
test(deleteNodesVisitorMacro, node, '[instructionAccountNode]', {
  ...node,
  accounts: [],
});
test(deleteNodesVisitorMacro, node, '[instructionArgumentNode]', {
  ...node,
  arguments: [],
});
test(deleteNodesVisitorMacro, node, '[fieldDiscriminatorNode]', {
  ...node,
  discriminators: [],
});
test(
  getDebugStringVisitorMacro,
  node,
  `
instructionNode [transferSol]
|   instructionAccountNode [source.writable.signer]
|   instructionAccountNode [destination.writable]
|   instructionArgumentNode [discriminator]
|   |   numberTypeNode [u32]
|   instructionArgumentNode [amount]
|   |   numberTypeNode [u64]
|   fieldDiscriminatorNode [discriminator]`
);

// Extra arguments.
const nodeWithExtraArguments = instructionNode({
  name: 'myInstruction',
  extraArguments: [
    instructionArgumentNode({
      name: 'myExtraArgument',
      type: publicKeyTypeNode(),
    }),
  ],
});
test(
  'mergeVisitor: extraArguments',
  mergeVisitorMacro,
  nodeWithExtraArguments,
  3
);
test(
  'identityVisitor: extraArguments',
  identityVisitorMacro,
  nodeWithExtraArguments
);

// Remaining accounts.
const nodeWithRemainingAccounts = instructionNode({
  name: 'myInstruction',
  remainingAccounts: [
    instructionRemainingAccountsNode(resolverValueNode('myResolver')),
  ],
});
test(
  'mergeVisitor: remainingAccounts',
  mergeVisitorMacro,
  nodeWithRemainingAccounts,
  3
);
test(
  'identityVisitor: remainingAccounts',
  identityVisitorMacro,
  nodeWithRemainingAccounts
);

// Byte deltas.
const nodeWithByteDeltas = instructionNode({
  name: 'myInstruction',
  byteDeltas: [instructionByteDeltaNode(numberValueNode(42))],
});
test('mergeVisitor: byteDeltas', mergeVisitorMacro, nodeWithByteDeltas, 3);
test('identityVisitor: byteDeltas', identityVisitorMacro, nodeWithByteDeltas);

// Sub-instructions.
const nodeWithSubInstructions = instructionNode({
  name: 'myInstruction',
  subInstructions: [
    instructionNode({ name: 'mySubInstruction1' }),
    instructionNode({ name: 'mySubInstruction2' }),
  ],
});
test(
  'mergeVisitor: subInstructions',
  mergeVisitorMacro,
  nodeWithSubInstructions,
  3
);
test(
  'identityVisitor: subInstructions',
  identityVisitorMacro,
  nodeWithSubInstructions
);
