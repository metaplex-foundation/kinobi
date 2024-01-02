import {
  CONDITIONAL_VALUE_BRANCH_NODES,
  ENUM_VARIANT_TYPE_NODES,
  Node,
  PDA_SEED_NODES,
  REGISTERED_NODE_KINDS,
  RegisteredNodes,
  SIZE_NODES,
  TYPE_NODES,
  VALUE_NODES,
  accountDataNode,
  accountNode,
  amountTypeNode,
  arrayTypeNode,
  arrayValueNode,
  assertIsNode,
  booleanTypeNode,
  bytesTypeNode,
  conditionalValueNode,
  constantPdaSeedNode,
  dateTimeTypeNode,
  definedTypeNode,
  enumStructVariantTypeNode,
  enumTupleVariantTypeNode,
  enumTypeNode,
  enumValueNode,
  instructionDataArgsNode,
  instructionExtraArgsNode,
  instructionNode,
  mapTypeNode,
  mapValueNode,
  optionTypeNode,
  pdaNode,
  pdaValueNode,
  prefixedSizeNode,
  programNode,
  removeNullAndAssertIsNodeFilter,
  resolverValueNode,
  rootNode,
  setTypeNode,
  setValueNode,
  solAmountTypeNode,
  someValueNode,
  stringTypeNode,
  structFieldTypeNode,
  structTypeNode,
  structValueNode,
  tupleTypeNode,
  tupleValueNode,
  variablePdaSeedNode,
} from '../nodes';
import { staticVisitor } from './staticVisitor';
import { Visitor, visit as baseVisit } from './visitor';

export function identityVisitor<
  TNodeKeys extends keyof RegisteredNodes = keyof RegisteredNodes
