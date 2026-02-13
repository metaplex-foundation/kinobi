import test from 'ava';
import {
  fieldDiscriminatorNode,
  instructionAccountNode,
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

test('it exports an args-only serializer for a Shank instruction', (t) => {
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
          instructionArgumentNode({
            name: 'amount',
            type: numberTypeNode('u64'),
          }),
        ],
        discriminators: [fieldDiscriminatorNode('discriminator')],
      }),
    ],
  });
  const renderMap = visit(node, getRenderMapVisitor());
  renderMapContains(t, renderMap, 'instructions/mintTokens.ts', [
    'export function getMintTokensInstructionArgsOnlySerializer(): Serializer<any, any> {',
    "['amount',",
  ]);
});

test('it exports an args-only serializer for an Anchor instruction', (t) => {
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
              numberValueNode(175), numberValueNode(175),
              numberValueNode(109), numberValueNode(31),
              numberValueNode(13), numberValueNode(152),
              numberValueNode(155), numberValueNode(237),
            ]),
            defaultValueStrategy: 'omitted',
          }),
          instructionArgumentNode({
            name: 'metadata',
            type: numberTypeNode('u8'),
          }),
        ],
        discriminators: [fieldDiscriminatorNode('discriminator')],
      }),
    ],
  });
  const renderMap = visit(node, getRenderMapVisitor());
  renderMapContains(t, renderMap, 'instructions/initialize.ts', [
    'export function getInitializeInstructionArgsOnlySerializer(): Serializer<any, any> {',
    "['metadata',",
  ]);
});

test('it exports an args-only serializer with empty struct for no-args instructions', (t) => {
  const node = programNode({
    name: 'splToken',
    publicKey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    instructions: [
      instructionNode({
        name: 'freezeAccount',
        arguments: [
          instructionArgumentNode({
            name: 'discriminator',
            type: numberTypeNode('u8'),
            defaultValue: numberValueNode(10),
            defaultValueStrategy: 'omitted',
          }),
        ],
        discriminators: [fieldDiscriminatorNode('discriminator')],
      }),
    ],
  });
  const renderMap = visit(node, getRenderMapVisitor());
  renderMapContains(t, renderMap, 'instructions/freezeAccount.ts', [
    'export function getFreezeAccountInstructionArgsOnlySerializer(): Serializer<any, any> {',
    'struct<FreezeAccountInstructionArgsOnly>([]',
  ]);
});

test('it exports an args-only serializer for multi-discriminator instruction', (t) => {
  const node = programNode({
    name: 'mplTokenMetadata',
    publicKey: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
    instructions: [
      instructionNode({
        name: 'transferV1',
        arguments: [
          instructionArgumentNode({
            name: 'discriminator',
            type: numberTypeNode('u8'),
            defaultValue: numberValueNode(49),
            defaultValueStrategy: 'omitted',
          }),
          instructionArgumentNode({
            name: 'transferV1Discriminator',
            type: numberTypeNode('u8'),
            defaultValue: numberValueNode(0),
            defaultValueStrategy: 'omitted',
          }),
          instructionArgumentNode({
            name: 'amount',
            type: numberTypeNode('u64'),
          }),
        ],
        discriminators: [
          fieldDiscriminatorNode('discriminator'),
          fieldDiscriminatorNode('transferV1Discriminator'),
        ],
      }),
    ],
  });
  const renderMap = visit(node, getRenderMapVisitor());
  renderMapContains(t, renderMap, 'instructions/transferV1.ts', [
    'export function getTransferV1InstructionArgsOnlySerializer(): Serializer<any, any> {',
    "['amount',",
  ]);
});

