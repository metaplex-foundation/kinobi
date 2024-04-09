import {
  fixedSizeTypeNode,
  numberTypeNode,
  NumberTypeNode,
  resolveNestedTypeNode,
  ResolveNestedTypeNode,
  StringTypeNode,
  stringTypeNode,
} from '../../../src';

{
  // [ResolveNestedTypeNode]: it constraints the nested type of a node.
  const stringNestedNode = fixedSizeTypeNode(stringTypeNode(), 32);
  const numberNestedNode = fixedSizeTypeNode(numberTypeNode('u32'), 32);
  stringNestedNode satisfies ResolveNestedTypeNode<StringTypeNode>;
  numberNestedNode satisfies ResolveNestedTypeNode<NumberTypeNode>;
  // @ts-expect-error The nested type is not a number.
  stringNestedNode satisfies ResolveNestedTypeNode<NumberTypeNode>;
  // @ts-expect-error The nested type is not a string.
  numberNestedNode satisfies ResolveNestedTypeNode<StringTypeNode>;
}

{
  // [resolveNestedTypeNode]: it unwraps the nested type of a node.
  const stringNestedNode = fixedSizeTypeNode(stringTypeNode(), 32);
  const numberNestedNode = fixedSizeTypeNode(numberTypeNode('u32'), 32);
  resolveNestedTypeNode(stringNestedNode) satisfies StringTypeNode;
  resolveNestedTypeNode(numberNestedNode) satisfies NumberTypeNode;
  // @ts-expect-error The nested type is not a number.
  resolveNestedTypeNode(stringNestedNode) satisfies NumberTypeNode;
  // @ts-expect-error The nested type is not a string.
  resolveNestedTypeNode(numberNestedNode) satisfies StringTypeNode;
}
