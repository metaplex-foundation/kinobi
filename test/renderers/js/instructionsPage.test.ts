import test from 'ava';
import {
  fieldDiscriminatorNode,
  instructionArgumentNode,
  instructionNode,
  numberTypeNode,
  numberValueNode,
  arrayValueNode,
  programNode,
  visit,
} from '../../../src';
import { getRenderMapVisitor } from '../../../src/renderers/js/getRenderMapVisitor';
import { renderMapContains } from './_setup';

test('it exports a number discriminator for an instruction', (t) => {
  // Given an instruction with a u8 discriminator of value 5.
  const node = programNode({
    name: 'splToken',
    publicKey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    instructions: [
      instructionNode({
        name: 'mintTokens',
        arguments: [
          instructionArgumentNode({
            name: 'discriminator',
            type: numberTypeNode('u8'),
            defaultValue: numberValueNode(5),
            defaultValueStrategy: 'omitted',
          }),
        ],
        discriminators: [fieldDiscriminatorNode('discriminator')],
      }),
    ],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the discriminator to be exported as a constant.
  renderMapContains(t, renderMap, 'instructions/mintTokens.ts', [
    'export const mintTokensInstructionDiscriminator = 5;',
  ]);
});

test('it exports an array discriminator for an instruction', (t) => {
  // Given an instruction with an array discriminator (Anchor-style).
  const node = programNode({
    name: 'myProgram',
    publicKey: '1111111111111111111111111111111111',
    instructions: [
      instructionNode({
        name: 'initialize',
        arguments: [
          instructionArgumentNode({
            name: 'discriminator',
            type: numberTypeNode('u8'),
            defaultValue: arrayValueNode([
              numberValueNode(175),
              numberValueNode(175),
              numberValueNode(109),
              numberValueNode(31),
              numberValueNode(13),
              numberValueNode(152),
              numberValueNode(155),
              numberValueNode(237),
            ]),
            defaultValueStrategy: 'omitted',
          }),
        ],
        discriminators: [fieldDiscriminatorNode('discriminator')],
      }),
    ],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the discriminator to be exported as an array constant.
  renderMapContains(t, renderMap, 'instructions/initialize.ts', [
    'export const initializeInstructionDiscriminator = [175, 175, 109, 31, 13, 152, 155, 237];',
  ]);
});

test('it does not export a discriminator when none is defined', (t) => {
  // Given an instruction with no discriminator.
  const node = programNode({
    name: 'splToken',
    publicKey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    instructions: [instructionNode({ name: 'mintTokens' })],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect no discriminator export.
  const code = renderMap.get('instructions/mintTokens.ts');
  t.false(
    code.includes('Discriminator'),
    `Expected no discriminator export but found one:\n${code}`
  );
});
