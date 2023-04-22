import { mainCase } from '../utils';
import type { IdlTypeEnum } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { EnumEmptyVariantTypeNode } from './EnumEmptyVariantTypeNode';
import { EnumStructVariantTypeNode } from './EnumStructVariantTypeNode';
import { EnumTupleVariantTypeNode } from './EnumTupleVariantTypeNode';
import type { EnumVariantTypeNode } from './EnumVariantTypeNode';

export type EnumTypeNode = {
  readonly __enumTypeNode: unique symbol;
  readonly nodeClass: 'EnumTypeNode';
};

export type EnumTypeNodeInput = {
  // ...
};

export function enumTypeNode(input: EnumTypeNodeInput): EnumTypeNode {
  return { ...input, nodeClass: 'EnumTypeNode' } as EnumTypeNode;
}

export function enumTypeNodeFromIdl(idl: EnumTypeNodeIdl): EnumTypeNode {
  return enumTypeNode(idl);
}

export class EnumTypeNode implements Visitable {
  readonly nodeClass = 'EnumTypeNode' as const;

  readonly name: string;

  readonly variants: EnumVariantTypeNode[];

  constructor(name: string, variants: EnumVariantTypeNode[]) {
    this.name = mainCase(name);
    this.variants = variants;
  }

  static fromIdl(idl: IdlTypeEnum): EnumTypeNode {
    const variants = idl.variants.map((variant): EnumVariantTypeNode => {
      if (!variant.fields || variant.fields.length <= 0) {
        return EnumEmptyVariantTypeNode.fromIdl(variant);
      }

      if (isStructField(variant.fields[0])) {
        return EnumStructVariantTypeNode.fromIdl(variant);
      }

      return EnumTupleVariantTypeNode.fromIdl(variant);
    });

    return new EnumTypeNode(idl.name ?? '', variants);
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeEnum(this);
  }

  isScalarEnum(): boolean {
    return this.variants.every(
      (variant) => variant.nodeClass === 'EnumEmptyVariantTypeNode'
    );
  }

  isDataEnum(): boolean {
    return !this.isScalarEnum();
  }
}

export function isEnumTypeNode(node: Node | null): node is EnumTypeNode {
  return !!node && node.nodeClass === 'EnumTypeNode';
}

export function assertEnumTypeNode(
  node: Node | null
): asserts node is EnumTypeNode {
  if (!isEnumTypeNode(node)) {
    throw new Error(`Expected EnumTypeNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}

function isStructField(field: any): boolean {
  return typeof field === 'object' && 'name' in field && 'type' in field;
}
