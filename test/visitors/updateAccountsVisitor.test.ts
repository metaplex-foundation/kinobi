import test from 'ava';
import {
  MainCaseString,
  accountNode,
  assertIsNode,
  constantPdaSeedNodeFromString,
  pdaLinkNode,
  pdaNode,
  programNode,
  rootNode,
  updateAccountsVisitor,
  visit,
} from '../../src';

test('it updates the name of an account', (t) => {
  // Given the following program node with one account.
  const node = programNode({
    name: 'myProgram',
    publicKey: '1111',
    accounts: [accountNode({ name: 'myAccount' })],
  });

  // When we update the name of that account.
  const result = visit(
    node,
    updateAccountsVisitor({
      myAccount: { name: 'myNewAccount' },
    })
  );

  // Then we expect the following tree changes.
  assertIsNode(result, 'programNode');
  t.is(result.accounts[0].name, 'myNewAccount' as MainCaseString);
  t.is(
    result.accounts[0].data.name,
    'myNewAccountAccountData' as MainCaseString
  );

  // But the idl name should not be changed.
  t.is(result.accounts[0].idlName, 'myAccount');
});

test('it updates the name of an account within a specific program', (t) => {
  // Given two programs each with an account of the same name.
  const node = rootNode([
    programNode({
      name: 'myProgramA',
      publicKey: '1111',
      accounts: [accountNode({ name: 'candyMachine' })],
    }),
    programNode({
      name: 'myProgramB',
      publicKey: '2222',
      accounts: [accountNode({ name: 'candyMachine' })],
    }),
  ]);

  // When we update the name of that account in the first program.
  const result = visit(
    node,
    updateAccountsVisitor({
      'myProgramA.candyMachine': { name: 'newCandyMachine' },
    })
  );

  // Then we expect the first account to have been renamed.
  assertIsNode(result, 'rootNode');
  t.is(
    result.programs[0].accounts[0].name,
    'newCandyMachine' as MainCaseString
  );

  // But not the second account.
  t.is(result.programs[1].accounts[0].name, 'candyMachine' as MainCaseString);
});

test('it updates the name of associated PDA nodes', (t) => {
  // Given the following program node with one account
  // and PDA accounts such that one of them is named the same.
  const node = programNode({
    name: 'myProgram',
    publicKey: '1111',
    accounts: [accountNode({ name: 'myAccount' })],
    pdas: [pdaNode('myAccount', []), pdaNode('myOtherAccount', [])],
  });

  // When we update the name of that account.
  const result = visit(
    node,
    updateAccountsVisitor({
      myAccount: { name: 'myNewAccount' },
    })
  );

  // Then we expect the associated PDA node to have been renamed.
  assertIsNode(result, 'programNode');
  t.is(result.pdas[0].name, 'myNewAccount' as MainCaseString);

  // But not the other PDA node.
  t.is(result.pdas[1].name, 'myOtherAccount' as MainCaseString);
});

test('it creates a new PDA node when providing seeds to an account with no linked PDA', (t) => {
  // Given the following program node with one account.
  const node = rootNode([
    programNode({
      name: 'myProgramA',
      publicKey: '1111',
      accounts: [accountNode({ name: 'myAccount' })],
      pdas: [],
    }),
    programNode({ name: 'myProgramB', publicKey: '2222' }),
  ]);

  // When we update the account with PDA seeds.
  const seeds = [constantPdaSeedNodeFromString('myAccount')];
  const result = visit(
    node,
    updateAccountsVisitor({
      myAccount: { seeds },
    })
  );
  assertIsNode(result, 'rootNode');

  // Then we expect a new PDA node to have been created on the program.
  t.is(result.programs[0].pdas.length, 1);
  t.is(result.programs[1].pdas.length, 0);
  t.deepEqual(result.programs[0].pdas[0], pdaNode('myAccount', seeds));

  // And the account now links to the new PDA node.
  t.deepEqual(result.programs[0].accounts[0].pda, pdaLinkNode('myAccount'));
});

// It updates the PDA node when the updated account name matches an existing PDA node.

// It updates the PDA node with the provided seeds when an account is linked to a PDA.

// It creates a new PDA node when updating an account with a new linked PDA that does not exist.
