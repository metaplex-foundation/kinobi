import type { IdlTypeArray, IdlTypeVec } from '../idl';
import {
  SizeStrategy,
  fixedSize,
  prefixedSize,
  remainderSize,
} from '../shared/SizeStrategy';
import type { Node } from './Node';
import { numberTypeNode } from './NumberTypeNode';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export type ArrayTypeNode = {
  readonly __arrayTypeNode: unique symbol;
  readonly nodeClass: 'ArrayTypeNode';
  readonly childNode: TypeNode;
  readonly size: SizeStrategy;
};

export function arrayTypeNode(
  childNode: TypeNode,
  options: {
    readonly size?: ArrayTypeNode['size'];
  } = {}
): ArrayTypeNode {
  return {
    nodeClass: 'ArrayTypeNode',
    childNode,
    size: options.size ?? prefixedSize(),
  } as ArrayTypeNode;
}

export function arrayTypeNodeFromIdl(
  idl: IdlTypeArray | IdlTypeVec
): ArrayTypeNode {
  if ('array' in idl) {
    const childNode = createTypeNodeFromIdl(idl.array[0]);
    return arrayTypeNode(childNode, { size: fixedSize(idl.array[1]) });
  }

  const childNode = createTypeNodeFromIdl(idl.vec);
  if (!idl.size) return arrayTypeNode(childNode);
  if (idl.size === 'remainder') {
    return arrayTypeNode(childNode, { size: remainderSize() });
  }
  return arrayTypeNode(childNode, {
    size: prefixedSize(numberTypeNode(idl.size)),
  });
}

export function isArrayTypeNode(node: Node | null): node is ArrayTypeNode {
  return !!node && node.nodeClass === 'ArrayTypeNode';
}

export function assertArrayTypeNode(
  node: Node | null
): asserts node is ArrayTypeNode {
  if (!isArrayTypeNode(node)) {
    throw new Error(
      `Expected ArrayTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
