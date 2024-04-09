import {
  fixedSizeTypeNode,
  numberTypeNode,
  NumberTypeNode,
  resolveNestedTypeNode,
  NestedTypeNode,
  StringTypeNode,
  stringTypeNode,
} from '../../../src';

{
  // [NestedTypeNode]: it constraints the nested type of a node.
  const stringNestedNode = fixedSizeTypeNode(stringTypeNode(), 32);
  const numberNestedNode = fixedSizeTypeNode(numberTypeNode('u32'), 32);
  stringNestedNode satisfies NestedTypeNode<StringTypeNode>;
  numberNestedNode satisfies NestedTypeNode<NumberTypeNode>;
  // @ts-expect-error The nested type is not a number.
  stringNestedNode satisfies NestedTypeNode<NumberTypeNode>;
  // @ts-expect-error The nested type is not a string.
  numberNestedNode satisfies NestedTypeNode<StringTypeNode>;
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
