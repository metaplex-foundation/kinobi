import {
  assertIsNode,
  isNode,
  Node,
  PublicKeyTypeNode,
  TupleTypeNode,
} from '../../src';

{
  // [isNode]: It narrows the type of a node to the given kind.
  const node = {} as Node | null;
  if (isNode(node, 'tupleTypeNode')) {
    node satisfies TupleTypeNode;
    // @ts-expect-error
    node satisfies PublicKeyTypeNode;
  }
}

{
  // [isNode]: It narrows the type of a node to union of the given kinds.
  const node = {} as Node | null;
  if (isNode(node, ['tupleTypeNode', 'publicKeyTypeNode'])) {
    node satisfies TupleTypeNode | PublicKeyTypeNode;
    // @ts-expect-error
    node satisfies TupleTypeNode;
    // @ts-expect-error
    node satisfies PublicKeyTypeNode;
  }
}

{
  // [assertIsNode]: It narrows the type of a node to the given kind.
  const node = {} as Node | null;
  assertIsNode(node, 'tupleTypeNode');
  node satisfies TupleTypeNode;
  // @ts-expect-error
  node satisfies PublicKeyTypeNode;
}

{
  // [assertIsNode]: It narrows the type of a node to union of the given kinds.
  const node = {} as Node | null;
  assertIsNode(node, ['tupleTypeNode', 'publicKeyTypeNode']);
  node satisfies TupleTypeNode | PublicKeyTypeNode;
  // @ts-expect-error
  node satisfies TupleTypeNode;
  // @ts-expect-error
  node satisfies PublicKeyTypeNode;
}
