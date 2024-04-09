import { Node, isNode } from '../Node';
import { FixedSizeTypeNode } from './FixedSizeTypeNode';
import { SizePrefixTypeNode } from './SizePrefixTypeNode';
import { TYPE_NODES, TypeNode } from './TypeNode';

export type NestedTypeNode<TType extends TypeNode> =
  | TType
  | ((FixedSizeTypeNode | SizePrefixTypeNode) & {
      type: NestedTypeNode<TType>;
    });

export function resolveNestedTypeNode<TType extends TypeNode>(
  typeNode: NestedTypeNode<TType>
): TType {
  switch (typeNode.kind) {
    case 'fixedSizeTypeNode':
    case 'sizePrefixTypeNode':
      return resolveNestedTypeNode<TType>(
        typeNode.type as NestedTypeNode<TType>
      );
    default:
      return typeNode;
  }
}

export function transformNestedTypeNode<
  TFrom extends TypeNode,
  TTo extends TypeNode,
>(
  typeNode: NestedTypeNode<TFrom>,
  map: (type: TFrom) => TTo
): NestedTypeNode<TTo> {
  switch (typeNode.kind) {
    case 'fixedSizeTypeNode':
    case 'sizePrefixTypeNode':
      return {
        ...typeNode,
        type: transformNestedTypeNode(
          typeNode.type as NestedTypeNode<TFrom>,
          map
        ),
      } as NestedTypeNode<TTo>;
    default:
      return map(typeNode);
  }
}

export function isNestedTypeNode<TKind extends TypeNode['kind']>(
  node: Node | null | undefined,
  kind: TKind | TKind[]
): node is NestedTypeNode<Extract<TypeNode, { kind: TKind }>> {
  if (!isNode(node, TYPE_NODES)) return false;
  const kinds = Array.isArray(kind) ? kind : [kind];
  const resolved = resolveNestedTypeNode(node);
  return !!node && kinds.includes(resolved.kind as TKind);
}
