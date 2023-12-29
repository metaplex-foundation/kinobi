import {
  Node,
  REGISTERED_NODES_KEYS,
  RegisteredNodes,
  accountDataNode,
  accountNode,
  amountTypeNode,
  arrayTypeNode,
  assertAccountDataNode,
  assertAccountNode,
  assertDefinedTypeNode,
  assertEnumVariantTypeNode,
  assertErrorNode,
  assertInstructionAccountNode,
  assertInstructionDataArgsNode,
  assertInstructionExtraArgsNode,
  assertInstructionNode,
  assertLinkTypeNode,
  assertNumberTypeNode,
  assertProgramNode,
  assertStructFieldTypeNode,
  assertStructTypeNode,
  assertTupleTypeNode,
  assertTypeNode,
  boolTypeNode,
  dateTimeTypeNode,
  definedTypeNode,
  enumStructVariantTypeNode,
  enumTupleVariantTypeNode,
  enumTypeNode,
  instructionDataArgsNode,
  instructionExtraArgsNode,
  instructionNode,
  mapTypeNode,
  optionTypeNode,
  programNode,
  removeNullAndAssertNodeFilter,
  rootNode,
  setTypeNode,
  solAmountTypeNode,
  structFieldTypeNode,
  structTypeNode,
  tupleTypeNode,
} from '../nodes';
import { AccountSeed } from '../shared';
import { staticVisitor } from './staticVisitor';
import { Visitor, visit as baseVisit } from './visitor';

export function identityVisitor<
  TNodeKeys extends keyof RegisteredNodes = keyof RegisteredNodes
