import test from 'ava';
import { instructionArgumentNode, instructionNode, programNode, remainderSizeNode, stringTypeNode, visit, instructionRemainingAccountsNode, instructionAccountNode, argumentValueNode } from '../../../src';
import { getRenderMapVisitor } from '../../../src/renderers/rust/getRenderMapVisitor';
import { codeContains } from './_setup';

test('it renders a public instruction data struct', (t) => {
  // Given the following program with 1 instruction.
  const node = programNode({
    name: 'splToken',
    publicKey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    instructions: [instructionNode({ name: 'mintTokens' })],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the following pub struct.
  codeContains(t, renderMap.get('instructions/mint_tokens.rs'), [
    `pub struct MintTokensInstructionData`,
    `pub fn new(`,
  ]);
});

test('it renders an instruction with a remainder str', (t) => {
  // Given the following program with 1 instruction.
  const node = programNode({
    name: 'splToken',
    publicKey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    instructions: [
      instructionNode({
        name: 'addMemo',
        arguments: [
          instructionArgumentNode({
            name: 'memo',
            type: stringTypeNode({ size: remainderSizeNode() }),
          }),
        ],
      }),
    ],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the following pub struct.
  codeContains(t, renderMap.get('instructions/add_memo.rs'), [
    `use kaigan::types::RemainderStr`,
    `pub memo: RemainderStr`,
  ]);
});

test('it renders an instruction with remaining accounts', (t) => {
  // Given the following program with 1 instruction.
  const node = programNode({
    name: 'splToken',
    publicKey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    instructions: [instructionNode({ name: 'addMemo', remainingAccounts: [
      instructionRemainingAccountsNode(
        argumentValueNode("account0"),
        {
          isWritable: false,
          isSigner: false,
        }
      ),
      instructionRemainingAccountsNode(
        argumentValueNode("account1"),
        {
          isWritable: false,
          isSigner: true,
        }
      ),
      instructionRemainingAccountsNode(
        argumentValueNode("account2"),
        {
          isWritable: true,
          isSigner: false,
        }
      ),
      instructionRemainingAccountsNode(
        argumentValueNode("account3"),
        {
          isWritable: true,
          isSigner: true,
        }
      ),
    ] })
    ],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the correct ordering for isSigner and isWritable.
  codeContains(t, renderMap.get('instructions/add_memo.rs'), [
    `self.instruction.__remaining_accounts.push((account, is_writable, is_signer));`,
    `is_writable: remaining_account.1,`,
    `is_signer: remaining_account.2,`,
  ]);
});