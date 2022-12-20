import type { IdlInstruction } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { assertTypeLeafNode, TypeLeafNode } from './TypeLeafNode';
import { createTypeNodeFromIdl } from './TypeNode';
import { TypeStructNode } from './TypeStructNode';

export type InstructionNodeAccount = {
  name: string;
  isMutable: boolean;
  isSigner: boolean;
  isOptionalSigner: boolean;
  isOptional: boolean;
  description: string;
};

export type InstructionNodeDiscriminator = {
  type: TypeLeafNode;
  value: number;
};

export class InstructionNode implements Visitable {
  readonly nodeClass = 'InstructionNode' as const;

  constructor(
    readonly name: string,
    readonly accounts: InstructionNodeAccount[],
    readonly args: TypeStructNode,
    readonly discriminator: InstructionNodeDiscriminator | null = null,
    readonly defaultOptionalAccounts = false,
  ) {}

  static fromIdl(idl: Partial<IdlInstruction>): InstructionNode {
    const accounts = (idl.accounts ?? []).map(
      (account): InstructionNodeAccount => ({
        name: account.name ?? '',
        isMutable: account.isMut ?? false,
        isSigner: account.isSigner ?? false,
        isOptionalSigner: account.isOptionalSigner ?? false,
        isOptional: account.optional ?? false,
        description: account.desc ?? '',
      }),
    );
    let discriminator: InstructionNodeDiscriminator | null = null;
    if (idl.discriminant) {
      const discriminatorType = createTypeNodeFromIdl(idl.discriminant.type);
      assertTypeLeafNode(discriminatorType);
      discriminator = {
        type: discriminatorType,
        value: idl.discriminant.value,
      };
    }

    return new InstructionNode(
      idl.name ?? '',
      accounts,
      TypeStructNode.fromIdl({ kind: 'struct', fields: idl.args ?? [] }),
      discriminator,
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
