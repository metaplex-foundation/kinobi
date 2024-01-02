import test from 'ava';
import {
  LinkableDictionary,
  accountLinkNode,
  accountNode,
  definedTypeLinkNode,
  definedTypeNode,
  pdaLinkNode,
  pdaNode,
  programLinkNode,
  programNode,
  recordLinkablesVisitor,
  rootNode,
  structTypeNode,
  visit,
  voidVisitor,
} from '../../src';

test('it record all linkable nodes it finds when traversing the tree', (t) => {
  // Given the following root node containing multiple linkable nodes.
  const node = rootNode([
    programNode({
      name: 'programA',
      publicKey: '1111',
      pdas: [pdaNode('pdaA', [])],
      accounts: [accountNode({ name: 'accountA' })],
      definedTypes: [
        definedTypeNode({ name: 'typeA', type: structTypeNode([]) }),
      ],
    }),
    programNode({
      name: 'programB',
      publicKey: '2222',
      pdas: [pdaNode('pdaB', [])],
      accounts: [accountNode({ name: 'accountB' })],
      definedTypes: [
        definedTypeNode({ name: 'typeB', type: structTypeNode([]) }),
      ],
    }),
  ]);

  // And a recordLinkablesVisitor extending any visitor.
  const linkables = new LinkableDictionary();
  const visitor = recordLinkablesVisitor(voidVisitor(), linkables);

  // When we visit the tree.
  visit(node, visitor);

  // Then we expect all linkable nodes to be recorded.
  t.deepEqual(linkables.get(programLinkNode('programA')), node.programs[0]);
  t.deepEqual(linkables.get(programLinkNode('programB')), node.programs[1]);
  t.deepEqual(linkables.get(pdaLinkNode('pdaA')), node.programs[0].pdas[0]);
  t.deepEqual(linkables.get(pdaLinkNode('pdaB')), node.programs[1].pdas[0]);
  t.deepEqual(
    linkables.get(accountLinkNode('accountA')),
    node.programs[0].accounts[0]
  );
  t.deepEqual(
    linkables.get(accountLinkNode('accountB')),
    node.programs[1].accounts[0]
  );
  t.deepEqual(
    linkables.get(definedTypeLinkNode('typeA')),
    node.programs[0].definedTypes[0]
  );
  t.deepEqual(
    linkables.get(definedTypeLinkNode('typeB')),
    node.programs[1].definedTypes[0]
  );
});