>(
  nodeKeys: TNodeKeys[] = REGISTERED_NODES_KEYS as TNodeKeys[]
): Visitor<Node | null, TNodeKeys> {
  const castedNodeKeys: (keyof RegisteredNodes)[] = nodeKeys;
  const visitor = staticVisitor(
    (node) => ({ ...node }),
    castedNodeKeys
  ) as Visitor<Node | null>;
  const visit =
    (v: Visitor<Node | null>) =>
    (node: Node): Node | null =>
      castedNodeKeys.includes(node.kind) ? baseVisit(node, v) : { ...node };

  if (castedNodeKeys.includes('rootNode')) {
    visitor.visitRoot = function visitRoot(node) {
      return rootNode(
        node.programs
          .map((program) => visit(this)(program))
          .filter(removeNullAndAssertNodeFilter(assertProgramNode))
      );
    };
  }

  if (castedNodeKeys.includes('programNode')) {
    visitor.visitProgram = function visitProgram(node) {
      return programNode({
        ...node,
        accounts: node.accounts
          .map((account) => visit(this)(account))
          .filter(removeNullAndAssertNodeFilter(assertAccountNode)),
        instructions: node.instructions
          .map((instruction) => visit(this)(instruction))
          .filter(removeNullAndAssertNodeFilter(assertInstructionNode)),
        definedTypes: node.definedTypes
          .map((type) => visit(this)(type))
          .filter(removeNullAndAssertNodeFilter(assertDefinedTypeNode)),
        errors: node.errors
          .map((error) => visit(this)(error))
          .filter(removeNullAndAssertNodeFilter(assertErrorNode)),
      });
    };
  }

  if (castedNodeKeys.includes('accountNode')) {
    visitor.visitAccount = function visitAccount(node) {
      const data = visit(this)(node.data);
      if (data === null) return null;
      assertAccountDataNode(data);
      const seeds = node.seeds
        .map((seed) => {
          if (seed.kind !== 'variable') return seed;
          const newType = visit(this)(seed.type);
          if (newType === null) return null;
          assertTypeNode(newType);
          return { ...seed, type: newType };
        })
        .filter((s): s is AccountSeed => s !== null);
      return accountNode({ ...node, data, seeds });
    };
  }

  if (castedNodeKeys.includes('accountDataNode')) {
    visitor.visitAccountData = function visitAccountData(node) {
      const struct = visit(this)(node.struct);
      if (struct === null) return null;
      assertStructTypeNode(struct);
      const link = node.link ? visit(this)(node.link) : undefined;
      if (link !== undefined) assertLinkTypeNode(link);
      return accountDataNode({ ...node, struct, link });
    };
  }

  if (castedNodeKeys.includes('instructionNode')) {
    visitor.visitInstruction = function visitInstruction(node) {
      const dataArgs = visit(this)(node.dataArgs);
      assertInstructionDataArgsNode(dataArgs);
      const extraArgs = visit(this)(node.extraArgs);
      assertInstructionExtraArgsNode(extraArgs);
      return instructionNode({
        ...node,
        dataArgs,
        extraArgs,
        accounts: node.accounts
          .map((account) => visit(this)(account))
          .filter(removeNullAndAssertNodeFilter(assertInstructionAccountNode)),
        subInstructions: node.subInstructions
          .map((ix) => visit(this)(ix))
          .filter(removeNullAndAssertNodeFilter(assertInstructionNode)),
      });
    };
  }

  if (castedNodeKeys.includes('instructionDataArgsNode')) {
    visitor.visitInstructionDataArgs = function visitInstructionDataArgs(node) {
      const struct = visit(this)(node.struct);
      if (struct === null) return null;
      assertStructTypeNode(struct);
      const link = node.link ? visit(this)(node.link) : undefined;
      if (link !== undefined) assertLinkTypeNode(link);
      return instructionDataArgsNode({ ...node, struct, link });
    };
  }

  if (castedNodeKeys.includes('instructionExtraArgsNode')) {
    visitor.visitInstructionExtraArgs = function visitInstructionExtraArgs(
      node
    ) {
      const struct = visit(this)(node.struct);
      if (struct === null) return null;
      assertStructTypeNode(struct);
      const link = node.link ? visit(this)(node.link) : undefined;
      if (link !== undefined) assertLinkTypeNode(link);
      return instructionExtraArgsNode({ ...node, struct, link });
    };
  }

  if (castedNodeKeys.includes('definedTypeNode')) {
    visitor.visitDefinedType = function visitDefinedType(node) {
      const data = visit(this)(node.data);
      if (data === null) return null;
      assertTypeNode(data);
      return definedTypeNode({ ...node, data });
    };
  }

  if (castedNodeKeys.includes('arrayTypeNode')) {
    visitor.visitArrayType = function visitArrayType(node) {
      const child = visit(this)(node.child);
      if (child === null) return null;
      assertTypeNode(child);
      return arrayTypeNode(child, { ...node });
    };
  }

  if (castedNodeKeys.includes('enumTypeNode')) {
    visitor.visitEnumType = function visitEnumType(node) {
      return enumTypeNode(
        node.variants
          .map((variant) => visit(this)(variant))
          .filter(removeNullAndAssertNodeFilter(assertEnumVariantTypeNode)),
        { ...node }
      );
    };
  }

  if (castedNodeKeys.includes('enumStructVariantTypeNode')) {
    visitor.visitEnumStructVariantType = function visitEnumStructVariantType(
      node
    ) {
      const newStruct = visit(this)(node.struct);
      if (!newStruct) return null;
      assertStructTypeNode(newStruct);
      return enumStructVariantTypeNode(node.name, newStruct);
    };
  }

  if (castedNodeKeys.includes('enumTupleVariantTypeNode')) {
    visitor.visitEnumTupleVariantType = function visitEnumTupleVariantType(
      node
    ) {
      const newTuple = visit(this)(node.tuple);
      if (!newTuple) return null;
      assertTupleTypeNode(newTuple);
      return enumTupleVariantTypeNode(node.name, newTuple);
    };
  }

  if (castedNodeKeys.includes('mapTypeNode')) {
    visitor.visitMapType = function visitMapType(node) {
      const key = visit(this)(node.key);
      const value = visit(this)(node.value);
      if (key === null || value === null) return null;
      assertTypeNode(key);
      assertTypeNode(value);
      return mapTypeNode(key, value, { ...node });
    };
  }

  if (castedNodeKeys.includes('optionTypeNode')) {
    visitor.visitOptionType = function visitOptionType(node) {
      const prefix = visit(this)(node.prefix);
      if (prefix === null) return null;
      assertNumberTypeNode(prefix);
      const child = visit(this)(node.child);
      if (child === null) return null;
      assertTypeNode(child);
      return optionTypeNode(child, { ...node, prefix });
    };
  }

  if (castedNodeKeys.includes('boolTypeNode')) {
    visitor.visitBoolType = function visitBoolType(node) {
      const size = visit(this)(node.size);
      if (size === null) return null;
      assertNumberTypeNode(size);
      return boolTypeNode(size);
    };
  }

  if (castedNodeKeys.includes('setTypeNode')) {
    visitor.visitSetType = function visitSetType(node) {
      const child = visit(this)(node.child);
      if (child === null) return null;
      assertTypeNode(child);
      return setTypeNode(child, { ...node });
    };
  }

  if (castedNodeKeys.includes('structTypeNode')) {
    visitor.visitStructType = function visitStructType(node) {
      return structTypeNode(
        node.fields
          .map((field) => visit(this)(field))
          .filter(removeNullAndAssertNodeFilter(assertStructFieldTypeNode))
      );
    };
  }

  if (castedNodeKeys.includes('structFieldTypeNode')) {
    visitor.visitStructFieldType = function visitStructFieldType(node) {
      const child = visit(this)(node.child);
      if (child === null) return null;
      assertTypeNode(child);
      return structFieldTypeNode({ ...node, child });
    };
  }

  if (castedNodeKeys.includes('tupleTypeNode')) {
    visitor.visitTupleType = function visitTupleType(node) {
      return tupleTypeNode(
        node.children
          .map((child) => visit(this)(child))
          .filter(removeNullAndAssertNodeFilter(assertTypeNode))
      );
    };
  }

  if (castedNodeKeys.includes('amountTypeNode')) {
    visitor.visitAmountType = function visitAmountType(node) {
      const number = visit(this)(node.number);
      if (number === null) return null;
      assertNumberTypeNode(number);
      return amountTypeNode(number, node.identifier, node.decimals);
    };
  }

  if (castedNodeKeys.includes('dateTimeTypeNode')) {
    visitor.visitDateTimeType = function visitDateTimeType(node) {
      const number = visit(this)(node.number);
      if (number === null) return null;
      assertNumberTypeNode(number);
      return dateTimeTypeNode(number);
    };
  }

  if (castedNodeKeys.includes('solAmountTypeNode')) {
    visitor.visitSolAmountType = function visitSolAmountType(node) {
      const number = visit(this)(node.number);
      if (number === null) return null;
      assertNumberTypeNode(number);
      return solAmountTypeNode(number);
    };
  }

  return visitor as Visitor<Node, TNodeKeys>;
}
