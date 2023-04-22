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
  readonly nodeClass: 'arrayTypeNode';
  readonly child: TypeNode;
  readonly size: SizeStrategy;
};

export function arrayTypeNode(
  child: TypeNode,
  options: {
    readonly size?: ArrayTypeNode['size'];
  } = {}
): ArrayTypeNode {
  return {
    nodeClass: 'arrayTypeNode',
    child,
    size: options.size ?? prefixedSize(),
  } as ArrayTypeNode;
}

export function arrayTypeNodeFromIdl(
  idl: IdlTypeArray | IdlTypeVec
): ArrayTypeNode {
  if ('array' in idl) {
    const child = createTypeNodeFromIdl(idl.array[0]);
    return arrayTypeNode(child, { size: fixedSize(idl.array[1]) });
  }

  const child = createTypeNodeFromIdl(idl.vec);
  if (!idl.size) return arrayTypeNode(child);
  if (idl.size === 'remainder') {
    return arrayTypeNode(child, { size: remainderSize() });
  }
  return arrayTypeNode(child, {
    size: prefixedSize(numberTypeNode(idl.size)),
  });
}

export function isArrayTypeNode(node: Node | null): node is ArrayTypeNode {
  return !!node && node.nodeClass === 'arrayTypeNode';
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
