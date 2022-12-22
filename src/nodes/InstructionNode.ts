import type { IdlInstruction } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { assertTypeLeafNode, TypeLeafNode } from './TypeLeafNode';
import { createTypeNodeFromIdl } from './TypeNode';
import { TypeStructNode } from './TypeStructNode';

export type InstructionNodeAccountDefaults =
  | { kind: 'address'; address: string }
  | { kind: 'program'; program: { name: string; address: string } }
  | { kind: 'programId' }
  | null;

export type InstructionNodeAccount = {
  name: string;
  isMutable: boolean;
  isSigner: boolean;
  isOptionalSigner: boolean;
  isOptional: boolean;
  description: string;
  defaultsTo: InstructionNodeAccountDefaults;
};

export type InstructionNodeDiscriminator = {
  type: TypeLeafNode;
  value: number; // TODO(loris): open up to strings and bytes?
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
        defaultsTo: null,
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
      TypeStructNode.fromIdl({
        kind: 'struct',
        name: idl.name ? `${idl.name}InstructionArgs` : '',
        fields: idl.args ?? [],
      }),
      discriminator,
      idl.defaultOptionalAccounts ?? false,
    );
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitInstruction(this);
  }

  get hasAccounts(): boolean {
    return this.accounts.length > 0;
  }

  get hasDiscriminator(): boolean {
    return Boolean(this.discriminator);
  }

  get hasArgs(): boolean {
    return this.args.fields.length > 0;
  }

  get hasData(): boolean {
    return this.hasArgs || this.hasDiscriminator;
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
