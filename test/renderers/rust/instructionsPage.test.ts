import test from 'ava';
import {
  instructionArgumentNode,
  instructionNode,
  numberTypeNode,
  programNode,
  stringTypeNode,
  visit,
} from '../../../src';
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
            type: stringTypeNode('utf8'),
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

test('it serializes instruction data with borsh::to_vec instead of the removed try_to_vec method', (t) => {
  // Given a program with 1 instruction that has arguments.
  const node = programNode({
    name: 'splToken',
    publicKey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    instructions: [
      instructionNode({
        name: 'mintTokens',
        arguments: [
          instructionArgumentNode({
            name: 'amount',
            type: numberTypeNode('u64'),
          }),
        ],
      }),
    ],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());
  const code = renderMap.get('instructions/mint_tokens.rs');

  // Then the generated code uses the free `borsh::to_vec` function, which
  // works on both pre-1.0 and 1.0+ borsh, instead of the `try_to_vec` trait
  // method BorshSerialize dropped in borsh 1.0.
  codeContains(t, code, [`borsh::to_vec(&`]);
  t.false(
    code.includes('try_to_vec'),
    'Generated code must not call the removed BorshSerialize::try_to_vec method'
  );
});