test('it renders instruction descriptors in program file for Shank instruction', (t) => {
  const node = programNode({
    name: 'splToken',
    publicKey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    instructions: [
      instructionNode({
        name: 'mintTokens',
        accounts: [
          instructionAccountNode({ name: 'mint', isWritable: true, isSigner: false }),
          instructionAccountNode({ name: 'tokenAccount', isWritable: true, isSigner: false }),
          instructionAccountNode({ name: 'mintAuthority', isWritable: false, isSigner: true }),
        ],
        arguments: [
          instructionArgumentNode({
            name: 'discriminator',
            type: numberTypeNode('u8'),
            defaultValue: numberValueNode(7),
            defaultValueStrategy: 'omitted',
          }),
          instructionArgumentNode({
            name: 'amount',
            type: numberTypeNode('u64'),
          }),
        ],
        discriminators: [fieldDiscriminatorNode('discriminator')],
      }),
    ],
  });

  const renderMap = visit(node, getRenderMapVisitor());

  renderMapContains(t, renderMap, 'programs/splToken.ts', [
    'instructions:',
    "name: 'mintTokens',",
    'new Uint8Array([7]),',
    'size: 1 },',
    'getMintTokensInstructionArgsOnlySerializer(),',
    "['mint', 'tokenAccount', 'mintAuthority']}",
  ]);
});

test('it renders instruction descriptors for Anchor-style 8-byte discriminator', (t) => {
  const node = programNode({
    name: 'myProgram',
    publicKey: '1111111111111111111111111111111111',
    instructions: [
      instructionNode({
        name: 'initialize',
        accounts: [
          instructionAccountNode({ name: 'authority', isWritable: false, isSigner: true }),
          instructionAccountNode({ name: 'state', isWritable: true, isSigner: false }),
        ],
        arguments: [
          instructionArgumentNode({
            name: 'discriminator',
            type: numberTypeNode('u8'),
            defaultValue: arrayValueNode([
              numberValueNode(175), numberValueNode(175),
              numberValueNode(109), numberValueNode(31),
              numberValueNode(13), numberValueNode(152),
              numberValueNode(155), numberValueNode(237),
            ]),
            defaultValueStrategy: 'omitted',
          }),
          instructionArgumentNode({
            name: 'name',
            type: numberTypeNode('u8'),
          }),
        ],
        discriminators: [fieldDiscriminatorNode('discriminator')],
      }),
    ],
  });

  const renderMap = visit(node, getRenderMapVisitor());

  renderMapContains(t, renderMap, 'programs/myProgram.ts', [
    'instructions:',
    "name: 'initialize',",
    'new Uint8Array([175, 175, 109, 31, 13, 152, 155, 237]),',
    'size: 8 },',
    'getInitializeInstructionArgsOnlySerializer(),',
    "['authority', 'state']}",
  ]);
});

test('it renders instruction descriptors for multi-discriminator Shank instruction', (t) => {
  const node = programNode({
    name: 'mplTokenMetadata',
    publicKey: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
    instructions: [
      instructionNode({
        name: 'transferV1',
        accounts: [
          instructionAccountNode({ name: 'token', isWritable: true, isSigner: false }),
          instructionAccountNode({ name: 'tokenOwner', isWritable: false, isSigner: false }),
          instructionAccountNode({ name: 'mint', isWritable: false, isSigner: false }),
        ],
        arguments: [
          instructionArgumentNode({
            name: 'discriminator',
            type: numberTypeNode('u8'),
            defaultValue: numberValueNode(49),
            defaultValueStrategy: 'omitted',
          }),
          instructionArgumentNode({
            name: 'transferV1Discriminator',
            type: numberTypeNode('u8'),
            defaultValue: numberValueNode(0),
            defaultValueStrategy: 'omitted',
          }),
          instructionArgumentNode({
            name: 'amount',
            type: numberTypeNode('u64'),
          }),
        ],
        discriminators: [
          fieldDiscriminatorNode('discriminator'),
          fieldDiscriminatorNode('transferV1Discriminator'),
        ],
      }),
    ],
  });

  const renderMap = visit(node, getRenderMapVisitor());

  renderMapContains(t, renderMap, 'programs/mplTokenMetadata.ts', [
    'instructions:',
    "name: 'transferV1',",
    'new Uint8Array([49, 0]),',
    'size: 2 },',
    'getTransferV1InstructionArgsOnlySerializer(),',
    "['token', 'tokenOwner', 'mint']}",
  ]);
});
