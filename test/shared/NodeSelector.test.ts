import test from 'ava';
import {
  BooleanTypeNode,
  EnumStructVariantTypeNode,
  EnumTypeNode,
  Node,
  NodeSelector,
  NodeStack,
  OptionTypeNode,
  accountDataNode,
  accountNode,
  booleanTypeNode,
  definedTypeLinkNode,
  definedTypeNode,
  enumEmptyVariantTypeNode,
  enumStructVariantTypeNode,
  enumTypeNode,
  errorNode,
  getNodeSelectorFunction,
  identityVisitor,
  instructionAccountNode,
  instructionDataArgsNode,
  instructionExtraArgsNode,
  instructionNode,
  interceptVisitor,
  isNode,
  numberTypeNode,
  optionTypeNode,
  pipe,
  programNode,
  publicKeyTypeNode,
  recordNodeStackVisitor,
  rootNode,
  structFieldTypeNode,
  structTypeNode,
  visit,
} from '../../src';

// Given the following tree.
const tree = rootNode([
  programNode({
    name: 'splToken',
    publicKey: '1111',
    version: '1.0.0',
    accounts: [
      accountNode({
        name: 'token',
        data: accountDataNode({
          name: 'tokenAccountData',
          struct: structTypeNode([
            structFieldTypeNode({
              name: 'owner',
              type: publicKeyTypeNode(),
            }),
            structFieldTypeNode({
              name: 'mint',
              type: publicKeyTypeNode(),
            }),
            structFieldTypeNode({
              name: 'amount',
              type: numberTypeNode('u64'),
            }),
            structFieldTypeNode({
              name: 'delegatedAmount',
              type: optionTypeNode(numberTypeNode('u64'), {
                prefix: numberTypeNode('u32'),
              }),
            }),
          ]),
        }),
      }),
    ],
    instructions: [
      instructionNode({
        name: 'mintToken',
        accounts: [
          instructionAccountNode({
            name: 'token',
            isSigner: false,
            isWritable: true,
          }),
          instructionAccountNode({
            name: 'mint',
            isSigner: false,
            isWritable: true,
          }),
          instructionAccountNode({
            name: 'mintAuthority',
            isSigner: true,
            isWritable: false,
          }),
        ],
        dataArgs: instructionDataArgsNode({
          name: 'mintTokenInstructionData',
          struct: structTypeNode([
            structFieldTypeNode({
              name: 'amount',
              type: numberTypeNode('u64'),
            }),
          ]),
        }),
        extraArgs: instructionExtraArgsNode({
          name: 'mintTokenInstructionExtra',
          struct: structTypeNode([]),
        }),
      }),
    ],
    definedTypes: [],
    errors: [
      errorNode({
        code: 0,
        name: 'invalidProgramId',
        message: 'Invalid program ID',
      }),
      errorNode({
        code: 1,
        name: 'invalidTokenOwner',
        message: 'Invalid token owner',
      }),
    ],
  }),
  programNode({
    name: 'christmasProgram',
    publicKey: '2222',
    version: '1.0.0',
    accounts: [
      accountNode({
        name: 'gift',
        data: accountDataNode({
          name: 'giftAccountData',
          struct: structTypeNode([
            structFieldTypeNode({
              name: 'owner',
              type: publicKeyTypeNode(),
            }),
            structFieldTypeNode({
              name: 'opened',
              type: booleanTypeNode(numberTypeNode('u64')),
            }),
            structFieldTypeNode({
              name: 'amount',
              type: numberTypeNode('u64'),
            }),
            structFieldTypeNode({
              name: 'wrappingPaper',
              type: definedTypeLinkNode('wrappingPaper'),
            }),
          ]),
        }),
      }),
    ],
    instructions: [
      instructionNode({
        name: 'openGift',
        accounts: [
          instructionAccountNode({
            name: 'gift',
            isSigner: false,
            isWritable: true,
          }),
          instructionAccountNode({
            name: 'owner',
            isSigner: true,
            isWritable: false,
          }),
        ],
        dataArgs: instructionDataArgsNode({
          name: 'openGiftInstructionData',
          struct: structTypeNode([]),
        }),
        extraArgs: instructionExtraArgsNode({
          name: 'openGiftInstructionExtra',
          struct: structTypeNode([]),
        }),
      }),
    ],
    definedTypes: [
      definedTypeNode({
        name: 'wrappingPaper',
        type: enumTypeNode([
          enumEmptyVariantTypeNode('blue'),
          enumEmptyVariantTypeNode('red'),
          enumStructVariantTypeNode(
            'gold',
            structTypeNode([
              structFieldTypeNode({
                name: 'owner',
                type: publicKeyTypeNode(),
              }),
            ])
          ),
        ]),
      }),
    ],
    errors: [
      errorNode({
        code: 0,
        name: 'invalidProgramId',
        message: 'Invalid program ID',
      }),
    ],
  }),
]);

