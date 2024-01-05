import test from 'ava';
import {
  LinkableDictionary,
  accountValueNode,
  argumentValueNode,
  conditionalValueNode,
  fillDefaultPdaSeedValuesVisitor,
  numberTypeNode,
  numberValueNode,
  pdaNode,
  pdaSeedValueNode,
  pdaValueNode,
  publicKeyTypeNode,
  variablePdaSeedNode,
  visit,
} from '../../src';

test('it fills missing pda seed values with default values', (t) => {
  // Given a pdaNode with three variable seeds.
  const pda = pdaNode('myPda', [
    variablePdaSeedNode('seed1', numberTypeNode('u64')),
    variablePdaSeedNode('seed2', numberTypeNode('u64')),
    variablePdaSeedNode('seed3', publicKeyTypeNode()),
  ]);

  // And a linkable dictionary that recorded this PDA.
  const linkables = new LinkableDictionary();
  linkables.record(pda);

  // And a pdaValueNode with a single seed filled.
  const node = pdaValueNode('myPda', [
    pdaSeedValueNode('seed1', numberValueNode(42)),
  ]);

  // When we fill the PDA seeds with default values.
  const result = visit(node, fillDefaultPdaSeedValuesVisitor(linkables));

  // Then we expect the following pdaValueNode to be returned.
  t.deepEqual(
    result,
    pdaValueNode('myPda', [
      pdaSeedValueNode('seed1', numberValueNode(42)),
      pdaSeedValueNode('seed2', argumentValueNode('seed2')),
      pdaSeedValueNode('seed3', accountValueNode('seed3')),
    ])
  );
});

test('it fills nested pda value nodes', (t) => {
  // Given a pdaNode with three variable seeds.
  const pda = pdaNode('myPda', [
    variablePdaSeedNode('seed1', numberTypeNode('u64')),
    variablePdaSeedNode('seed2', numberTypeNode('u64')),
    variablePdaSeedNode('seed3', publicKeyTypeNode()),
  ]);

  // And a linkable dictionary that recorded this PDA.
  const linkables = new LinkableDictionary();
  linkables.record(pda);

  // And a pdaValueNode nested inside a conditionalValueNode.
  const node = conditionalValueNode({
    condition: accountValueNode('myAccount'),
    ifTrue: pdaValueNode('myPda', [
      pdaSeedValueNode('seed1', numberValueNode(42)),
    ]),
  });

  // When we fill the PDA seeds with default values.
  const result = visit(node, fillDefaultPdaSeedValuesVisitor(linkables));

  // Then we expect the following conditionalValueNode to be returned.
  t.deepEqual(
    result,
    conditionalValueNode({
      condition: accountValueNode('myAccount'),
      ifTrue: pdaValueNode('myPda', [
        pdaSeedValueNode('seed1', numberValueNode(42)),
        pdaSeedValueNode('seed2', argumentValueNode('seed2')),
        pdaSeedValueNode('seed3', accountValueNode('seed3')),
      ]),
    })
  );
});
