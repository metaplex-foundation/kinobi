import type { IdlInstruction } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { TypeLeafNode } from './TypeLeafNode';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';

export type InstructionNodeAccount = {
  name: string;
  isMutable: boolean;
  isSigner: boolean;
  optional: boolean;
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
  constructor(
    readonly name: string,
    readonly accounts: InstructionNodeAccount[],
    readonly args: InstructionNodeArg[],
    readonly discriminator: InstructionNodeDiscriminator | null = null,
    readonly defaultOptionalAccounts = false,
  ) {}

  static fromIdl(idl: Partial<IdlInstruction>): InstructionNode {
    const name = idl.name ?? '';
    const accounts = (idl.accounts ?? []).map((account) => ({
      name: account.name ?? '',
      isMutable: account.isMut ?? false,
      isSigner: account.isSigner ?? false,
      optional: account.optional ?? false,
      description: account.desc ?? '',
    }));
    const args = (idl.args ?? []).map((arg) => ({
      name: arg.name ?? '',
      type: createTypeNodeFromIdl(arg.type),
    }));
    const discriminator = idl.discriminant
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

  visit(visitor: Visitor): void {
    visitor.visitInstruction(this);
  }

  visitChildren(visitor: Visitor): void {
    this.args.forEach((arg) => arg.type.visit(visitor));
    this.discriminator?.type.visit(visitor);
  }
}
