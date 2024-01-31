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

test('it renders PDA helpers for PDA with no seeds', (t) => {
  // Given the following program with 1 account and 1 pda with empty seeds.
  const node = programNode({
    name: 'myProgram',
    publicKey: '1111',
    accounts: [accountNode({ name: 'foo', pda: pdaLinkNode('bar') })],
    pdas: [pdaNode('bar', [])],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the following fetch helper functions delegating to findBarPda.
  renderMapContains(t, renderMap, 'accounts/foo.ts', [
    'export async function fetchFooFromSeeds',
    'export async function fetchMaybeFooFromSeeds',
    'await findBarPda({ programAddress })',
  ]);
});
