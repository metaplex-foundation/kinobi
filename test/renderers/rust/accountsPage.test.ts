import test from 'ava';
import {
  accountNode,
  bytesTypeNode,
  fixedSizeNode,
  pdaLinkNode,
  pdaNode,
  programNode,
  variablePdaSeedNode,
  visit,
} from '../../../src';
import { getRenderMapVisitor } from '../../../src/renderers/rust/getRenderMapVisitor';
import { codeContains } from './_setup';

test('it renders a byte array seed used on an account', (t) => {
  // Given the following program with 1 account and 1 pda with a byte array as seeds.
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
      // Byte array seeds.
      pdaNode('testPda', [
        variablePdaSeedNode('byteArraySeed', bytesTypeNode(fixedSizeNode(32))),
      ]),
    ],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the following identifier and reference to the byte array
  // as a parameters to be rendered.
  codeContains(t, renderMap.get('accounts/test_account.rs'), [
    `byte_array_seed: [u8; 32],`,
    `&byte_array_seed,`,
  ]);
});
