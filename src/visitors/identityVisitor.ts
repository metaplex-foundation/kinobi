import * as nodes from '../nodes';
import { AccountSeed } from '../shared';
import { Visitor, visit as baseVisit } from './visitor';
import { staticVisitor } from './staticVisitor';

export function identityVisitor<
  TNodeKeys extends keyof nodes.RegisteredNodes = keyof nodes.RegisteredNodes
>(
  nodeKeys: TNodeKeys[] = nodes.REGISTERED_NODES_KEYS as TNodeKeys[]
): Visitor<nodes.Node | null, TNodeKeys> {
  const castedNodeKeys: (keyof nodes.RegisteredNodes)[] = nodeKeys;
  const visitor = staticVisitor(
    (node) => ({ ...node }),
    castedNodeKeys
  ) as Visitor<nodes.Node | null>;
  const visit =
    (v: Visitor<nodes.Node | null>) =>
    (node: nodes.Node): nodes.Node | null =>
      castedNodeKeys.includes(node.kind) ? baseVisit(node, v) : { ...node };

  if (castedNodeKeys.includes('rootNode')) {
    visitor.visitRoot = function visitRoot(node) {
      return nodes.rootNode(
        node.programs
          .map((program) => visit(this)(program))
          .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertProgramNode))
      );
    };
  }

  if (castedNodeKeys.includes('programNode')) {
    visitor.visitProgram = function visitProgram(node) {
      return nodes.programNode({
        ...node,
        accounts: node.accounts
          .map((account) => visit(this)(account))
          .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertAccountNode)),
        instructions: node.instructions
          .map((instruction) => visit(this)(instruction))
          .filter(
            nodes.removeNullAndAssertNodeFilter(nodes.assertInstructionNode)
          ),
        definedTypes: node.definedTypes
          .map((type) => visit(this)(type))
          .filter(
            nodes.removeNullAndAssertNodeFilter(nodes.assertDefinedTypeNode)
          ),
        errors: node.errors
          .map((error) => visit(this)(error))
          .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertErrorNode)),
      });
    };
  }

  if (castedNodeKeys.includes('accountNode')) {
    visitor.visitAccount = function visitAccount(node) {
      const data = visit(this)(node.data);
      if (data === null) return null;
      nodes.assertAccountDataNode(data);
      const seeds = node.seeds
        .map((seed) => {
          if (seed.kind !== 'variable') return seed;
          const newType = visit(this)(seed.type);
          if (newType === null) return null;
          nodes.assertTypeNode(newType);
          return { ...seed, type: newType };
        })
        .filter((s): s is AccountSeed => s !== null);
      return nodes.accountNode({ ...node, data, seeds });
    };
  }

  if (castedNodeKeys.includes('accountDataNode')) {
    visitor.visitAccountData = function visitAccountData(node) {
      const struct = visit(this)(node.struct);
      if (struct === null) return null;
      nodes.assertStructTypeNode(struct);
      const link = node.link ? visit(this)(node.link) : undefined;
      if (link !== undefined) nodes.assertLinkTypeNode(link);
      return nodes.accountDataNode({ ...node, struct, link });
    };
  }

  if (castedNodeKeys.includes('instructionNode')) {
    visitor.visitInstruction = function visitInstruction(node) {
      const dataArgs = visit(this)(node.dataArgs);
      nodes.assertInstructionDataArgsNode(dataArgs);
      const extraArgs = visit(this)(node.extraArgs);
      nodes.assertInstructionExtraArgsNode(extraArgs);
      return nodes.instructionNode({
        ...node,
        dataArgs,
        extraArgs,
        accounts: node.accounts
          .map((account) => visit(this)(account))
          .filter(
            nodes.removeNullAndAssertNodeFilter(
              nodes.assertInstructionAccountNode
            )
          ),
        subInstructions: node.subInstructions
          .map((ix) => visit(this)(ix))
          .filter(
            nodes.removeNullAndAssertNodeFilter(nodes.assertInstructionNode)
          ),
      });
    };
  }

  if (castedNodeKeys.includes('instructionDataArgsNode')) {
    visitor.visitInstructionDataArgs = function visitInstructionDataArgs(node) {
      const struct = visit(this)(node.struct);
      if (struct === null) return null;
      nodes.assertStructTypeNode(struct);
      const link = node.link ? visit(this)(node.link) : undefined;
      if (link !== undefined) nodes.assertLinkTypeNode(link);
      return nodes.instructionDataArgsNode({ ...node, struct, link });
    };
  }

  if (castedNodeKeys.includes('instructionExtraArgsNode')) {
    visitor.visitInstructionExtraArgs = function visitInstructionExtraArgs(
      node
    ) {
      const struct = visit(this)(node.struct);
      if (struct === null) return null;
      nodes.assertStructTypeNode(struct);
      const link = node.link ? visit(this)(node.link) : undefined;
      if (link !== undefined) nodes.assertLinkTypeNode(link);
      return nodes.instructionExtraArgsNode({ ...node, struct, link });
    };
  }

  if (castedNodeKeys.includes('definedTypeNode')) {
    visitor.visitDefinedType = function visitDefinedType(node) {
      const data = visit(this)(node.data);
      if (data === null) return null;
      nodes.assertTypeNode(data);
      return nodes.definedTypeNode({ ...node, data });
    };
  }

  if (castedNodeKeys.includes('arrayTypeNode')) {
    visitor.visitArrayType = function visitArrayType(node) {
      const child = visit(this)(node.child);
      if (child === null) return null;
      nodes.assertTypeNode(child);
      return nodes.arrayTypeNode(child, { ...node });
    };
  }

  if (castedNodeKeys.includes('enumTypeNode')) {
    visitor.visitEnumType = function visitEnumType(node) {
      return nodes.enumTypeNode(
        node.variants
          .map((variant) => visit(this)(variant))
          .filter(
            nodes.removeNullAndAssertNodeFilter(nodes.assertEnumVariantTypeNode)
          ),
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
      nodes.assertStructTypeNode(newStruct);
      return nodes.enumStructVariantTypeNode(node.name, newStruct);
    };
  }

  if (castedNodeKeys.includes('enumTupleVariantTypeNode')) {
    visitor.visitEnumTupleVariantType = function visitEnumTupleVariantType(
      node
    ) {
      const newTuple = visit(this)(node.tuple);
      if (!newTuple) return null;
      nodes.assertTupleTypeNode(newTuple);
      return nodes.enumTupleVariantTypeNode(node.name, newTuple);
    };
  }

  if (castedNodeKeys.includes('mapTypeNode')) {
    visitor.visitMapType = function visitMapType(node) {
      const key = visit(this)(node.key);
      const value = visit(this)(node.value);
      if (key === null || value === null) return null;
      nodes.assertTypeNode(key);
      nodes.assertTypeNode(value);
      return nodes.mapTypeNode(key, value, { ...node });
    };
  }

  if (castedNodeKeys.includes('optionTypeNode')) {
    visitor.visitOptionType = function visitOptionType(node) {
      const prefix = visit(this)(node.prefix);
      if (prefix === null) return null;
      nodes.assertNumberTypeNode(prefix);
      const child = visit(this)(node.child);
      if (child === null) return null;
      nodes.assertTypeNode(child);
      return nodes.optionTypeNode(child, { ...node, prefix });
    };
  }

  if (castedNodeKeys.includes('boolTypeNode')) {
    visitor.visitBoolType = function visitBoolType(node) {
      const size = visit(this)(node.size);
      if (size === null) return null;
      nodes.assertNumberTypeNode(size);
      return nodes.boolTypeNode(size);
    };
  }

  if (castedNodeKeys.includes('setTypeNode')) {
    visitor.visitSetType = function visitSetType(node) {
      const child = visit(this)(node.child);
      if (child === null) return null;
      nodes.assertTypeNode(child);
      return nodes.setTypeNode(child, { ...node });
    };
  }

  if (castedNodeKeys.includes('structTypeNode')) {
    visitor.visitStructType = function visitStructType(node) {
      return nodes.structTypeNode(
        node.fields
          .map((field) => visit(this)(field))
          .filter(
            nodes.removeNullAndAssertNodeFilter(nodes.assertStructFieldTypeNode)
          )
      );
    };
  }

  if (castedNodeKeys.includes('structFieldTypeNode')) {
    visitor.visitStructFieldType = function visitStructFieldType(node) {
      const child = visit(this)(node.child);
      if (child === null) return null;
      nodes.assertTypeNode(child);
      return nodes.structFieldTypeNode({ ...node, child });
    };
  }

  if (castedNodeKeys.includes('tupleTypeNode')) {
    visitor.visitTupleType = function visitTupleType(node) {
      return nodes.tupleTypeNode(
        node.children
          .map((child) => visit(this)(child))
          .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertTypeNode))
      );
    };
  }

  if (castedNodeKeys.includes('amountTypeNode')) {
    visitor.visitAmountType = function visitAmountType(node) {
      const number = visit(this)(node.number);
      if (number === null) return null;
      nodes.assertNumberTypeNode(number);
      return nodes.amountTypeNode(number, node.identifier, node.decimals);
    };
  }

  if (castedNodeKeys.includes('dateTimeTypeNode')) {
    visitor.visitDateTimeType = function visitDateTimeType(node) {
      const number = visit(this)(node.number);
      if (number === null) return null;
      nodes.assertNumberTypeNode(number);
      return nodes.dateTimeTypeNode(number);
    };
  }

  if (castedNodeKeys.includes('solAmountTypeNode')) {
    visitor.visitSolAmountType = function visitSolAmountType(node) {
      const number = visit(this)(node.number);
      if (number === null) return null;
      nodes.assertNumberTypeNode(number);
      return nodes.solAmountTypeNode(number);
    };
  }

  return visitor as Visitor<nodes.Node, TNodeKeys>;
}
