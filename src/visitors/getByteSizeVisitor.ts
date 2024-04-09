import {
  REGISTERED_TYPE_NODE_KINDS,
  RegisteredTypeNode,
  isNode,
  isScalarEnum,
} from '../nodes';
import { LinkableDictionary } from '../shared';
import { mergeVisitor } from './mergeVisitor';
import { Visitor, visit } from './visitor';

export type ByteSizeVisitorKeys =
  | RegisteredTypeNode['kind']
  | 'definedTypeLinkNode'
  | 'definedTypeNode'
  | 'accountNode'
  | 'instructionNode'
  | 'instructionArgumentNode';

export function getByteSizeVisitor(
  linkables: LinkableDictionary
): Visitor<number | null, ByteSizeVisitorKeys> {
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
      ...REGISTERED_TYPE_NODE_KINDS,
      'definedTypeLinkNode',
      'definedTypeNode',
      'accountNode',
      'instructionNode',
      'instructionArgumentNode',
    ]
  );

  return {
    ...visitor,

    visitAccount(node) {
      return visit(node.data, this);
    },

    visitInstruction(node) {
      return sumSizes(node.arguments.map((arg) => visit(arg, this)));
    },

    visitInstructionArgument(node) {
      return visit(node.type, this);
    },

    visitDefinedType(node) {
      if (visitedDefinedTypes.has(node.name)) {
        return visitedDefinedTypes.get(node.name)!;
      }
      definedTypeStack.push(node.name);
      const child = visit(node.type, this);
      definedTypeStack.pop();
      visitedDefinedTypes.set(node.name, child);
      return child;
    },

    visitArrayType(node) {
      if (!isNode(node.count, 'fixedCountNode')) return null;
      const fixedSize = node.count.value;
      const itemSize = visit(node.item, this);
      const arraySize = itemSize !== null ? itemSize * fixedSize : null;
      return fixedSize === 0 ? 0 : arraySize;
    },

    visitDefinedTypeLink(node) {
      if (node.importFrom) return null;

      // Fetch the linked type and return null if not found.
      // The validator visitor will throw a proper error later on.
      const linkedDefinedType = linkables.get(node);
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
      const itemSize = visit(node.item, this);
      return itemSize !== null ? itemSize + prefixSize : null;
    },

    visitNumberType(node) {
      return parseInt(node.format.slice(1), 10) / 8;
    },

    visitPublicKeyType() {
      return 32;
    },

    visitFixedSizeType(node) {
      return node.size;
    },
  };
}
