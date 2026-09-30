import test from 'ava';
import {
  instructionArgumentNode,
  instructionNode,
  numberTypeNode,
  programNode,
  stringTypeNode,
  structFieldTypeNode,
  structTypeNode,
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

test('it only strips Eq from the nested struct that actually contains a float', (t) => {
  // Given an instruction with two struct-typed arguments, each promoted to
  // its own nested struct - only one of them contains an f64 field.
  const node = programNode({
    name: 'splToken',
    publicKey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    instructions: [
      instructionNode({
        name: 'updateBalances',
        arguments: [
          instructionArgumentNode({
            name: 'floatArg',
            type: structTypeNode([
              structFieldTypeNode({
                name: 'ratio',
                type: numberTypeNode('f64'),
              }),
            ]),
          }),
          instructionArgumentNode({
            name: 'safeArg',
            type: structTypeNode([
              structFieldTypeNode({
                name: 'count',
                type: numberTypeNode('u32'),
              }),
            ]),
          }),
        ],
      }),
    ],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());
  const code = renderMap.get('instructions/update_balances.rs')!;

  // Then the float-containing nested struct doesn't derive Eq...
  const floatStructMatch = code.match(
    /#\[derive\(([^)]*)\)\]\s*#\[cfg_attr[^\]]*\]\s*pub struct UpdateBalancesInstructionDataFloatArg/
  );
  t.truthy(floatStructMatch, 'could not find the FloatArg nested struct');
  t.false(/\bEq\b/.test(floatStructMatch![1]));
  t.true(/\bPartialEq\b/.test(floatStructMatch![1]));

  // ...but the unrelated nested struct still does, since it has no float.
  const safeStructMatch = code.match(
    /#\[derive\(([^)]*)\)\]\s*#\[cfg_attr[^\]]*\]\s*pub struct UpdateBalancesInstructionDataSafeArg/
  );
  t.truthy(safeStructMatch, 'could not find the SafeArg nested struct');
  t.true(/\bEq\b/.test(safeStructMatch![1]));
  t.true(/\bPartialEq\b/.test(safeStructMatch![1]));
});
