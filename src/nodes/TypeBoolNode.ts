import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { TypeNumberNode } from './TypeNumberNode';

export class TypeBoolNode implements Visitable {
  readonly nodeClass = 'TypeBoolNode' as const;

  readonly size: TypeNumberNode;

  constructor(options: { size?: TypeNumberNode } = {}) {
    this.size = options.size ?? new TypeNumberNode('u8');
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeBool(this);
  }

  toString(): string {
    return `bool(${this.size.toString()})`;
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
