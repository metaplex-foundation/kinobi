import type { IdlInstructionArg } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { TypeStructNode } from './TypeStructNode';

export class InstructionArgsNode implements Visitable {
  readonly nodeClass = 'InstructionArgsNode' as const;

  constructor(readonly args: TypeStructNode) {}

  static fromIdl(idlArgs: IdlInstructionArg[]): InstructionArgsNode {
    return new InstructionArgsNode(
      TypeStructNode.fromIdl({
        kind: 'struct',
        fields: idlArgs ?? [],
      }),
    );
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitInstructionArgs(this);
  }
}

export function isInstructionArgsNode(node: Node): node is InstructionArgsNode {
  return node.nodeClass === 'InstructionArgsNode';
}

export function assertInstructionArgsNode(
  node: Node,
): asserts node is InstructionArgsNode {
  if (!isInstructionArgsNode(node)) {
    throw new Error(`Expected InstructionArgsNode, got ${node.nodeClass}.`);
  }
}
