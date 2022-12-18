import type { IdlInstruction } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import type { TypeLeafNode } from './TypeLeafNode';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';

export type InstructionNodeAccount = {
  name: string;
  isMutable: boolean;
  isSigner: boolean;
  isOptional: boolean;
  description: string;
};

export type InstructionNodeArg = {
  name: string;
  type: TypeNode;
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
    readonly args: InstructionNodeArg[],
    readonly discriminator: InstructionNodeDiscriminator | null = null,
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
    const args = (idl.args ?? []).map(
      (arg): InstructionNodeArg => ({
        name: arg.name ?? '',
        type: createTypeNodeFromIdl(arg.type),
      }),
    );
    const discriminator: InstructionNodeDiscriminator | null = idl.discriminant
      ? {
          type: createTypeNodeFromIdl(idl.discriminant.type) as TypeLeafNode,
          value: idl.discriminant.value,
        }
      : null;
    const defaultOptionalAccounts = idl.defaultOptionalAccounts ?? false;

    return new InstructionNode(
      name,
      accounts,
      args,
      discriminator,
      defaultOptionalAccounts,
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
