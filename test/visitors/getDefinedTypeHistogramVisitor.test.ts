import test from 'ava';
import {
  accountDataNode,
  accountNode,
  definedTypeLinkNode,
  definedTypeNode,
  enumTypeNode,
  getDefinedTypeHistogramVisitor,
  instructionArgumentNode,
  instructionDataArgsNode,
  instructionNode,
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
        type: structTypeNode([]),
      }),
      definedTypeNode({
        name: 'myEnum',
        type: enumTypeNode([]),
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
              type: definedTypeLinkNode('myStruct'),
            }),
            structFieldTypeNode({
              name: 'field2',
              type: definedTypeLinkNode('myEnum'),
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
          dataArguments: [
            instructionArgumentNode({
              name: 'arg1',
              type: definedTypeLinkNode('myStruct'),
            }),
          ],
        }),
      }),
    ],
    errors: [],
  });

  // When we get its defined type histogram.
  const histogram = visit(node, getDefinedTypeHistogramVisitor());

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
