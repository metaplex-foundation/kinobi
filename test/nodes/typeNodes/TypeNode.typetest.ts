import {
  fixedSizeTypeNode,
  NumberTypeNode,
  ResolveNestedTypeNode,
  StringTypeNode,
  stringTypeNode,
} from '../../../src';

{
  // [ResolveNestedTypeNode]: it constraints the nested type of a node.
  const node = fixedSizeTypeNode(stringTypeNode(), 32);
  node satisfies ResolveNestedTypeNode<StringTypeNode>;
  // @ts-expect-error The nested type is not a number.
  node satisfies ResolveNestedTypeNode<NumberTypeNode>;
}
