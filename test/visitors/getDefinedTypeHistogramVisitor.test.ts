import test from 'ava';
import {
  GetDefinedTypeHistogramVisitor,
  accountDataNode,
  accountNode,
  definedTypeNode,
  enumTypeNode,
  getDefinedTypeHistogramVisitor2,
  instructionDataArgsNode,
  instructionNode,
  linkTypeNode,
  programNode,
  structFieldTypeNode,
  structTypeNode,
  visit,
} from '../../src';

test('it counts the amount of times defined types are used within the tree', (t) => {
  // Given the following tree.
  const node = programNode({
    name: 'customProgram',
    publicKey: '1111',
    version: 'v1.0.0',
    definedTypes: [
      definedTypeNode({
        name: 'myStruct',
        data: structTypeNode([]),
      }),
      definedTypeNode({
        name: 'myEnum',
        data: enumTypeNode([]),
      }),
    ],
    accounts: [
      accountNode({
        name: 'myAccount',
        data: accountDataNode({
          name: 'myAccountData',
          struct: structTypeNode([
            structFieldTypeNode({
              name: 'field1',
              child: linkTypeNode('myStruct'),
            }),
            structFieldTypeNode({
              name: 'field2',
              child: linkTypeNode('myEnum'),
            }),
          ]),
        }),
      }),
    ],
    instructions: [
      instructionNode({
        name: 'myInstruction',
        accounts: [],
        dataArgs: instructionDataArgsNode({
          name: 'myInstructionData',
          struct: structTypeNode([
            structFieldTypeNode({
              name: 'arg1',
              child: linkTypeNode('myStruct'),
            }),
          ]),
        }),
      }),
    ],
    errors: [],
  });

  // When we get its defined type histogram.
  const histogram = visit(node, getDefinedTypeHistogramVisitor2());

  // Then we expect the following histogram.
  t.deepEqual(histogram, {
    myStruct: {
      total: 2,
      inAccounts: 1,
      inDefinedTypes: 0,
      inInstructionArgs: 1,
      directlyAsInstructionArgs: 1,
    },
    myEnum: {
      total: 1,
      inAccounts: 1,
      inDefinedTypes: 0,
      inInstructionArgs: 0,
      directlyAsInstructionArgs: 0,
    },
  });
});
