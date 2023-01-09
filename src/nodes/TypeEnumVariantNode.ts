import type { IdlType, IdlTypeEnumField, IdlTypeEnumVariant } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { TypeStructNode } from './TypeStructNode';
import { TypeTupleNode } from './TypeTupleNode';

export type TypeEnumVariantNodeChild =
  | { kind: 'struct'; struct: TypeStructNode }
  | { kind: 'tuple'; tuple: TypeTupleNode }
  | { kind: 'empty' };

export class TypeEnumVariantNode implements Visitable {
  readonly nodeClass = 'TypeEnumVariantNode' as const;

  constructor(
    readonly name: string,
    readonly child: TypeEnumVariantNodeChild
  ) {}

  static fromIdl(idl: IdlTypeEnumVariant): TypeEnumVariantNode {
    const name = idl.name ?? '';

    if (!idl.fields || idl.fields.length <= 0) {
      return new TypeEnumVariantNode(name, { kind: 'empty' });
    }

    function isStructField(field: any): boolean {
      return typeof field === 'object' && 'name' in field && 'type' in field;
    }

    if (isStructField(idl.fields[0])) {
      return new TypeEnumVariantNode(name, {
        kind: 'struct',
        struct: TypeStructNode.fromIdl({
          kind: 'struct',
          name,
          fields: idl.fields as IdlTypeEnumField[],
        }),
      });
    }

    return new TypeEnumVariantNode(name, {
      kind: 'tuple',
      tuple: TypeTupleNode.fromIdl({ tuple: idl.fields as IdlType[] }),
    });
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeEnumVariant(this);
  }
}

export function isTypeEnumVariantNode(
  node: Node | null
): node is TypeEnumVariantNode {
  return !!node && node.nodeClass === 'TypeEnumVariantNode';
}

export function assertTypeEnumVariantNode(
  node: Node | null
): asserts node is TypeEnumVariantNode {
  if (!isTypeEnumVariantNode(node)) {
    throw new Error(
      `Expected TypeEnumVariantNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
