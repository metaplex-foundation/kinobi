import {
  DefinedTypeNode,
  REGISTERED_TYPE_NODE_KEYS,
  RegisteredTypeNodes,
  isScalarEnum,
} from '../nodes';
import { Visitor, visit } from './visitor';
import { mergeVisitor } from './mergeVisitor';

export type ByteSizeVisitorKeys =
  | keyof RegisteredTypeNodes
  | 'definedTypeNode'
  | 'accountDataNode'
  | 'instructionDataArgsNode'
  | 'instructionExtraArgsNode';

export function getByteSizeVisitor(
  definedTypes: DefinedTypeNode[]
): Visitor<number | null, ByteSizeVisitorKeys> {
  const availableDefinedTypes = new Map<string, DefinedTypeNode>(
    definedTypes.map((type) => [type.name, type])
  );
  const visitedDefinedTypes = new Map<string, number | null>();
  const definedTypeStack: string[] = [];

  const sumSizes = (values: (number | null)[]): number | null =>
    values.reduce(
      (all, one) => (all === null || one === null ? null : all + one),
      0 as number | null
    );

  const visitor = mergeVisitor(
    () => null as number | null,
    (_, values) => sumSizes(values),
    [
      ...REGISTERED_TYPE_NODE_KEYS,
      'definedTypeNode',
      'accountDataNode',
      'instructionDataArgsNode',
      'instructionExtraArgsNode',
    ]
  );

  return {
    ...visitor,

    visitAccountData(node) {
      return visit(node.struct, this);
    },

    visitInstructionDataArgs(node) {
      return visit(node.struct, this);
    },

    visitInstructionExtraArgs(node) {
      return visit(node.struct, this);
    },

    visitDefinedType(node) {
      if (visitedDefinedTypes.has(node.name)) {
        return visitedDefinedTypes.get(node.name)!;
      }
      definedTypeStack.push(node.name);
      const child = visit(node.data, this);
      definedTypeStack.pop();
      visitedDefinedTypes.set(node.name, child);
      return child;
    },

    visitArrayType(node) {
      if (node.size.kind !== 'fixed') return null;
      const fixedSize = node.size.value;
      const childSize = visit(node.child, this);
      const arraySize = childSize !== null ? childSize * fixedSize : null;
      return fixedSize === 0 ? 0 : arraySize;
    },

    visitLinkType(node) {
      if (node.size !== undefined) return node.size;
      if (node.importFrom !== 'generated') return null;

      // Fetch the linked type and return null if not found.
      // The validator visitor will throw a proper error later on.
      const linkedDefinedType = availableDefinedTypes.get(node.name);
      if (!linkedDefinedType) {
        return null;
      }

      // This prevents infinite recursion by using assuming
      // cyclic types don't have a fixed size.
      if (definedTypeStack.includes(linkedDefinedType.name)) {
        return null;
      }

      return visit(linkedDefinedType, this);
    },

    visitEnumType(node) {
      const prefix = visit(node.size, this) ?? 1;
      if (isScalarEnum(node)) return prefix;
      const variantSizes = node.variants.map((v) => visit(v, this));
      const allVariantHaveTheSameFixedSize = variantSizes.every(
        (one, i, all) => one === all[0]
      );
      return allVariantHaveTheSameFixedSize &&
        variantSizes.length > 0 &&
        variantSizes[0] !== null
        ? variantSizes[0] + prefix
        : null;
    },

    visitEnumEmptyVariantType() {
      return 0;
    },

    visitOptionType(node) {
      if (!node.fixed) return null;
      const prefixSize = visit(node.prefix, this) as number;
      const childSize = visit(node.child, this);
      return childSize !== null ? childSize + prefixSize : null;
    },

    visitBytesType(node) {
      if (node.size.kind !== 'fixed') return null;
      return node.size.value;
    },

    visitNumberType(node) {
      return parseInt(node.format.slice(1), 10) / 8;
    },

    visitPublicKeyType() {
      return 32;
    },

    visitStringType(node) {
      if (node.size.kind !== 'fixed') return null;
      return node.size.value;
    },
  };
}
