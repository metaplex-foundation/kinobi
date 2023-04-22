import type { IdlTypeOption } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import type { Node } from './Node';
import { NumberTypeNode } from './NumberTypeNode';

export class OptionTypeNode implements Visitable {
  readonly nodeClass = 'OptionTypeNode' as const;

  readonly item: TypeNode;

  readonly prefix: NumberTypeNode;

  readonly fixed: boolean;

  readonly idlType: 'option' | 'coption';

  constructor(
    item: TypeNode,
    options: {
      prefix?: NumberTypeNode;
      fixed?: boolean;
      idlType?: OptionTypeNode['idlType'];
    } = {}
  ) {
    this.item = item;
    this.prefix = options.prefix ?? new NumberTypeNode('u8');
    this.fixed = options.fixed ?? false;
    this.idlType = options.idlType ?? 'option';
  }

  static fromIdl(idl: IdlTypeOption): OptionTypeNode {
    const item = 'option' in idl ? idl.option : idl.coption;
    const defaultPrefix = new NumberTypeNode('option' in idl ? 'u8' : 'u32');
    const defaultFixed = !('option' in idl);
    return new OptionTypeNode(createTypeNodeFromIdl(item), {
      prefix: idl.prefix ? new NumberTypeNode(idl.prefix) : defaultPrefix,
      fixed: idl.fixed !== undefined ? idl.fixed : defaultFixed,
      idlType: 'option' in idl ? 'option' : 'coption',
    });
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeOption(this);
  }
}

export function isOptionTypeNode(node: Node | null): node is OptionTypeNode {
  return !!node && node.nodeClass === 'OptionTypeNode';
}

export function assertOptionTypeNode(
  node: Node | null
): asserts node is OptionTypeNode {
  if (!isOptionTypeNode(node)) {
    throw new Error(
      `Expected OptionTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
