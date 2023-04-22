import { mainCase } from '../utils';
import type { IdlTypeEnumVariant } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';

export type EnumEmptyVariantTypeNode = {
  readonly __enumEmptyVariantTypeNode: unique symbol;
  readonly nodeClass: 'EnumEmptyVariantTypeNode';
};

export type EnumEmptyVariantTypeNodeInput = {
  // ...
};

export function enumEmptyVariantTypeNode(
  input: EnumEmptyVariantTypeNodeInput
): EnumEmptyVariantTypeNode {
  return {
    ...input,
    nodeClass: 'EnumEmptyVariantTypeNode',
  } as EnumEmptyVariantTypeNode;
}

export function enumEmptyVariantTypeNodeFromIdl(
  idl: EnumEmptyVariantTypeNodeIdl
): EnumEmptyVariantTypeNode {
  return enumEmptyVariantTypeNode(idl);
}

export class EnumEmptyVariantTypeNode implements Visitable {
  readonly nodeClass = 'EnumEmptyVariantTypeNode' as const;

  readonly name: string;

  constructor(name: string) {
    this.name = mainCase(name);
  }

  static fromIdl(idl: IdlTypeEnumVariant): EnumEmptyVariantTypeNode {
    return new EnumEmptyVariantTypeNode(idl.name ?? '');
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeEnumEmptyVariant(this);
  }
}

export function isEnumEmptyVariantTypeNode(
  node: Node | null
): node is EnumEmptyVariantTypeNode {
  return !!node && node.nodeClass === 'EnumEmptyVariantTypeNode';
}

export function assertEnumEmptyVariantTypeNode(
  node: Node | null
): asserts node is EnumEmptyVariantTypeNode {
  if (!isEnumEmptyVariantTypeNode(node)) {
    throw new Error(
      `Expected EnumEmptyVariantTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
