import test from 'ava';
import {
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  pdaNode,
  programIdPdaSeedNode,
  programNode,
  publicKeyTypeNode,
  variablePdaSeedNode,
  visit,
} from '../../src';

test('it adds PDA nodes to a program', (t) => {
  // Given a program with a single PDA.
  const node = programNode({
    name: 'myProgram',
    publicKey: 'Epo9rxh99jpeeWabRZi4tpgUVxZQeVn9vbbDjUztJtu4',
    pdas: [
      pdaNode('associatedToken', [
        variablePdaSeedNode('owner', publicKeyTypeNode()),
        programIdPdaSeedNode(),
        variablePdaSeedNode('mint', publicKeyTypeNode()),
      ]),
    ],
  });

  // When we add two more PDAs.
  const newPdas = [
    pdaNode('metadata', [
      constantPdaSeedNodeFromString('metadata'),
      programIdPdaSeedNode(),
      variablePdaSeedNode('mint', publicKeyTypeNode()),
    ]),
    pdaNode('masterEdition', [
      constantPdaSeedNodeFromString('metadata'),
      programIdPdaSeedNode(),
      variablePdaSeedNode('mint', publicKeyTypeNode()),
      constantPdaSeedNodeFromString('edition'),
    ]),
  ];
  const result = visit(node, addPdasVisitor({ myProgram: newPdas }));

  // Then we expect the following program to be returned.
  t.deepEqual(result, { ...node, pdas: [...node.pdas, ...newPdas] });
});

test('it fails to add a PDA if its name conflicts with an existing PDA on the program', (t) => {
  // Given a program with a PDA named "myPda".
  const node = programNode({
    name: 'myProgram',
    publicKey: 'Epo9rxh99jpeeWabRZi4tpgUVxZQeVn9vbbDjUztJtu4',
    pdas: [
      pdaNode('myPda', [
        variablePdaSeedNode('owner', publicKeyTypeNode()),
        programIdPdaSeedNode(),
        variablePdaSeedNode('mint', publicKeyTypeNode()),
      ]),
    ],
  });

  // When we try to add another PDA with the same name.
  const fn = () =>
    visit(
      node,
      addPdasVisitor({
        myProgram: [
          pdaNode('myPda', [
            constantPdaSeedNodeFromString('metadata'),
            programIdPdaSeedNode(),
            variablePdaSeedNode('mint', publicKeyTypeNode()),
          ]),
        ],
      })
    );

  // Then we expect the following error to be thrown.
  t.throws(fn, {
    message:
      'Cannot add PDAs to program "myProgram" because the following PDA names already exist: myPda.',
  });
});
