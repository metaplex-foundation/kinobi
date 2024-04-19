import test from 'ava';
import { instructionNode, programNode, visit } from '../../../src';
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
