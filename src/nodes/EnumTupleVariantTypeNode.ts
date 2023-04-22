import { mainCase } from '../utils';
import type { IdlType, IdlTypeEnumVariant } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { TupleTypeNode } from './TupleTypeNode';

export type EnumTupleVariantTypeNode = {
  readonly __enumTupleVariantTypeNode: unique symbol;
  readonly nodeClass: 'EnumTupleVariantTypeNode';
};

export type EnumTupleVariantTypeNodeInput = {
  // ...
};

export function enumTupleVariantTypeNode(
  input: EnumTupleVariantTypeNodeInput
): EnumTupleVariantTypeNode {
  return {
    ...input,
    nodeClass: 'EnumTupleVariantTypeNode',
  } as EnumTupleVariantTypeNode;
}

export function enumTupleVariantTypeNodeFromIdl(
  idl: EnumTupleVariantTypeNodeIdl
): EnumTupleVariantTypeNode {
  return enumTupleVariantTypeNode(idl);
}

export class EnumTupleVariantTypeNode implements Visitable {
  readonly nodeClass = 'EnumTupleVariantTypeNode' as const;

  readonly name: string;

  readonly tuple: TupleTypeNode;

  constructor(name: string, tuple: TupleTypeNode) {
    this.name = mainCase(name);
    this.tuple = tuple;
  }

  static fromIdl(idl: IdlTypeEnumVariant): EnumTupleVariantTypeNode {
    const name = idl.name ?? '';
    return new EnumTupleVariantTypeNode(
      name,
      TupleTypeNode.fromIdl({ tuple: idl.fields as IdlType[] })
    );
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeEnumTupleVariant(this);
  }
}

export function isEnumTupleVariantTypeNode(
  node: Node | null
): node is EnumTupleVariantTypeNode {
  return !!node && node.nodeClass === 'EnumTupleVariantTypeNode';
}

export function assertEnumTupleVariantTypeNode(
  node: Node | null
): asserts node is EnumTupleVariantTypeNode {
  if (!isEnumTupleVariantTypeNode(node)) {
    throw new Error(
      `Expected EnumTupleVariantTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
