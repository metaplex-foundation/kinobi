import { Node, isNode } from '../Node';
import type { FixedSizeTypeNode } from './FixedSizeTypeNode';
import type { PostOffsetTypeNode } from './PostOffsetTypeNode';
import type { PreOffsetTypeNode } from './PreOffsetTypeNode';
import type { SentinelTypeNode } from './SentinelTypeNode';
import type { SizePrefixTypeNode } from './SizePrefixTypeNode';
import { TYPE_NODES, TypeNode } from './TypeNode';

export type NestedTypeNode<TType extends TypeNode> =
  | TType
  | FixedSizeTypeNode<NestedTypeNode<TType>>
  | PostOffsetTypeNode<NestedTypeNode<TType>>
  | PreOffsetTypeNode<NestedTypeNode<TType>>
  | SentinelTypeNode<NestedTypeNode<TType>>
  | SizePrefixTypeNode<NestedTypeNode<TType>>;

export function resolveNestedTypeNode<TType extends TypeNode>(
  typeNode: NestedTypeNode<TType>
): TType {
  switch (typeNode.kind) {
    case 'fixedSizeTypeNode':
    case 'postOffsetTypeNode':
    case 'preOffsetTypeNode':
    case 'sentinelTypeNode':
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
    case 'postOffsetTypeNode':
    case 'preOffsetTypeNode':
    case 'sentinelTypeNode':
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

export function assertIsNestedTypeNode<TKind extends TypeNode['kind']>(
  node: Node | null | undefined,
  kind: TKind | TKind[]
): asserts node is NestedTypeNode<Extract<TypeNode, { kind: TKind }>> {
  const kinds = Array.isArray(kind) ? kind : [kind];
  if (!isNestedTypeNode(node, kinds)) {
    throw new Error(
      `Expected nested type of ${kinds.join(' | ')}, got ${node?.kind ?? 'null'}.`
    );
  }
}
