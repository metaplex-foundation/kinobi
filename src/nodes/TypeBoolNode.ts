import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { TypeNumberNode } from './TypeNumberNode';

export class TypeBoolNode implements Visitable {
  readonly nodeClass = 'TypeBoolNode' as const;

  readonly prefix: TypeNumberNode;

  readonly fixed: boolean;

  constructor(options: { prefix?: TypeNumberNode; fixed?: boolean } = {}) {
    this.prefix = options.prefix ?? new TypeNumberNode('u8');
    this.fixed = options.fixed ?? false;
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeBool(this);
  }

  toString(): string {
    const fixed = this.fixed ? '; fixed' : '';
    return `bool(${this.prefix.toString() + fixed})`;
  }
}

export function isTypeBoolNode(node: Node | null): node is TypeBoolNode {
  return !!node && node.nodeClass === 'TypeBoolNode';
}

export function assertTypeBoolNode(
  node: Node | null
): asserts node is TypeBoolNode {
  if (!isTypeBoolNode(node)) {
    throw new Error(`Expected TypeBoolNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}
