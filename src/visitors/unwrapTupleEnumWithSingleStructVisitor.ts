import {
  DefinedTypeNode,
  EnumTupleVariantTypeNode,
  assertEnumTupleVariantTypeNode,
  assertRootNode,
  enumStructVariantTypeNode,
  getAllDefinedTypes,
  isLinkTypeNode,
  isStructTypeNode,
} from '../nodes';
import { MainCaseString, NodeStack } from '../shared';
import { bottomUpTransformerVisitor } from './bottomUpTransformerVisitor';
import { getDefinedTypeHistogramVisitor } from './getDefinedTypeHistogramVisitor';
import { rootNodeVisitor } from './singleNodeVisitor';
import { unwrapDefinedTypesVisitor } from './unwrapDefinedTypesVisitor';
import { visit } from './visitor';

export function unwrapTupleEnumWithSingleStructVisitor(
  enumsOrVariantsToUnwrap: string[] | '*' = '*'
) {
  const shouldUnwrap = (
    node: EnumTupleVariantTypeNode,
    stack: NodeStack
  ): boolean => {
    const stackWithNode = stack.clone();
    stackWithNode.push(node);
    if (enumsOrVariantsToUnwrap === '*') return true;
    return enumsOrVariantsToUnwrap.some(
      (selector) => stackWithNode.matchesWithNames(selector.split('.')) // TODO: use new NodeSelector
    );
  };

  return rootNodeVisitor((root) => {
    const typesToPotentiallyUnwrap: string[] = [];
    const definedTypes: Map<string, DefinedTypeNode> = new Map(
      getAllDefinedTypes(root).map((definedType) => [
        definedType.name,
        definedType,
      ])
    );

    let newRoot = visit(
      root,
      bottomUpTransformerVisitor([
        {
          select: '[enumTupleVariantTypeNode]',
          transform: (node, stack) => {
            assertEnumTupleVariantTypeNode(node);
            if (!shouldUnwrap(node, stack)) return node;
            if (node.tuple.children.length !== 1) return node;
            let child = node.tuple.children[0];
            if (isLinkTypeNode(child)) {
              if (child.importFrom !== 'generated') return node;
              const definedType = definedTypes.get(child.name);
              if (!definedType) return node;
              if (!isStructTypeNode(definedType.data)) return node;
              typesToPotentiallyUnwrap.push(child.name);
              child = definedType.data;
            }
            if (!isStructTypeNode(child)) return node;
            return enumStructVariantTypeNode(node.name, child);
          },
        },
      ])
    );
    assertRootNode(newRoot);

    const histogram = visit(newRoot, getDefinedTypeHistogramVisitor());
    const typesToUnwrap = typesToPotentiallyUnwrap.filter(
      (type) =>
        !histogram[type as MainCaseString] ||
        histogram[type as MainCaseString].total === 0
    );

    newRoot = visit(newRoot, unwrapDefinedTypesVisitor(typesToUnwrap));
    assertRootNode(newRoot);

    return newRoot;
  });
}
