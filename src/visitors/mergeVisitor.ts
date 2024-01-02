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
        ...node.pdas.flatMap(visit(this)),
        ...node.accounts.flatMap(visit(this)),
        ...node.instructions.flatMap(visit(this)),
        ...node.definedTypes.flatMap(visit(this)),
        ...node.errors.flatMap(visit(this)),
      ]);
    };
  }

  if (castedNodeKeys.includes('pdaNode')) {
    visitor.visitPda = function visitPda(node) {
      return merge(node, node.seeds.flatMap(visit(this)));
    };
  }

  if (castedNodeKeys.includes('accountNode')) {
    visitor.visitAccount = function visitAccount(node) {
      return merge(node, [
        ...visit(this)(node.data),
        ...(node.pda ? visit(this)(node.pda) : []),
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
      return merge(node, visit(this)(node.type));
    };
  }

  if (castedNodeKeys.includes('arrayTypeNode')) {
    visitor.visitArrayType = function visitArrayType(node) {
      return merge(node, [
        ...visit(this)(node.size),
        ...visit(this)(node.item),
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
        ...visit(this)(node.size),
        ...visit(this)(node.key),
        ...visit(this)(node.value),
      ]);
    };
  }

  if (castedNodeKeys.includes('optionTypeNode')) {
    visitor.visitOptionType = function visitOptionType(node) {
      return merge(node, [
        ...visit(this)(node.prefix),
        ...visit(this)(node.item),
      ]);
    };
  }

  if (castedNodeKeys.includes('booleanTypeNode')) {
    visitor.visitBooleanType = function visitBooleanType(node) {
      return merge(node, visit(this)(node.size));
    };
  }

  if (castedNodeKeys.includes('setTypeNode')) {
    visitor.visitSetType = function visitSetType(node) {
      return merge(node, [
        ...visit(this)(node.size),
        ...visit(this)(node.item),
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
      return merge(node, [
        ...visit(this)(node.type),
        ...(node.defaultValue ? visit(this)(node.defaultValue) : []),
      ]);
    };
  }

  if (castedNodeKeys.includes('tupleTypeNode')) {
    visitor.visitTupleType = function visitTupleType(node) {
      return merge(node, node.items.flatMap(visit(this)));
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
      return merge(node, visit(this)(node.size));
    };
  }

  if (castedNodeKeys.includes('bytesTypeNode')) {
    visitor.visitBytesType = function visitBytesType(node) {
      return merge(node, visit(this)(node.size));
    };
  }

  if (castedNodeKeys.includes('prefixedSizeNode')) {
    visitor.visitPrefixedSize = function visitPrefixedSize(node) {
      return merge(node, visit(this)(node.prefix));
    };
  }

  if (castedNodeKeys.includes('arrayValueNode')) {
    visitor.visitArrayValue = function visitArrayValue(node) {
      return merge(node, node.items.flatMap(visit(this)));
    };
  }

  if (castedNodeKeys.includes('enumValueNode')) {
    visitor.visitEnumValue = function visitEnumValue(node) {
      return merge(node, [
        ...visit(this)(node.enum),
        ...(node.value ? visit(this)(node.value) : []),
      ]);
    };
  }

  if (castedNodeKeys.includes('mapValueNode')) {
    visitor.visitMapValue = function visitMapValue(node) {
      return merge(
        node,
        node.entries.flatMap(([k, v]) => [...visit(this)(k), ...visit(this)(v)])
      );
    };
  }

  if (castedNodeKeys.includes('setValueNode')) {
    visitor.visitSetValue = function visitSetValue(node) {
      return merge(node, node.items.flatMap(visit(this)));
    };
  }

  if (castedNodeKeys.includes('someValueNode')) {
    visitor.visitSomeValue = function visitSomeValue(node) {
      return merge(node, visit(this)(node.value));
    };
  }

  if (castedNodeKeys.includes('structValueNode')) {
    visitor.visitStructValue = function visitStructValue(node) {
      return merge(node, Object.values(node.fields).flatMap(visit(this)));
    };
  }

  if (castedNodeKeys.includes('tupleValueNode')) {
    visitor.visitTupleValue = function visitTupleValue(node) {
      return merge(node, node.items.flatMap(visit(this)));
    };
  }

  if (castedNodeKeys.includes('constantPdaSeedNode')) {
    visitor.visitConstantPdaSeed = function visitConstantPdaSeed(node) {
      return merge(node, [
        ...visit(this)(node.type),
        ...visit(this)(node.value),
      ]);
    };
  }

  if (castedNodeKeys.includes('variablePdaSeedNode')) {
    visitor.visitVariablePdaSeed = function visitVariablePdaSeed(node) {
      return merge(node, visit(this)(node.type));
    };
  }

  if (castedNodeKeys.includes('resolverValueNode')) {
    visitor.visitResolverValue = function visitResolverValue(node) {
      return merge(node, (node.dependsOn ?? []).flatMap(visit(this)));
    };
  }

  if (castedNodeKeys.includes('conditionalValueNode')) {
    visitor.visitConditionalValue = function visitConditionalValue(node) {
      return merge(node, [
        ...visit(this)(node.condition),
        ...(node.value ? visit(this)(node.value) : []),
        ...(node.ifTrue ? visit(this)(node.ifTrue) : []),
        ...(node.ifFalse ? visit(this)(node.ifFalse) : []),
      ]);
    };
  }

  if (castedNodeKeys.includes('pdaValueNode')) {
    visitor.visitPdaValue = function visitPdaValue(node) {
      return merge(node, [
        ...visit(this)(node.pda),
        ...Object.values(node.seeds).flatMap(visit(this)),
      ]);
    };
  }

  return visitor as Visitor<TReturn, TNodeKeys>;
}
