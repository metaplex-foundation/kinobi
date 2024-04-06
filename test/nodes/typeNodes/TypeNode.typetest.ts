import {
  fixedSizeTypeNode,
  NumberTypeNode,
  ResolveNestedTypeNode,
  stringTypeNode,
} from '../../../src';

{
  // [ResolveNestedTypeNode]: TODO
  const node = fixedSizeTypeNode(stringTypeNode(), 32);
  node satisfies ResolveNestedTypeNode<NumberTypeNode>;
}