const macro = test.macro({
  title(_, selector: NodeSelector) {
    return typeof selector === 'string'
      ? `it can select nodes using paths: "${selector}"`
      : 'it can select nodes using functions';
  },
  exec(t, selector: NodeSelector, expectedSelected: Node[]) {
    // Given a selector function created from the selector.
    const selectorFunction = getNodeSelectorFunction(selector);

    // And given a visitor that keeps track of selected nodes.
    const stack = new NodeStack();
    const selected = [] as Node[];
    const visitor = pipe(
      identityVisitor(),
      (v) => recordNodeStackVisitor(v, stack),
      (v) =>
        interceptVisitor(v, (node, next) => {
          if (selectorFunction(node, stack.clone())) selected.push(node);
          return next(node);
        })
    );

    // When we visit the tree.
    visit(tree, visitor);

    // Then the selected nodes are as expected.
    t.deepEqual(expectedSelected, selected);
    selected.forEach((node, index) => t.is(node, expectedSelected[index]));
  },
});

/**
 * [programNode] splToken
 *     [accountNode] token > [accountDataNode] tokenAccountData > [structTypeNode]
 *         [structFieldTypeNode] owner > [publicKeyTypeNode]
 *         [structFieldTypeNode] mint > [publicKeyTypeNode]
 *         [structFieldTypeNode] amount > [numberTypeNode] (u64)
 *         [structFieldTypeNode] delegatedAmount > [optionTypeNode] (prefix: [numberTypeNode] (u32)) > [numberTypeNode] (u64)
 *     [instructionNode] mintToken
 *         [instructionAccountNode] token
 *         [instructionAccountNode] mint
 *         [instructionAccountNode] mintAuthority
 *         [instructionDataArgsNode] mintTokenInstructionData > [structTypeNode]
 *             [structFieldTypeNode] amount > [numberTypeNode] (u64)
 *     [errorNode] invalidProgramId (0)
 *     [errorNode] invalidTokenOwner (1)
 * [programNode] christmasProgram
 *     [accountNode] gift > [accountDataNode] giftAccountData > [structTypeNode]
 *         [structFieldTypeNode] owner > [publicKeyTypeNode]
 *         [structFieldTypeNode] opened > [booleanTypeNode] > [numberTypeNode] (u64)
 *         [structFieldTypeNode] amount > [numberTypeNode] (u64)
 *         [structFieldTypeNode] wrappingPaper > [definedTypeLinkNode] wrappingPaper
 *     [instructionNode] openGift
 *         [instructionAccountNode] gift
 *         [instructionAccountNode] owner
 *     [definedTypeNode] wrappingPaper > [enumTypeNode]
 *         [enumEmptyVariantTypeNode] blue
 *         [enumEmptyVariantTypeNode] red
 *         [enumStructVariantTypeNode] gold > [structTypeNode]
 *             [structFieldTypeNode] owner > [publicKeyTypeNode]
 *     [errorNode] invalidProgramId (0)
 */

const splTokenProgram = tree.programs[0];
const christmasProgram = tree.programs[1];
const tokenAccount = splTokenProgram.accounts[0];
const tokenDelegatedAmountOption = tokenAccount.data.struct.fields[3]
  .type as OptionTypeNode;
