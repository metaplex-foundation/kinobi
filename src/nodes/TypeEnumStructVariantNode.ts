import { mainCase } from '../utils';
import type { IdlTypeEnumField, IdlTypeEnumVariant } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { StructTypeNode } from './StructTypeNode';

export class EnumStructVariantTypeNode implements Visitable {
  readonly nodeClass = 'EnumStructVariantTypeNode' as const;

  readonly name: string;

  readonly struct: StructTypeNode;

  constructor(name: string, struct: StructTypeNode) {
    this.name = mainCase(name);
    this.struct = struct;
  }

  static fromIdl(idl: IdlTypeEnumVariant): EnumStructVariantTypeNode {
    const name = idl.name ?? '';
    return new EnumStructVariantTypeNode(
      name,
      StructTypeNode.fromIdl({
        kind: 'struct',
        name,
        fields: idl.fields as IdlTypeEnumField[],
      })
    );
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeEnumStructVariant(this);
  }
}

export function isEnumStructVariantTypeNode(
  node: Node | null
): node is EnumStructVariantTypeNode {
  return !!node && node.nodeClass === 'EnumStructVariantTypeNode';
}

export function assertEnumStructVariantTypeNode(
  node: Node | null
): asserts node is EnumStructVariantTypeNode {
  if (!isEnumStructVariantTypeNode(node)) {
    throw new Error(
      `Expected EnumStructVariantTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
