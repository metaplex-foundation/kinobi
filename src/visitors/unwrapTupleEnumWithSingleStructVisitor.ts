import {
  DefinedTypeNode,
  EnumTupleVariantTypeNode,
  assertIsNode,
  enumStructVariantTypeNode,
  getAllDefinedTypes,
  isNode,
} from '../nodes';
import {
  MainCaseString,
  NodeSelectorFunction,
  NodeStack,
  getNodeSelectorFunction,
} from '../shared';
import { bottomUpTransformerVisitor } from './bottomUpTransformerVisitor';
import { getDefinedTypeHistogramVisitor } from './getDefinedTypeHistogramVisitor';
import { rootNodeVisitor } from './singleNodeVisitor';
import { unwrapDefinedTypesVisitor } from './unwrapDefinedTypesVisitor';
import { visit } from './visitor';

export function unwrapTupleEnumWithSingleStructVisitor(
  enumsOrVariantsToUnwrap: string[] | '*' = '*'
) {
  const selectorFunctions: NodeSelectorFunction[] =
    enumsOrVariantsToUnwrap === '*'
      ? [() => true]
      : enumsOrVariantsToUnwrap.map((selector) =>
          getNodeSelectorFunction(selector)
        );

  const shouldUnwrap = (
    node: EnumTupleVariantTypeNode,
    stack: NodeStack
  ): boolean => selectorFunctions.some((selector) => selector(node, stack));

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
            assertIsNode(node, 'enumTupleVariantTypeNode');
            if (!shouldUnwrap(node, stack)) return node;
            if (node.tuple.children.length !== 1) return node;
            let child = node.tuple.children[0];
            if (isNode(child, 'definedTypeLinkNode')) {
              if (child.importFrom) return node;
              const definedType = definedTypes.get(child.name);
              if (!definedType) return node;
              if (!isNode(definedType.data, 'structTypeNode')) return node;
              typesToPotentiallyUnwrap.push(child.name);
              child = definedType.data;
            }
            if (!isNode(child, 'structTypeNode')) return node;
            return enumStructVariantTypeNode(node.name, child);
          },
        },
      ])
    );
    assertIsNode(newRoot, 'rootNode');

    const histogram = visit(newRoot, getDefinedTypeHistogramVisitor());
    const typesToUnwrap = typesToPotentiallyUnwrap.filter(
      (type) =>
        !histogram[type as MainCaseString] ||
        histogram[type as MainCaseString].total === 0
    );

    newRoot = visit(newRoot, unwrapDefinedTypesVisitor(typesToUnwrap));
    assertIsNode(newRoot, 'rootNode');

    return newRoot;
  });
}
