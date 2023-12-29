import { Node, REGISTERED_NODES_KEYS, RegisteredNodes } from '../nodes';
import { Visitor, visit as baseVisit } from './visitor';
import { staticVisitor } from './staticVisitor';

export function mergeVisitor<
  TReturn,
  TNodeKeys extends keyof RegisteredNodes = keyof RegisteredNodes
>(
  leafValue: (node: Node) => TReturn,
  merge: (node: Node, values: TReturn[]) => TReturn,
  nodeKeys: TNodeKeys[] = REGISTERED_NODES_KEYS as TNodeKeys[]
): Visitor<TReturn, TNodeKeys> {
  const castedNodeKeys: (keyof RegisteredNodes)[] = nodeKeys;
  const visitor = staticVisitor(leafValue, castedNodeKeys) as Visitor<TReturn>;
  const visit =
    (v: Visitor<TReturn>) =>
    (node: Node): TReturn[] =>
      castedNodeKeys.includes(node.kind) ? [baseVisit(node, v)] : [];

  if (castedNodeKeys.includes('rootNode')) {
    visitor.visitRoot = function visitRoot(node) {
      return merge(node, node.programs.flatMap(visit(this)));
    };
  }

  if (castedNodeKeys.includes('programNode')) {
    visitor.visitProgram = function visitProgram(node) {
      return merge(node, [
        ...node.accounts.flatMap(visit(this)),
        ...node.instructions.flatMap(visit(this)),
        ...node.definedTypes.flatMap(visit(this)),
        ...node.errors.flatMap(visit(this)),
      ]);
    };
  }

  if (castedNodeKeys.includes('accountNode')) {
    visitor.visitAccount = function visitAccount(node) {
      return merge(node, [
        ...visit(this)(node.data),
        ...node.seeds.flatMap((seed) => {
          if (seed.kind !== 'variable') return [];
          return visit(this)(seed.type);
        }),
      ]);
    };
  }

  if (castedNodeKeys.includes('accountDataNode')) {
    visitor.visitAccountData = function visitAccountData(node) {
      return merge(node, [
        ...visit(this)(node.struct),
        ...(node.link ? visit(this)(node.link) : []),
      ]);
    };
  }

  if (castedNodeKeys.includes('instructionNode')) {
    visitor.visitInstruction = function visitInstruction(node) {
      return merge(node, [
        ...node.accounts.flatMap(visit(this)),
        ...visit(this)(node.dataArgs),
        ...visit(this)(node.extraArgs),
        ...node.subInstructions.flatMap(visit(this)),
      ]);
    };
  }

  if (castedNodeKeys.includes('instructionDataArgsNode')) {
    visitor.visitInstructionDataArgs = function visitInstructionDataArgs(node) {
      return merge(node, [
        ...visit(this)(node.struct),
        ...(node.link ? visit(this)(node.link) : []),
      ]);
    };
  }

  if (castedNodeKeys.includes('instructionExtraArgsNode')) {
    visitor.visitInstructionExtraArgs = function visitInstructionExtraArgs(
      node
    ) {
      return merge(node, [
        ...visit(this)(node.struct),
        ...(node.link ? visit(this)(node.link) : []),
      ]);
    };
  }

  if (castedNodeKeys.includes('definedTypeNode')) {
    visitor.visitDefinedType = function visitDefinedType(node) {
      return merge(node, visit(this)(node.data));
    };
  }

  if (castedNodeKeys.includes('arrayTypeNode')) {
    visitor.visitArrayType = function visitArrayType(node) {
      return merge(node, [
        ...(node.size.kind === 'prefixed' ? visit(this)(node.size.prefix) : []),
        ...visit(this)(node.child),
      ]);
    };
  }

  if (castedNodeKeys.includes('enumTypeNode')) {
    visitor.visitEnumType = function visitEnumType(node) {
      return merge(node, [
        ...visit(this)(node.size),
        ...node.variants.flatMap(visit(this)),
      ]);
    };
  }

  if (castedNodeKeys.includes('enumStructVariantTypeNode')) {
    visitor.visitEnumStructVariantType = function visitEnumStructVariantType(
      node
    ) {
      return merge(node, visit(this)(node.struct));
    };
  }

  if (castedNodeKeys.includes('enumTupleVariantTypeNode')) {
    visitor.visitEnumTupleVariantType = function visitEnumTupleVariantType(
      node
    ) {
      return merge(node, visit(this)(node.tuple));
    };
  }

  if (castedNodeKeys.includes('mapTypeNode')) {
    visitor.visitMapType = function visitMapType(node) {
      return merge(node, [
        ...(node.size.kind === 'prefixed' ? visit(this)(node.size.prefix) : []),
        ...visit(this)(node.key),
        ...visit(this)(node.value),
      ]);
    };
  }

  if (castedNodeKeys.includes('optionTypeNode')) {
    visitor.visitOptionType = function visitOptionType(node) {
      return merge(node, [
        ...visit(this)(node.prefix),
        ...visit(this)(node.child),
      ]);
    };
  }

  if (castedNodeKeys.includes('boolTypeNode')) {
    visitor.visitBoolType = function visitBoolType(node) {
      return merge(node, visit(this)(node.size));
    };
  }

  if (castedNodeKeys.includes('setTypeNode')) {
    visitor.visitSetType = function visitSetType(node) {
      return merge(node, [
        ...(node.size.kind === 'prefixed' ? visit(this)(node.size.prefix) : []),
        ...visit(this)(node.child),
      ]);
    };
  }

  if (castedNodeKeys.includes('structTypeNode')) {
    visitor.visitStructType = function visitStructType(node) {
      return merge(node, node.fields.flatMap(visit(this)));
    };
  }

  if (castedNodeKeys.includes('structFieldTypeNode')) {
    visitor.visitStructFieldType = function visitStructFieldType(node) {
      return merge(node, visit(this)(node.child));
    };
  }

  if (castedNodeKeys.includes('tupleTypeNode')) {
    visitor.visitTupleType = function visitTupleType(node) {
      return merge(node, node.children.flatMap(visit(this)));
    };
  }

  if (castedNodeKeys.includes('amountTypeNode')) {
    visitor.visitAmountType = function visitAmountType(node) {
      return merge(node, visit(this)(node.number));
    };
  }

  if (castedNodeKeys.includes('dateTimeTypeNode')) {
    visitor.visitDateTimeType = function visitDateTimeType(node) {
      return merge(node, visit(this)(node.number));
    };
  }

  if (castedNodeKeys.includes('solAmountTypeNode')) {
    visitor.visitSolAmountType = function visitSolAmountType(node) {
      return merge(node, visit(this)(node.number));
    };
  }

  if (castedNodeKeys.includes('stringTypeNode')) {
    visitor.visitStringType = function visitStringType(node) {
      return node.size.kind === 'prefixed'
        ? merge(node, visit(this)(node.size.prefix))
        : leafValue(node);
    };
  }

  return visitor as Visitor<TReturn, TNodeKeys>;
}