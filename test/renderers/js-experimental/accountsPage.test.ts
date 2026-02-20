import test from 'ava';
import {
  accountNode,
  fieldDiscriminatorNode,
  numberTypeNode,
  numberValueNode,
  pdaLinkNode,
  pdaNode,
  programNode,
  publicKeyTypeNode,
  sizeDiscriminatorNode,
  structFieldTypeNode,
  structTypeNode,
  visit,
} from '../../../src';
import { getRenderMapVisitor } from '../../../src/renderers/js-experimental/getRenderMapVisitor';
import { renderMapContains, renderMapContainsImports } from './_setup';

test('it renders a GPA builder for an account with fixed-size fields', (t) => {
  // Given the following program with an account that has fixed-size fields.
  const node = programNode({
    name: 'myProgram',
    publicKey: '1111',
    accounts: [
      accountNode({
        name: 'foo',
        data: structTypeNode([
          structFieldTypeNode({
            name: 'discriminator',
            type: numberTypeNode('u8'),
            defaultValue: numberValueNode(1),
          }),
          structFieldTypeNode({
            name: 'authority',
            type: publicKeyTypeNode(),
          }),
          structFieldTypeNode({
            name: 'amount',
            type: numberTypeNode('u64'),
          }),
        ]),
        discriminators: [fieldDiscriminatorNode('discriminator')],
      }),
    ],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the GPA builder function to be rendered.
  renderMapContains(t, renderMap, 'accounts/foo.ts', [
    'export function getFooGpaBuilder',
    "programAddress: Address = MY_PROGRAM_PROGRAM_ADDRESS",
    "gpaBuilder<",
    "discriminator: [0, getU8Encoder()]",
    "authority: [1, getAddressEncoder()]",
    "amount: [33, getU64Encoder()]",
    ".whereField('discriminator', 1)",
  ]);

  // And we expect the correct imports.
  renderMapContainsImports(t, renderMap, 'accounts/foo.ts', {
    '../shared': ['gpaBuilder'],
    '../programs': ['MY_PROGRAM_PROGRAM_ADDRESS'],
  });
});

test('it renders a GPA builder with size discriminator', (t) => {
  // Given the following program with an account that has a size discriminator.
  const node = programNode({
    name: 'myProgram',
    publicKey: '1111',
    accounts: [
      accountNode({
        name: 'bar',
        data: structTypeNode([
          structFieldTypeNode({
            name: 'value',
            type: numberTypeNode('u32'),
          }),
        ]),
        discriminators: [sizeDiscriminatorNode(4)],
      }),
    ],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the GPA builder with whereSize call.
  renderMapContains(t, renderMap, 'accounts/bar.ts', [
    'export function getBarGpaBuilder',
    '.whereSize(4)',
  ]);
});

test('it does not render a GPA builder for an account with no fields', (t) => {
  // Given the following program with an account that has no fields.
  const node = programNode({
    name: 'myProgram',
    publicKey: '1111',
    accounts: [accountNode({ name: 'empty' })],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect no GPA builder to be rendered.
  const content = renderMap.get('accounts/empty.ts');
  t.false(content.includes('GpaBuilder'));
});

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
