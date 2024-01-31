import test from 'ava';
import { pdaNode, programNode, visit } from '../../../src';
import { getRenderMapVisitor } from '../../../src/renderers/js-experimental/getRenderMapVisitor';
import { renderMapContains } from './_setup';

test('it renders an empty array seed used on a pda', (t) => {
  // Given the following program with 1 account and 1 pda with empty seeds.
  const node = programNode({
    name: 'myProgram',
    publicKey: '1111',
    pdas: [pdaNode('foo', [])],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the following PDA function using an empty seeds array to derive the address.
  renderMapContains(t, renderMap, 'pdas/foo.ts', [
    'export async function findFooPda',
    'getProgramDerivedAddress({ programAddress, seeds: [] })',
  ]);
});
