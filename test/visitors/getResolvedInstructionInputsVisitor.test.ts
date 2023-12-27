import test from 'ava';
import {
  accountDefault,
  getResolvedInstructionInputsVisitor,
  instructionAccountNode,
  instructionDataArgsNode,
  instructionExtraArgsNode,
  instructionNode,
  numberTypeNode,
  publicKeyTypeNode,
  structFieldTypeNode,
  structTypeNode,
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
        defaultsTo: accountDefault('authority'),
      }),
      instructionAccountNode({
        name: 'authority',
        isSigner: true,
        isWritable: false,
      }),
    ],
    dataArgs: instructionDataArgsNode({
      name: 'myInstructionData',
      struct: structTypeNode([]),
    }),
  });

  // When we get its resolved inputs.
  const result = visit(node, getResolvedInstructionInputsVisitor());

  // Then we expect the accounts to be in order of resolution.
  t.deepEqual(result, [
    {
      ...node.accounts[1],
      kind: 'account',
      isPda: false,
      dependsOn: [],
      resolvedIsOptional: false,
      resolvedIsSigner: true,
    },
    {
      ...node.accounts[0],
      kind: 'account',
      isPda: false,
      dependsOn: [{ kind: 'account', name: 'authority' }],
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
        defaultsTo: accountDefault('authority'),
      }),
      instructionAccountNode({
        name: 'authority',
        isSigner: true,
        isWritable: false,
      }),
    ],
    dataArgs: instructionDataArgsNode({
      name: 'myInstructionData',
      struct: structTypeNode([]),
    }),
  });

  // When we get its resolved inputs.
  const result = visit(node, getResolvedInstructionInputsVisitor());

  // Then we expect the resolved signer to be either for the non signer account.
  t.deepEqual(result[1], {
    ...node.accounts[0],
    kind: 'account',
    isPda: false,
    dependsOn: [{ kind: 'account', name: 'authority' }],
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
        defaultsTo: accountDefault('authority'),
      }),
      instructionAccountNode({
        name: 'authority',
        isSigner: false,
        isWritable: false,
      }),
    ],
    dataArgs: instructionDataArgsNode({
      name: 'myInstructionData',
      struct: structTypeNode([]),
    }),
  });

  // When we get its resolved inputs.
  const result = visit(node, getResolvedInstructionInputsVisitor());

  // Then we expect the resolved signer to be either for the signer account.
  t.deepEqual(result[1], {
    ...node.accounts[0],
    kind: 'account',
    isPda: false,
    dependsOn: [{ kind: 'account', name: 'authority' }],
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
    dataArgs: instructionDataArgsNode({
      name: 'myInstructionData',
      struct: structTypeNode([
        structFieldTypeNode({ name: 'ownerArg', child: publicKeyTypeNode() }),
        structFieldTypeNode({
          name: 'argWithoutDefaults',
          child: numberTypeNode('u8'),
        }),
      ]),
    }),
    argDefaults: {
      ownerArg: accountDefault('owner'),
    },
  });

  // When we get its resolved inputs.
  const result = visit(node, getResolvedInstructionInputsVisitor());

  // Then we expect the following inputs.
  t.deepEqual(result, [
    {
      ...node.accounts[0],
      kind: 'account',
      isPda: false,
      dependsOn: [],
      resolvedIsOptional: false,
      resolvedIsSigner: true,
    },
    {
      kind: 'arg',
      name: 'ownerArg',
      defaultsTo: { kind: 'account', name: 'owner' },
      dependsOn: [{ kind: 'account', name: 'owner' }],
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
    dataArgs: instructionDataArgsNode({
      name: 'myInstructionData',
      struct: structTypeNode([]),
    }),
    extraArgs: instructionExtraArgsNode({
      name: 'myInstructionExtra',
      struct: structTypeNode([
        structFieldTypeNode({ name: 'ownerArg', child: publicKeyTypeNode() }),
        structFieldTypeNode({
          name: 'argWithoutDefaults',
          child: numberTypeNode('u8'),
        }),
      ]),
    }),
    argDefaults: {
      ownerArg: accountDefault('owner'),
    },
  });

  // When we get its resolved inputs.
  const result = visit(node, getResolvedInstructionInputsVisitor());

  // Then we expect the following inputs.
  t.deepEqual(result, [
    {
      ...node.accounts[0],
      kind: 'account',
      isPda: false,
      dependsOn: [],
      resolvedIsOptional: false,
      resolvedIsSigner: true,
    },
    {
      kind: 'arg',
      name: 'ownerArg',
      defaultsTo: { kind: 'account', name: 'owner' },
      dependsOn: [{ kind: 'account', name: 'owner' }],
    },
  ]);

  // And the argument without default value is not included.
  t.false(result.some((input) => input.name === 'argWithoutDefaults'));
});

test('it returns an empty array for empty instructions', (t) => {
  // Given the following empty instruction node.
  const node = instructionNode({
    name: 'myInstruction',
    accounts: [],
    dataArgs: instructionDataArgsNode({
      name: 'myInstructionData',
      struct: structTypeNode([]),
    }),
  });

  // When we get its resolved inputs.
  const result = visit(node, getResolvedInstructionInputsVisitor());

  // Then we expect an empty array.
  t.deepEqual(result, []);
});
