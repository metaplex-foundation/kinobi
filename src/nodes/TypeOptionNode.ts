import type { IdlTypeOption } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import type { Node } from './Node';
import { TypeNumberNode } from './TypeNumberNode';

export class TypeOptionNode implements Visitable {
  readonly nodeClass = 'TypeOptionNode' as const;

  readonly item: TypeNode;

  readonly prefix: TypeNumberNode;

  readonly fixed: boolean;

  readonly idlType: 'option' | 'coption';

  constructor(
    item: TypeNode,
    options: {
      prefix?: TypeNumberNode;
      fixed?: boolean;
      idlType?: TypeOptionNode['idlType'];
    } = {}
  ) {
    this.item = item;
    this.prefix = options.prefix ?? new TypeNumberNode('u8');
    this.fixed = options.fixed ?? false;
    this.idlType = options.idlType ?? 'option';
  }

  static fromIdl(idl: IdlTypeOption): TypeOptionNode {
    const item = 'option' in idl ? idl.option : idl.coption;
    return new TypeOptionNode(createTypeNodeFromIdl(item), {
      prefix: new TypeNumberNode('option' in idl ? 'u8' : 'u32'),
      fixed: !('option' in idl),
      idlType: 'option' in idl ? 'option' : 'coption',
    });
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeOption(this);
  }
}

export function isTypeOptionNode(node: Node | null): node is TypeOptionNode {
  return !!node && node.nodeClass === 'TypeOptionNode';
}

export function assertTypeOptionNode(
  node: Node | null
): asserts node is TypeOptionNode {
  if (!isTypeOptionNode(node)) {
    throw new Error(
      `Expected TypeOptionNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
