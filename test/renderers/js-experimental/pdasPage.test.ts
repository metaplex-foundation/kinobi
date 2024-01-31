import test from 'ava';
import {
  accountNode,
  pdaLinkNode,
  pdaNode,
  programNode,
  visit,
} from '../../../src';
import { getRenderMapVisitor } from '../../../src/renderers/js-experimental/getRenderMapVisitor';
import { renderMapContains } from './_setup';

test('it renders an empty array seed used on a pda', (t) => {
  // Given the following program with 1 account and 1 pda with empty seeds.
  const node = programNode({
    name: 'splToken',
    publicKey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    accounts: [
      accountNode({
        name: 'testAccount',
        discriminators: [],
        pda: pdaLinkNode('testPda'),
      }),
    ],
    pdas: [
      // Empty array seeds.
      pdaNode('testPda', []),
    ],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the following function and and empty seeds
  // array used on program derived address function.
  renderMapContains(t, renderMap, 'pdas/testPda.ts', [
    'export async function findTestPdaPda',
    'getProgramDerivedAddress({ programAddress, seeds: [] })',
  ]);
});
