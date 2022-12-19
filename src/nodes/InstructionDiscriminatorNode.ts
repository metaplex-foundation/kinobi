import type { IdlInstructionDiscriminant } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { assertTypeLeafNode, TypeLeafNode } from './TypeLeafNode';
import { createTypeNodeFromIdl } from './TypeNode';

export class InstructionDiscriminatorNode implements Visitable {
  readonly nodeClass = 'InstructionDiscriminatorNode' as const;

  constructor(readonly type: TypeLeafNode, readonly value: number) {}

  static fromIdl(
    discriminant: IdlInstructionDiscriminant,
  ): InstructionDiscriminatorNode {
    const type = createTypeNodeFromIdl(discriminant.type);
    assertTypeLeafNode(type);
    return new InstructionDiscriminatorNode(type, discriminant.value);
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitInstructionDiscriminator(this);
  }
}

export function isInstructionDiscriminatorNode(
  node: Node,
): node is InstructionDiscriminatorNode {
  return node.nodeClass === 'InstructionDiscriminatorNode';
}

export function assertInstructionDiscriminatorNode(
  node: Node,
): asserts node is InstructionDiscriminatorNode {
  if (!isInstructionDiscriminatorNode(node)) {
    throw new Error(
      `Expected InstructionDiscriminatorNode, got ${node.nodeClass}.`,
    );
  }
}