>(
  nodeKeys: TNodeKeys[] = REGISTERED_NODE_KINDS as TNodeKeys[]
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
          .filter(removeNullAndAssertIsNodeFilter('programNode'))
      );
    };
  }

  if (castedNodeKeys.includes('programNode')) {
    visitor.visitProgram = function visitProgram(node) {
      return programNode({
        ...node,
        pdas: node.pdas
          .map((account) => visit(this)(account))
          .filter(removeNullAndAssertIsNodeFilter('pdaNode')),
        accounts: node.accounts
          .map((account) => visit(this)(account))
          .filter(removeNullAndAssertIsNodeFilter('accountNode')),
        instructions: node.instructions
          .map((instruction) => visit(this)(instruction))
          .filter(removeNullAndAssertIsNodeFilter('instructionNode')),
        definedTypes: node.definedTypes
          .map((type) => visit(this)(type))
          .filter(removeNullAndAssertIsNodeFilter('definedTypeNode')),
        errors: node.errors
          .map((error) => visit(this)(error))
          .filter(removeNullAndAssertIsNodeFilter('errorNode')),
      });
    };
  }

  if (castedNodeKeys.includes('pdaNode')) {
    visitor.visitPda = function visitPda(node) {
      return pdaNode(
        node.name,
        node.seeds
          .map((type) => visit(this)(type))
          .filter(removeNullAndAssertIsNodeFilter(PDA_SEED_NODES))
      );
    };
  }

  if (castedNodeKeys.includes('accountNode')) {
    visitor.visitAccount = function visitAccount(node) {
      const data = visit(this)(node.data);
      if (data === null) return null;
      assertIsNode(data, 'accountDataNode');
      const pda = node.pda ? visit(this)(node.pda) : null;
      if (pda !== null) {
        assertIsNode(pda, 'pdaLinkNode');
      }
      return accountNode({ ...node, data, pda: pda ?? undefined });
    };
  }

  if (castedNodeKeys.includes('accountDataNode')) {
    visitor.visitAccountData = function visitAccountData(node) {
      const struct = visit(this)(node.struct);
      if (struct === null) return null;
      assertIsNode(struct, 'structTypeNode');
      const link = node.link ? visit(this)(node.link) : undefined;
      if (link !== undefined) assertIsNode(link, 'definedTypeLinkNode');
      return accountDataNode({ ...node, struct, link });
    };
  }

  if (castedNodeKeys.includes('instructionNode')) {
    visitor.visitInstruction = function visitInstruction(node) {
      const dataArgs = visit(this)(node.dataArgs);
      assertIsNode(dataArgs, 'instructionDataArgsNode');
      const extraArgs = visit(this)(node.extraArgs);
      assertIsNode(extraArgs, 'instructionExtraArgsNode');
      return instructionNode({
        ...node,
        dataArgs,
        extraArgs,
        accounts: node.accounts
          .map((account) => visit(this)(account))
          .filter(removeNullAndAssertIsNodeFilter('instructionAccountNode')),
        subInstructions: node.subInstructions
          .map((ix) => visit(this)(ix))
          .filter(removeNullAndAssertIsNodeFilter('instructionNode')),
      });
    };
  }

  if (castedNodeKeys.includes('instructionDataArgsNode')) {
    visitor.visitInstructionDataArgs = function visitInstructionDataArgs(node) {
      const struct = visit(this)(node.struct);
      if (struct === null) return null;
      assertIsNode(struct, 'structTypeNode');
      const link = node.link ? visit(this)(node.link) : undefined;
      if (link !== undefined) assertIsNode(link, 'definedTypeLinkNode');
      return instructionDataArgsNode({ ...node, struct, link });
    };
  }

  if (castedNodeKeys.includes('instructionExtraArgsNode')) {
    visitor.visitInstructionExtraArgs = function visitInstructionExtraArgs(
      node
    ) {
      const struct = visit(this)(node.struct);
      if (struct === null) return null;
      assertIsNode(struct, 'structTypeNode');
      const link = node.link ? visit(this)(node.link) : undefined;
      if (link !== undefined) assertIsNode(link, 'definedTypeLinkNode');
      return instructionExtraArgsNode({ ...node, struct, link });
    };
  }

  if (castedNodeKeys.includes('definedTypeNode')) {
    visitor.visitDefinedType = function visitDefinedType(node) {
      const type = visit(this)(node.type);
      if (type === null) return null;
      assertIsNode(type, TYPE_NODES);
      return definedTypeNode({ ...node, type });
    };
  }

  if (castedNodeKeys.includes('arrayTypeNode')) {
    visitor.visitArrayType = function visitArrayType(node) {
      const size = visit(this)(node.size);
      if (size === null) return null;
      assertIsNode(size, SIZE_NODES);
      const item = visit(this)(node.item);
      if (item === null) return null;
      assertIsNode(item, TYPE_NODES);
      return arrayTypeNode(item, size);
    };
  }

  if (castedNodeKeys.includes('enumTypeNode')) {
    visitor.visitEnumType = function visitEnumType(node) {
      return enumTypeNode(
        node.variants
          .map((variant) => visit(this)(variant))
          .filter(removeNullAndAssertIsNodeFilter(ENUM_VARIANT_TYPE_NODES)),
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
      assertIsNode(newStruct, 'structTypeNode');
      return enumStructVariantTypeNode(node.name, newStruct);
    };
  }

  if (castedNodeKeys.includes('enumTupleVariantTypeNode')) {
    visitor.visitEnumTupleVariantType = function visitEnumTupleVariantType(
      node
    ) {
      const newTuple = visit(this)(node.tuple);
      if (!newTuple) return null;
      assertIsNode(newTuple, 'tupleTypeNode');
      return enumTupleVariantTypeNode(node.name, newTuple);
    };
  }

  if (castedNodeKeys.includes('mapTypeNode')) {
    visitor.visitMapType = function visitMapType(node) {
      const size = visit(this)(node.size);
      if (size === null) return null;
      assertIsNode(size, SIZE_NODES);
      const key = visit(this)(node.key);
      if (key === null) return null;
      assertIsNode(key, TYPE_NODES);
      const value = visit(this)(node.value);
      if (value === null) return null;
      assertIsNode(value, TYPE_NODES);
      return mapTypeNode(key, value, size, node.idlMap);
    };
  }

  if (castedNodeKeys.includes('optionTypeNode')) {
    visitor.visitOptionType = function visitOptionType(node) {
      const prefix = visit(this)(node.prefix);
      if (prefix === null) return null;
      assertIsNode(prefix, 'numberTypeNode');
      const item = visit(this)(node.item);
      if (item === null) return null;
      assertIsNode(item, TYPE_NODES);
      return optionTypeNode(item, { ...node, prefix });
    };
  }

  if (castedNodeKeys.includes('booleanTypeNode')) {
    visitor.visitBooleanType = function visitBooleanType(node) {
      const size = visit(this)(node.size);
      if (size === null) return null;
      assertIsNode(size, 'numberTypeNode');
      return booleanTypeNode(size);
    };
  }

  if (castedNodeKeys.includes('setTypeNode')) {
    visitor.visitSetType = function visitSetType(node) {
      const size = visit(this)(node.size);
      if (size === null) return null;
      assertIsNode(size, SIZE_NODES);
      const item = visit(this)(node.item);
      if (item === null) return null;
      assertIsNode(item, TYPE_NODES);
      return setTypeNode(item, size, node.idlSet);
    };
  }

  if (castedNodeKeys.includes('structTypeNode')) {
    visitor.visitStructType = function visitStructType(node) {
      return structTypeNode(
        node.fields
          .map((field) => visit(this)(field))
          .filter(removeNullAndAssertIsNodeFilter('structFieldTypeNode'))
      );
    };
  }

  if (castedNodeKeys.includes('structFieldTypeNode')) {
    visitor.visitStructFieldType = function visitStructFieldType(node) {
      const type = visit(this)(node.type);
      if (type === null) return null;
      assertIsNode(type, TYPE_NODES);
      const defaultValue = node.defaultValue
        ? visit(this)(node.defaultValue) ?? undefined
        : undefined;
      if (defaultValue) assertIsNode(defaultValue, VALUE_NODES);
      return structFieldTypeNode({ ...node, type, defaultValue });
    };
  }

  if (castedNodeKeys.includes('tupleTypeNode')) {
    visitor.visitTupleType = function visitTupleType(node) {
      return tupleTypeNode(
        node.items
          .map((child) => visit(this)(child))
          .filter(removeNullAndAssertIsNodeFilter(TYPE_NODES))
      );
    };
  }

  if (castedNodeKeys.includes('stringTypeNode')) {
    visitor.visitStringType = function visitStringType(node) {
      const size = visit(this)(node.size);
      if (size === null) return null;
      assertIsNode(size, SIZE_NODES);
      return stringTypeNode({ ...node, size });
    };
  }

  if (castedNodeKeys.includes('bytesTypeNode')) {
    visitor.visitBytesType = function visitBytesType(node) {
      const size = visit(this)(node.size);
      if (size === null) return null;
      assertIsNode(size, SIZE_NODES);
      return bytesTypeNode(size);
    };
  }

  if (castedNodeKeys.includes('amountTypeNode')) {
    visitor.visitAmountType = function visitAmountType(node) {
      const number = visit(this)(node.number);
      if (number === null) return null;
      assertIsNode(number, 'numberTypeNode');
      return amountTypeNode(number, node.decimals, node.unit);
    };
  }

  if (castedNodeKeys.includes('dateTimeTypeNode')) {
    visitor.visitDateTimeType = function visitDateTimeType(node) {
      const number = visit(this)(node.number);
      if (number === null) return null;
      assertIsNode(number, 'numberTypeNode');
      return dateTimeTypeNode(number);
    };
  }

  if (castedNodeKeys.includes('solAmountTypeNode')) {
    visitor.visitSolAmountType = function visitSolAmountType(node) {
      const number = visit(this)(node.number);
      if (number === null) return null;
      assertIsNode(number, 'numberTypeNode');
      return solAmountTypeNode(number);
    };
  }

  if (castedNodeKeys.includes('prefixedSizeNode')) {
    visitor.visitPrefixedSize = function visitPrefixedSize(node) {
      const prefix = visit(this)(node.prefix);
      if (prefix === null) return null;
      assertIsNode(prefix, 'numberTypeNode');
      return prefixedSizeNode(prefix);
    };
  }

  if (castedNodeKeys.includes('arrayValueNode')) {
    visitor.visitArrayValue = function visitArrayValue(node) {
      return arrayValueNode(
        node.items
          .map(visit(this))
          .filter(removeNullAndAssertIsNodeFilter(VALUE_NODES))
      );
    };
  }

  if (castedNodeKeys.includes('enumValueNode')) {
    visitor.visitEnumValue = function visitEnumValue(node) {
      const enumLink = visit(this)(node.enum);
      if (enumLink === null) return null;
      assertIsNode(enumLink, ['definedTypeLinkNode']);
      if (typeof node.value === 'string') return { ...node };
      const value = node.value ? visit(this)(node.value) : null;
      if (value !== null) {
        assertIsNode(value, ['structValueNode', 'tupleValueNode']);
      }
      return enumValueNode(enumLink, node.variant, value ?? undefined);
    };
  }

  if (castedNodeKeys.includes('mapValueNode')) {
    visitor.visitMapValue = function visitMapValue(node) {
      return mapValueNode(
        node.entries.flatMap(([k, v]) => {
          const key = visit(this)(k);
          if (key === null) return [];
          assertIsNode(key, VALUE_NODES);
          const value = visit(this)(v);
          if (value === null) return [];
          assertIsNode(value, VALUE_NODES);
          return [[key, value]];
        })
      );
    };
  }

  if (castedNodeKeys.includes('setValueNode')) {
    visitor.visitSetValue = function visitSetValue(node) {
      return setValueNode(
        node.items
          .map(visit(this))
          .filter(removeNullAndAssertIsNodeFilter(VALUE_NODES))
      );
    };
  }

  if (castedNodeKeys.includes('someValueNode')) {
    visitor.visitSomeValue = function visitSomeValue(node) {
      const value = visit(this)(node.value);
      if (value === null) return null;
      assertIsNode(value, VALUE_NODES);
      return someValueNode(value);
    };
  }

  if (castedNodeKeys.includes('structValueNode')) {
    visitor.visitStructValue = function visitStructValue(node) {
      return structValueNode(
        Object.fromEntries(
          Object.entries(node.fields).flatMap(([k, v]) => {
            const value = visit(this)(v);
            if (value === null) return [];
            assertIsNode(value, VALUE_NODES);
            return [[k, value]];
          })
        )
      );
    };
  }

  if (castedNodeKeys.includes('tupleValueNode')) {
    visitor.visitTupleValue = function visitTupleValue(node) {
      return tupleValueNode(
        node.items
          .map(visit(this))
          .filter(removeNullAndAssertIsNodeFilter(VALUE_NODES))
      );
    };
  }

  if (castedNodeKeys.includes('constantPdaSeedNode')) {
    visitor.visitConstantPdaSeed = function visitConstantPdaSeed(node) {
      const type = visit(this)(node.type);
      if (type === null) return null;
      assertIsNode(type, TYPE_NODES);
      const value = visit(this)(node.value);
      if (value === null) return null;
      assertIsNode(value, VALUE_NODES);
      return constantPdaSeedNode(type, value);
    };
  }

  if (castedNodeKeys.includes('variablePdaSeedNode')) {
    visitor.visitVariablePdaSeed = function visitVariablePdaSeed(node) {
      const type = visit(this)(node.type);
      if (type === null) return null;
      assertIsNode(type, TYPE_NODES);
      return variablePdaSeedNode(node.name, type, node.docs);
    };
  }

  if (castedNodeKeys.includes('resolverValueNode')) {
    visitor.visitResolverValue = function visitResolverValue(node) {
      const dependsOn = (node.dependsOn ?? [])
        .map(visit(this))
        .filter(
          removeNullAndAssertIsNodeFilter([
            'accountValueNode',
            'argumentValueNode',
          ])
        );
      return resolverValueNode(node.name, {
        ...node,
        dependsOn: dependsOn.length === 0 ? undefined : dependsOn,
      });
    };
  }

  if (castedNodeKeys.includes('conditionalValueNode')) {
    visitor.visitConditionalValue = function visitConditionalValue(node) {
      const condition = visit(this)(node.condition);
      if (condition === null) return null;
      assertIsNode(condition, [
        'resolverValueNode',
        'accountValueNode',
        'argumentValueNode',
      ]);
      const value = node.value ? visit(this)(node.value) : null;
      if (value) assertIsNode(value, VALUE_NODES);
      const ifTrue = node.ifTrue ? visit(this)(node.ifTrue) : null;
      if (ifTrue) assertIsNode(ifTrue, CONDITIONAL_VALUE_BRANCH_NODES);
      const ifFalse = node.ifFalse ? visit(this)(node.ifFalse) : null;
      if (ifFalse) assertIsNode(ifFalse, CONDITIONAL_VALUE_BRANCH_NODES);
      return conditionalValueNode({
        condition,
        value: value ?? undefined,
        ifTrue: ifTrue ?? undefined,
        ifFalse: ifFalse ?? undefined,
      });
    };
  }

  if (castedNodeKeys.includes('pdaValueNode')) {
    visitor.visitPdaValue = function visitPdaValue(node) {
      const pda = visit(this)(node.pda);
      if (pda === null) return null;
      assertIsNode(pda, 'pdaLinkNode');
      return pdaValueNode(
        pda,
        Object.fromEntries(
          Object.entries(node.seeds).flatMap(([k, v]) => {
            const value = visit(this)(v);
            if (value === null) return [];
            assertIsNode(value, [
              ...VALUE_NODES,
              'accountValueNode',
              'argumentValueNode',
            ]);
            return [[k, value]];
          })
        )
      );
    };
  }

  return visitor as Visitor<Node, TNodeKeys>;
}
