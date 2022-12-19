import type { IdlInstruction } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { InstructionArgsNode } from './InstructionArgsNode';
import { InstructionDiscriminatorNode } from './InstructionDiscriminatorNode';
import type { Node } from './Node';

export type InstructionNodeAccount = {
  name: string;
  isMutable: boolean;
  isSigner: boolean;
  isOptional: boolean;
  description: string;
};

export class InstructionNode implements Visitable {
  readonly nodeClass = 'InstructionNode' as const;

  constructor(
    readonly name: string,
    readonly accounts: InstructionNodeAccount[],
    readonly args: InstructionArgsNode,
    readonly discriminator: InstructionDiscriminatorNode | null = null,
    readonly defaultOptionalAccounts = false,
  ) {}

  static fromIdl(idl: Partial<IdlInstruction>): InstructionNode {
    const name = idl.name ?? '';
    const accounts = (idl.accounts ?? []).map(
      (account): InstructionNodeAccount => ({
        name: account.name ?? '',
        isMutable: account.isMut ?? false,
        isSigner: account.isSigner ?? false,
        isOptional: account.optional ?? false,
        description: account.desc ?? '',
      }),
    );

    return new InstructionNode(
      name,
      accounts,
      InstructionArgsNode.fromIdl(idl.args ?? []),
      idl.discriminant
        ? InstructionDiscriminatorNode.fromIdl(idl.discriminant)
        : null,
      idl.defaultOptionalAccounts ?? false,
    );
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitInstruction(this);
  }
}

export function isInstructionNode(node: Node): node is InstructionNode {
  return node.nodeClass === 'InstructionNode';
}

export function assertInstructionNode(
  node: Node,
): asserts node is InstructionNode {
  if (!isInstructionNode(node)) {
    throw new Error(`Expected InstructionNode, got ${node.nodeClass}.`);
  }
}
