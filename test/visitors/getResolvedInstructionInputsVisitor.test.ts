import test from 'ava';
import {
  accountValueNode,
  getResolvedInstructionInputsVisitor,
  instructionAccountNode,
  instructionArgumentNode,
  instructionNode,
  numberTypeNode,
  publicKeyTypeNode,
  visit,
} from '../../src';

test('it returns all instruction accounts in order of resolution', (t) => {
  // Given the following instruction node with an account that defaults to another account.
  const node = instructionNode({
    name: 'myInstruction',
    accounts: [
      instructionAccountNode({
        name: 'owner',
        isSigner: true,
        isWritable: false,
        defaultValue: accountValueNode('authority'),
      }),
      instructionAccountNode({
        name: 'authority',
        isSigner: true,
        isWritable: false,
      }),
    ],
  });

  // When we get its resolved inputs.
  const result = visit(node, getResolvedInstructionInputsVisitor());

  // Then we expect the accounts to be in order of resolution.
  t.deepEqual(result, [
    {
      ...node.accounts[1],
      isPda: false,
      dependsOn: [],
      resolvedIsOptional: false,
      resolvedIsSigner: true,
    },
    {
      ...node.accounts[0],
      isPda: false,
      dependsOn: [accountValueNode('authority')],
      resolvedIsOptional: false,
      resolvedIsSigner: true,
    },
  ]);
});

test('it sets the resolved signer to either when a non signer defaults to a signer account', (t) => {
  // Given the following instruction node such that a non signer account defaults to a signer account.
  const node = instructionNode({
    name: 'myInstruction',
    accounts: [
      instructionAccountNode({
        name: 'owner',
        isSigner: false,
        isWritable: false,
        defaultValue: accountValueNode('authority'),
      }),
      instructionAccountNode({
        name: 'authority',
        isSigner: true,
        isWritable: false,
      }),
    ],
  });

  // When we get its resolved inputs.
  const result = visit(node, getResolvedInstructionInputsVisitor());

  // Then we expect the resolved signer to be either for the non signer account.
  t.deepEqual(result[1], {
    ...node.accounts[0],
    isPda: false,
    dependsOn: [accountValueNode('authority')],
    resolvedIsOptional: false,
    resolvedIsSigner: 'either',
  });
});

test('it sets the resolved signer to either when a signer defaults to a non signer account', (t) => {
  // Given the following instruction node such that a signer account defaults to a non signer account.
  const node = instructionNode({
    name: 'myInstruction',
    accounts: [
      instructionAccountNode({
        name: 'owner',
        isSigner: true,
        isWritable: false,
        defaultValue: accountValueNode('authority'),
      }),
      instructionAccountNode({
        name: 'authority',
        isSigner: false,
        isWritable: false,
      }),
    ],
  });

  // When we get its resolved inputs.
  const result = visit(node, getResolvedInstructionInputsVisitor());

  // Then we expect the resolved signer to be either for the signer account.
  t.deepEqual(result[1], {
    ...node.accounts[0],
    isPda: false,
    dependsOn: [accountValueNode('authority')],
    resolvedIsOptional: false,
    resolvedIsSigner: 'either',
  });
});

test('it includes instruction data arguments with default values', (t) => {
  // Given the following instruction node with two arguments such that:
  // - The first argument defaults to an account.
  // - The second argument has no default value.
  const node = instructionNode({
    name: 'myInstruction',
    accounts: [
      instructionAccountNode({
        name: 'owner',
        isSigner: true,
        isWritable: false,
      }),
    ],
    arguments: [
      instructionArgumentNode({
        name: 'ownerArg',
        type: publicKeyTypeNode(),
        defaultValue: accountValueNode('owner'),
      }),
      instructionArgumentNode({
        name: 'argWithoutDefaults',
        type: numberTypeNode('u8'),
      }),
    ],
  });

  // When we get its resolved inputs.
  const result = visit(node, getResolvedInstructionInputsVisitor());

  // Then we expect the following inputs.
  t.deepEqual(result, [
    {
      ...node.accounts[0],
      isPda: false,
      dependsOn: [],
      resolvedIsOptional: false,
      resolvedIsSigner: true,
    },
    {
      ...node.arguments[0],
      dependsOn: [accountValueNode('owner')],
    },
  ]);

  // And the argument without default value is not included.
  t.false(result.some((input) => input.name === 'argWithoutDefaults'));
});

test('it includes instruction extra arguments with default values', (t) => {
  // Given the following instruction node with two extra arguments such that:
  // - The first argument defaults to an account.
  // - The second argument has no default value.
  const node = instructionNode({
    name: 'myInstruction',
    accounts: [
      instructionAccountNode({
        name: 'owner',
        isSigner: true,
        isWritable: false,
      }),
    ],
    extraArguments: [
      instructionArgumentNode({
        name: 'ownerArg',
        type: publicKeyTypeNode(),
        defaultValue: accountValueNode('owner'),
      }),
      instructionArgumentNode({
        name: 'argWithoutDefaults',
        type: numberTypeNode('u8'),
      }),
    ],
  });

  // When we get its resolved inputs.
  const result = visit(node, getResolvedInstructionInputsVisitor());

  // Then we expect the following inputs.
  t.deepEqual(result, [
    {
      ...node.accounts[0],
      isPda: false,
      dependsOn: [],
      resolvedIsOptional: false,
      resolvedIsSigner: true,
    },
    {
      ...node.extraArguments![0],
      dependsOn: [accountValueNode('owner')],
    },
  ]);

  // And the argument without default value is not included.
  t.false(result.some((input) => input.name === 'argWithoutDefaults'));
});

test('it returns an empty array for empty instructions', (t) => {
  // Given the following empty instruction node.
  const node = instructionNode({ name: 'myInstruction' });

  // When we get its resolved inputs.
  const result = visit(node, getResolvedInstructionInputsVisitor());

  // Then we expect an empty array.
  t.deepEqual(result, []);
});
