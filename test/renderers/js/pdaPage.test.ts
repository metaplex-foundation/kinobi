import test from 'ava';
import {
  accountNode,
  pdaLinkNode,
  pdaNode,
  programNode,
  publicKeyTypeNode,
  rootNode,
  variablePdaSeedNode,
  visit,
} from '../../../src';
import { getRenderMapVisitor } from '../../../src/renderers/js/getRenderMapVisitor';
import { codeDoesNotContain, renderMapContains } from './_setup';

// Token-2022's `associatedToken` program defines a PDA (`associatedToken`)
// that is not linked to any account of its own — the account living at
// that address is a `Token` account owned by a *different* program. The
// legacy account-centric PDA rendering (findXPda emitted inline inside
// `accounts/<name>.ts`) has nothing to hang the finder function off, so it
// must be rendered as a standalone file instead.

test('it renders a pda finder for a pda with no matching account', (t) => {
  // Given a program with a single pda that is not linked to any account.
  const node = rootNode(
    programNode({
      name: 'myProgram',
      publicKey: '1111',
      pdas: [pdaNode('foo', [])],
    })
  );

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect a standalone PDA finder function to be rendered under
  // `accounts/`, matching the `generatedAccounts` import default used when
  // resolving `pdaValueNode` default values.
  renderMapContains(t, renderMap, 'accounts/foo.ts', [
    'export function findFooPda',
    'context.eddsa.findPda(programId, [])',
  ]);
});

test('it re-exports orphan pda finders from accounts/index.ts', (t) => {
  // Given the same program.
  const node = rootNode(
    programNode({
      name: 'myProgram',
      publicKey: '1111',
      pdas: [pdaNode('foo', [])],
    })
  );

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the accounts barrel file re-exports the standalone pda file.
  renderMapContains(t, renderMap, 'accounts/index.ts', [
    "export * from './foo'",
  ]);
});

test('it does not treat an account-linked pda as orphaned', (t) => {
  // Given a program where the pda IS linked to an account (the legacy,
  // already-supported shape). `accounts/foo.ts` is keyed by name the same
  // way whether it comes from the account page or a standalone pda page,
  // so if the orphan check were wrong the bare pda stub could silently
  // clobber the real account file (RenderMap.add is last-write-wins).
  const node = rootNode(
    programNode({
      name: 'myProgram',
      publicKey: '1111',
      pdas: [
        pdaNode('foo', [variablePdaSeedNode('owner', publicKeyTypeNode())]),
      ],
      accounts: [accountNode({ name: 'foo', pda: pdaLinkNode('foo') })],
    })
  );

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the account's own page wins: it still carries the pda finder
  // *and* the account-specific fetch/deserialize helpers that only the
  // account template renders.
  renderMapContains(t, renderMap, 'accounts/foo.ts', [
    'export function findFooPda',
    'export async function fetchFoo(',
    'export function deserializeFoo(',
  ]);
});

test('it does not let an orphan pda clobber a same-named account in another program', (t) => {
  // Given two programs: one owns an account `foo`, the other declares an
  // unlinked pda also named `foo`. Both would render to `accounts/foo.ts`.
  // The orphan-detection in `visitProgram` is scoped to that program's own
  // accounts, so without a root-wide check the second program's pda stub
  // would clobber the first program's real account file (RenderMap.add is
  // last-write-wins).
  const node = rootNode(
    programNode({
      name: 'programA',
      publicKey: '1111',
      accounts: [accountNode({ name: 'foo' })],
    }),
    [
      programNode({
        name: 'programB',
        publicKey: '2222',
        pdas: [pdaNode('foo', [])],
      }),
    ]
  );

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the account module wins: `accounts/foo.ts` keeps the account's
  // fetch/deserialize helpers and is not replaced by a bare pda finder.
  renderMapContains(t, renderMap, 'accounts/foo.ts', [
    'export async function fetchFoo(',
    'export function deserializeFoo(',
  ]);
  codeDoesNotContain(t, renderMap.get('accounts/foo.ts'), 'export function findFooPda');
});
