import { mainCase } from '../utils';
import type { IdlTypeEnumVariant } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';

export class TypeEnumEmptyVariantNode implements Visitable {
  readonly nodeClass = 'TypeEnumEmptyVariantNode' as const;

  readonly name: string;

  constructor(name: string) {
    this.name = mainCase(name);
  }

  static fromIdl(idl: IdlTypeEnumVariant): TypeEnumEmptyVariantNode {
    return new TypeEnumEmptyVariantNode(idl.name ?? '');
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeEnumEmptyVariant(this);
  }
}

export function isTypeEnumEmptyVariantNode(
  node: Node | null
): node is TypeEnumEmptyVariantNode {
  return !!node && node.nodeClass === 'TypeEnumEmptyVariantNode';
}

export function assertTypeEnumEmptyVariantNode(
  node: Node | null
): asserts node is TypeEnumEmptyVariantNode {
  if (!isTypeEnumEmptyVariantNode(node)) {
    throw new Error(
      `Expected TypeEnumEmptyVariantNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
