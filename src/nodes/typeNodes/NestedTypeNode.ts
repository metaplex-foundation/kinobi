import { FixedSizeTypeNode } from './FixedSizeTypeNode';
import { SizePrefixTypeNode } from './SizePrefixTypeNode';
import { TypeNode } from './TypeNode';

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

export function isNestedTypeNode<TType extends TypeNode>(
  typeNode: TypeNode
): typeNode is NestedTypeNode<TType> {
  // const kinds = Array.isArray(kind) ? kind : [kind];
  // return !!node && (kinds as NodeKind[]).includes(node.kind);
  return (
    typeNode.kind === 'fixedSizeTypeNode' ||
    typeNode.kind === 'sizePrefixTypeNode'
  );
}
