import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { NumberTypeNode } from './NumberTypeNode';

export class BoolTypeNode implements Visitable {
  readonly nodeClass = 'BoolTypeNode' as const;

  readonly size: NumberTypeNode;

  constructor(options: { size?: NumberTypeNode } = {}) {
    this.size = options.size ?? new NumberTypeNode('u8');
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeBool(this);
  }

  toString(): string {
    return `bool(${this.size.toString()})`;
  }
}

export function isBoolTypeNode(node: Node | null): node is BoolTypeNode {
  return !!node && node.nodeClass === 'BoolTypeNode';
}

export function assertBoolTypeNode(
  node: Node | null
): asserts node is BoolTypeNode {
  if (!isBoolTypeNode(node)) {
    throw new Error(`Expected BoolTypeNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}
