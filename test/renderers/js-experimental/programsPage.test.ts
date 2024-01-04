import test from 'ava';
import {
  accountNode,
  byteDiscriminatorNode,
  fieldDiscriminatorNode,
  numberTypeNode,
  numberValueNode,
  programNode,
  sizeDiscriminatorNode,
  structFieldTypeNode,
  structTypeNode,
  visit,
} from '../../../src';
import { getRenderMapVisitor } from '../../../src/renderers/js-experimental/getRenderMapVisitor';
import { renderMapContains, renderMapContainsImports } from './_setup';

test('it renders the program address constant', (t) => {
  // Given the following program.
  const node = programNode({
    name: 'splToken',
    publicKey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the following program address constant.
  renderMapContains(t, renderMap, 'programs/splToken.ts', [
    "export const SPL_TOKEN_PROGRAM_ADDRESS = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Address<'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'>;",
  ]);

  // And we expect the following imports.
  renderMapContainsImports(t, renderMap, 'programs/splToken.ts', {
    '@solana/addresses': ['Address'],
  });
});

test('it renders an enum of all available accounts for a program', (t) => {
  // Given the following program.
  const node = programNode({
    name: 'splToken',
    publicKey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    accounts: [accountNode({ name: 'mint' }), accountNode({ name: 'token' })],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the following program account enum.
  renderMapContains(t, renderMap, 'programs/splToken.ts', [
    'export enum SplTokenAccount { MINT, TOKEN };',
  ]);
});

test('it renders an function that identifies accounts in a program', (t) => {
  // Given the following program with 3 accounts. Two of which have discriminators.
  const node = programNode({
    name: 'splToken',
    publicKey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    accounts: [
      // Field discriminator.
      accountNode({
        name: 'metadata',
        data: structTypeNode([
          structFieldTypeNode({
            name: 'key',
            type: numberTypeNode('u8'),
            defaultValue: numberValueNode(5),
          }),
        ]),
        discriminators: [fieldDiscriminatorNode('key')],
      }),
      // Size and byte discriminators.
      accountNode({
        name: 'token',
        discriminators: [
          sizeDiscriminatorNode(72),
          byteDiscriminatorNode([1, 2, 3], 4),
        ],
      }),
      // No discriminator.
      accountNode({ name: 'mint', discriminators: [] }),
    ],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the following identifier function to be rendered.
  // Notice it does not include the `mint` account because it has no discriminators.
  renderMapContains(t, renderMap, 'programs/splToken.ts', [
    `export function identifySplTokenAccount(account: { data: Uint8Array } | Uint8Array): SplTokenAccount {\n` +
      `const data = account instanceof Uint8Array ? account : account.data;\n` +
      `if (memcmp(data, getU8Encoder().encode(5), 0)) { return SplTokenAccount.METADATA; }\n` +
      `if (data.length === 72 && memcmp(data, new Uint8Array(1, 2, 3), 4)) { return SplTokenAccount.TOKEN; }\n` +
      `throw new Error('The provided account could not be identified as a splToken account.')\n` +
      `}`,
  ]);

  // And we expect the following imports.
  renderMapContainsImports(t, renderMap, 'programs/splToken.ts', {
    '../shared': ['memcmp'],
  });
});
