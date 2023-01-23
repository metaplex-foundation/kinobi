import { mainCase } from '../utils';
import type { IdlType, IdlTypeEnumVariant } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { TypeTupleNode } from './TypeTupleNode';

export class TypeEnumTupleVariantNode implements Visitable {
  readonly nodeClass = 'TypeEnumTupleVariantNode' as const;

  readonly name: string;

  readonly tuple: TypeTupleNode;

  constructor(name: string, tuple: TypeTupleNode) {
    this.name = mainCase(name);
    this.tuple = tuple;
  }

  static fromIdl(idl: IdlTypeEnumVariant): TypeEnumTupleVariantNode {
    const name = idl.name ?? '';
    return new TypeEnumTupleVariantNode(
      name,
      TypeTupleNode.fromIdl({ tuple: idl.fields as IdlType[] })
    );
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeEnumTupleVariant(this);
  }
}

export function isTypeEnumTupleVariantNode(
  node: Node | null
): node is TypeEnumTupleVariantNode {
  return !!node && node.nodeClass === 'TypeEnumTupleVariantNode';
}

export function assertTypeEnumTupleVariantNode(
  node: Node | null
): asserts node is TypeEnumTupleVariantNode {
  if (!isTypeEnumTupleVariantNode(node)) {
    throw new Error(
      `Expected TypeEnumTupleVariantNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
