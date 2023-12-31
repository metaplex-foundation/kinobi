import {
  assertIsNode,
  assertIsNodeFilter,
  isNode,
  isNodeFilter,
  Node,
  PublicKeyTypeNode,
  removeNullAndAssertIsNodeFilter,
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

{
  // [isNodeFilter]: It narrows the type of an array of nodes to the given kind.
  const nodes = ([] as (Node | null)[]).filter(isNodeFilter('tupleTypeNode'));
  nodes satisfies TupleTypeNode[];
  // @ts-expect-error
  nodes satisfies PublicKeyTypeNode[];
}

{
  // [isNodeFilter]: It narrows the type of an array of nodes to union of the given kinds.
  const nodes = ([] as (Node | null)[]).filter(
    isNodeFilter(['tupleTypeNode', 'publicKeyTypeNode'])
  );
  nodes satisfies (TupleTypeNode | PublicKeyTypeNode)[];
  // @ts-expect-error
  nodes satisfies TupleTypeNode[];
  // @ts-expect-error
  nodes satisfies PublicKeyTypeNode[];
}

{
  // [assertIsNodeFilter]: It narrows the type of an array of nodes to the given kind.
  const nodes = ([] as (Node | null)[]).filter(
    assertIsNodeFilter('tupleTypeNode')
  );
  nodes satisfies TupleTypeNode[];
  // @ts-expect-error
  nodes satisfies PublicKeyTypeNode[];
}

{
  // [assertIsNodeFilter]: It narrows the type of an array of nodes to union of the given kinds.
  const nodes = ([] as (Node | null)[]).filter(
    assertIsNodeFilter(['tupleTypeNode', 'publicKeyTypeNode'])
  );
  nodes satisfies (TupleTypeNode | PublicKeyTypeNode)[];
  // @ts-expect-error
  nodes satisfies TupleTypeNode[];
  // @ts-expect-error
  nodes satisfies PublicKeyTypeNode[];
}

{
  // [removeNullAndAssertIsNodeFilter]: It narrows the type of an array of nodes to the given kind.
  const nodes = ([] as (Node | null)[]).filter(
    removeNullAndAssertIsNodeFilter('tupleTypeNode')
  );
  nodes satisfies TupleTypeNode[];
  // @ts-expect-error
  nodes satisfies PublicKeyTypeNode[];
}

{
  // [removeNullAndAssertIsNodeFilter]: It narrows the type of an array of nodes to union of the given kinds.
  const nodes = ([] as (Node | null)[]).filter(
    removeNullAndAssertIsNodeFilter(['tupleTypeNode', 'publicKeyTypeNode'])
  );
  nodes satisfies (TupleTypeNode | PublicKeyTypeNode)[];
  // @ts-expect-error
  nodes satisfies TupleTypeNode[];
  // @ts-expect-error
  nodes satisfies PublicKeyTypeNode[];
}
