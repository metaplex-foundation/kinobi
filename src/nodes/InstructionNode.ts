import { camelCase, pascalCase } from '../utils';
import type { IdlInstruction } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
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
  type: TypeNode;
  value: number | string | number[];
};

export type InstructionMetadata = {
  idlName: string;
  defaultOptionalAccounts: boolean;
};

export class InstructionNode implements Visitable {
  readonly nodeClass = 'InstructionNode' as const;

  constructor(
    readonly name: string,
    readonly accounts: InstructionNodeAccount[],
    readonly args: TypeStructNode,
    readonly discriminator: InstructionNodeDiscriminator | null,
    readonly metadata: InstructionMetadata
  ) {}

  static fromIdl(idl: Partial<IdlInstruction>): InstructionNode {
    const accounts = (idl.accounts ?? []).map(
      (account): InstructionNodeAccount => ({
        name: camelCase(account.name ?? ''),
        isMutable: account.isMut ?? false,
        isSigner: account.isSigner ?? false,
        isOptionalSigner: account.isOptionalSigner ?? false,
        isOptional: account.optional ?? false,
        description: account.desc ?? '',
        defaultsTo: null,
      })
    );

    return new InstructionNode(
      pascalCase(idl.name ?? ''),
      accounts,
      TypeStructNode.fromIdl({
        kind: 'struct',
        name: idl.name ? `${idl.name}InstructionArgs` : '',
        fields: idl.args ?? [],
      }),
      idl.discriminant
        ? {
            type: createTypeNodeFromIdl(idl.discriminant.type),
            value: idl.discriminant.value,
          }
        : null,
      {
        idlName: idl.name ?? '',
        defaultOptionalAccounts: idl.defaultOptionalAccounts ?? false,
      }
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
  node: Node
): asserts node is InstructionNode {
  if (!isInstructionNode(node)) {
    throw new Error(`Expected InstructionNode, got ${node.nodeClass}.`);
  }
}