const mintTokenInstruction = splTokenProgram.instructions[0];
const giftAccount = christmasProgram.accounts[0];
const openGiftInstruction = christmasProgram.instructions[0];
const wrappingPaper = christmasProgram.definedTypes[0];
const wrappingPaperEnum = wrappingPaper.type as EnumTypeNode;
const wrappingPaperEnumGold = wrappingPaperEnum
  .variants[2] as EnumStructVariantTypeNode;

// Select programs.
test(macro, '[programNode]', [splTokenProgram, christmasProgram]);
test(macro, '[programNode]splToken', [splTokenProgram]);
test(macro, 'christmasProgram', [christmasProgram]);

// Select and filter owner nodes.
test(macro, 'owner', [
  tokenAccount.data.struct.fields[0],
  giftAccount.data.struct.fields[0],
  openGiftInstruction.accounts[1],
  wrappingPaperEnumGold.struct.fields[0],
]);
test(macro, '[structFieldTypeNode]owner', [
  tokenAccount.data.struct.fields[0],
  giftAccount.data.struct.fields[0],
  wrappingPaperEnumGold.struct.fields[0],
]);
test(macro, 'splToken.owner', [tokenAccount.data.struct.fields[0]]);
test(macro, '[instructionNode].owner', [openGiftInstruction.accounts[1]]);
test(macro, '[accountNode].owner', [
  tokenAccount.data.struct.fields[0],
  giftAccount.data.struct.fields[0],
]);
test(macro, '[accountNode]token.owner', [tokenAccount.data.struct.fields[0]]);
test(macro, 'christmasProgram.[accountNode].owner', [
  giftAccount.data.struct.fields[0],
]);
test(
  macro,
  '[programNode]christmasProgram.[definedTypeNode]wrappingPaper.[enumStructVariantTypeNode]gold.owner',
  [wrappingPaperEnumGold.struct.fields[0]]
);
test(macro, 'christmasProgram.wrappingPaper.gold.owner', [
  wrappingPaperEnumGold.struct.fields[0],
]);

// Select all descendants of a node.
test(macro, 'wrappingPaper.*', [
  giftAccount.data.struct.fields[3].type,
  wrappingPaperEnum,
  wrappingPaperEnum.variants[0],
  wrappingPaperEnum.variants[1],
  wrappingPaperEnum.variants[2],
  wrappingPaperEnumGold.struct,
  wrappingPaperEnumGold.struct.fields[0],
  wrappingPaperEnumGold.struct.fields[0].type,
]);
test(macro, 'wrappingPaper.[structFieldTypeNode]', [
  wrappingPaperEnumGold.struct.fields[0],
]);
test(macro, 'wrappingPaper.blue', [wrappingPaperEnum.variants[0]]);
test(macro, 'amount.*', [
  tokenAccount.data.struct.fields[2].type,
  mintTokenInstruction.dataArgs.struct.fields[0].type,
  giftAccount.data.struct.fields[2].type,
]);
test(macro, '[instructionNode].amount.*', [
  mintTokenInstruction.dataArgs.struct.fields[0].type,
]);
test(macro, '[structFieldTypeNode].*', [
  tokenAccount.data.struct.fields[0].type,
  tokenAccount.data.struct.fields[1].type,
  tokenAccount.data.struct.fields[2].type,
  tokenAccount.data.struct.fields[3].type,
  tokenDelegatedAmountOption.prefix,
  tokenDelegatedAmountOption.item,
  mintTokenInstruction.dataArgs.struct.fields[0].type,
  giftAccount.data.struct.fields[0].type,
  giftAccount.data.struct.fields[1].type,
  (giftAccount.data.struct.fields[1].type as BooleanTypeNode).size,
  giftAccount.data.struct.fields[2].type,
  giftAccount.data.struct.fields[3].type,
  wrappingPaperEnumGold.struct.fields[0].type,
]);
test(macro, '[structFieldTypeNode].*.*', [
  tokenDelegatedAmountOption.prefix,
  tokenDelegatedAmountOption.item,
  (giftAccount.data.struct.fields[1].type as BooleanTypeNode).size,
]);

// Select using functions.
test(macro, (node) => isNode(node, 'numberTypeNode') && node.format === 'u32', [
  tokenDelegatedAmountOption.prefix,
]);
