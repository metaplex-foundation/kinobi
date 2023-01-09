import type { IdlTypeEnum } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { TypeEnumVariantNode } from './TypeEnumVariantNode';

export class TypeEnumNode implements Visitable {
  readonly nodeClass = 'TypeEnumNode' as const;

  constructor(
    readonly name: string,
    readonly variants: TypeEnumVariantNode[]
  ) {}

  static fromIdl(idl: IdlTypeEnum): TypeEnumNode {
    return new TypeEnumNode(
      idl.name ?? '',
      idl.variants.map(TypeEnumVariantNode.fromIdl)
    );
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeEnum(this);
  }

  isScalarEnum(): boolean {
    return this.variants.every((variant) => variant.child.kind === 'empty');
  }

  isDataEnum(): boolean {
    return !this.isScalarEnum();
  }
}

export function isTypeEnumNode(node: Node | null): node is TypeEnumNode {
  return !!node && node.nodeClass === 'TypeEnumNode';
}

export function assertTypeEnumNode(
  node: Node | null
): asserts node is TypeEnumNode {
  if (!isTypeEnumNode(node)) {
    throw new Error(`Expected TypeEnumNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}
