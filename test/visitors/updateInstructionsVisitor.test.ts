import test from 'ava';
import {
  MainCaseString,
  assertIsNode,
  instructionAccountNode,
  instructionArgumentNode,
  instructionNode,
  numberTypeNode,
  numberValueNode,
  programNode,
  rootNode,
  updateInstructionsVisitor,
  visit,
} from '../../src';

test('it updates the name of an instruction', (t) => {
  // Given the following program node with one instruction.
  const node = programNode({
    name: 'myProgram',
    publicKey: '1111',
    instructions: [instructionNode({ name: 'myInstruction' })],
  });

  // When we update the name of that instruction.
  const result = visit(
    node,
    updateInstructionsVisitor({
      myInstruction: { name: 'myNewInstruction' },
    })
  );

  // Then we expect the following tree changes.
  assertIsNode(result, 'programNode');
  t.is(result.instructions[0].name, 'myNewInstruction' as MainCaseString);

  // But the idl name should not be changed.
  t.is(result.instructions[0].idlName, 'myInstruction');
});

test('it updates the name of an instruction within a specific program', (t) => {
  // Given two programs each with an instruction of the same name.
  const node = rootNode([
    programNode({
      name: 'myProgramA',
      publicKey: '1111',
      instructions: [instructionNode({ name: 'transfer' })],
    }),
    programNode({
      name: 'myProgramB',
      publicKey: '2222',
      instructions: [instructionNode({ name: 'transfer' })],
    }),
  ]);

  // When we update the name of that instruction in the first program.
  const result = visit(
    node,
    updateInstructionsVisitor({
      'myProgramA.transfer': { name: 'newTransfer' },
    })
  );

  // Then we expect the first instruction to have been renamed.
  assertIsNode(result, 'rootNode');
  t.is(
    result.programs[0].instructions[0].name,
    'newTransfer' as MainCaseString
  );

  // But not the second instruction.
  t.is(result.programs[1].instructions[0].name, 'transfer' as MainCaseString);
});

test('it updates the name of an instruction account', (t) => {
  // Given the following instruction node with one account.
  const node = instructionNode({
    name: 'myInstruction',
    accounts: [
      instructionAccountNode({
        name: 'myAccount',
        isSigner: false,
        isWritable: true,
      }),
    ],
  });

  // When we update the name of that instruction account.
  const result = visit(
    node,
    updateInstructionsVisitor({
      myInstruction: {
        accounts: {
          myAccount: { name: 'myNewAccount' },
        },
      },
    })
  );

  // Then we expect the following tree changes.
  assertIsNode(result, 'instructionNode');
  t.is(result.accounts[0].name, 'myNewAccount' as MainCaseString);
});

test('it updates the name of an instruction argument', (t) => {
  // Given the following instruction node with one argument.
  const node = instructionNode({
    name: 'myInstruction',
    arguments: [
      instructionArgumentNode({
        name: 'myArgument',
        type: numberTypeNode('u8'),
      }),
    ],
  });

  // When we update the name of that instruction argument.
  const result = visit(
    node,
    updateInstructionsVisitor({
      myInstruction: {
        arguments: {
          myArgument: { name: 'myNewArgument' },
        },
      },
    })
  );

  // Then we expect the following tree changes.
  assertIsNode(result, 'instructionNode');
  t.is(result.arguments[0].name, 'myNewArgument' as MainCaseString);
});

test('it updates the default value of an instruction argument', (t) => {
  // Given the following instruction node with a argument that has no default value.
  const node = instructionNode({
    name: 'transferTokens',
    arguments: [
      instructionArgumentNode({
        name: 'amount',
        type: numberTypeNode('u64'),
      }),
    ],
  });

  // When we update the default value of that instruction argument.
  const result = visit(
    node,
    updateInstructionsVisitor({
      transferTokens: {
        arguments: {
          amount: { defaultValue: numberValueNode(1) },
        },
      },
    })
  );

  // Then we expect the following tree changes.
  assertIsNode(result, 'instructionNode');
  t.deepEqual(result.arguments[0].defaultValue, numberValueNode(1));
  t.is(result.arguments[0].defaultValueStrategy, undefined);
});

test('it updates the default value strategy of an instruction argument', (t) => {
  // Given the following instruction node with two arguments that have no default values.
  const node = instructionNode({
    name: 'transferTokens',
    arguments: [
      instructionArgumentNode({
        name: 'discriminator',
        type: numberTypeNode('u8'),
      }),
      instructionArgumentNode({
        name: 'amount',
        type: numberTypeNode('u64'),
      }),
    ],
  });

  // When we update the default value of these arguments using specific strategies.
  const result = visit(
    node,
    updateInstructionsVisitor({
      transferTokens: {
        arguments: {
          discriminator: {
            defaultValue: numberValueNode(42),
            defaultValueStrategy: 'omitted',
          },
          amount: {
            defaultValue: numberValueNode(1),
            defaultValueStrategy: 'optional',
          },
        },
      },
    })
  );

  // Then we expect the following tree changes.
  assertIsNode(result, 'instructionNode');
  t.deepEqual(result.arguments[0].defaultValue, numberValueNode(42));
  t.is(result.arguments[0].defaultValueStrategy, 'omitted');
  t.deepEqual(result.arguments[1].defaultValue, numberValueNode(1));
  t.is(result.arguments[1].defaultValueStrategy, 'optional');
});
