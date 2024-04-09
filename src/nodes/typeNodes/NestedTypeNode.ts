import { FixedSizeTypeNode } from './FixedSizeTypeNode';
import { SizePrefixTypeNode } from './SizePrefixTypeNode';
import { TypeNode } from './TypeNode';

export type ResolveNestedTypeNode<TType extends TypeNode> =
  | TType
  | ((FixedSizeTypeNode | SizePrefixTypeNode) & {
      type: ResolveNestedTypeNode<TType>;
    });

export function resolveNestedTypeNode<TType extends TypeNode>(
  typeNode: ResolveNestedTypeNode<TType>
): TType {
  switch (typeNode.kind) {
    case 'fixedSizeTypeNode':
    case 'sizePrefixTypeNode':
      return resolveNestedTypeNode<TType>(
        typeNode.type as ResolveNestedTypeNode<TType>
      );
    default:
      return typeNode;
  }
}

export function transformNestedTypeNode<
  TFrom extends TypeNode,
  TTo extends TypeNode,
>(
  typeNode: ResolveNestedTypeNode<TFrom>,
  map: (type: TFrom) => TTo
): ResolveNestedTypeNode<TTo> {
  switch (typeNode.kind) {
    case 'fixedSizeTypeNode':
    case 'sizePrefixTypeNode':
      return {
        ...typeNode,
        type: transformNestedTypeNode(
          typeNode.type as ResolveNestedTypeNode<TFrom>,
          map
        ),
      } as ResolveNestedTypeNode<TTo>;
    default:
      return map(typeNode);
  }
}

export function isNestedTypeNode<TType extends TypeNode>(
  typeNode: TypeNode
): typeNode is ResolveNestedTypeNode<TType> {
  // const kinds = Array.isArray(kind) ? kind : [kind];
  // return !!node && (kinds as NodeKind[]).includes(node.kind);
  return (
    typeNode.kind === 'fixedSizeTypeNode' ||
    typeNode.kind === 'sizePrefixTypeNode'
  );
}
