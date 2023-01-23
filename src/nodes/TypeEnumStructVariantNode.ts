import { mainCase } from '../utils';
import type { IdlTypeEnumField, IdlTypeEnumVariant } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { TypeStructNode } from './TypeStructNode';

export class TypeEnumStructVariantNode implements Visitable {
  readonly nodeClass = 'TypeEnumStructVariantNode' as const;

  readonly name: string;

  readonly struct: TypeStructNode;

  constructor(name: string, struct: TypeStructNode) {
    this.name = mainCase(name);
    this.struct = struct;
  }

  static fromIdl(idl: IdlTypeEnumVariant): TypeEnumStructVariantNode {
    const name = idl.name ?? '';
    return new TypeEnumStructVariantNode(
      name,
      TypeStructNode.fromIdl({
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

export function isTypeEnumStructVariantNode(
  node: Node | null
): node is TypeEnumStructVariantNode {
  return !!node && node.nodeClass === 'TypeEnumStructVariantNode';
}

export function assertTypeEnumStructVariantNode(
  node: Node | null
): asserts node is TypeEnumStructVariantNode {
  if (!isTypeEnumStructVariantNode(node)) {
    throw new Error(
      `Expected TypeEnumStructVariantNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
