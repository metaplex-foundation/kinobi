import { camelCase, pascalCase } from '../utils';
import type { IdlInstruction } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { createTypeNodeFromIdl } from './TypeNode';
import { TypeStructNode } from './TypeStructNode';

export type InstructionNodeAccountDefaults =
  | { kind: 'address'; address: string }
  | { kind: 'program'; program: { name: string; address: string } }
  | { kind: 'programId' };

export type InstructionNodeAccount = {
  name: string;
  isMutable: boolean;
  isSigner: boolean;
  isOptionalSigner: boolean;
  isOptional: boolean;
  description: string;
  defaultsTo: InstructionNodeAccountDefaults | null;
};

export type InstructionNodeMetadata = {
  name: string;
  idlName: string;
  docs: string[];
  internal: boolean;
};

export class InstructionNode implements Visitable {
  readonly nodeClass = 'InstructionNode' as const;

  constructor(
    readonly metadata: InstructionNodeMetadata,
    readonly accounts: InstructionNodeAccount[],
    readonly args: TypeStructNode
  ) {}

  static fromIdl(idl: Partial<IdlInstruction>): InstructionNode {
    const idlName = idl.name ?? '';
    const metadata = {
      name: pascalCase(idlName),
      idlName,
      docs: idl.docs ?? [],
      internal: false,
    };

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

    let args = TypeStructNode.fromIdl({
      kind: 'struct',
      name: idl.name ? `${idl.name}InstructionArgs` : '',
      fields: idl.args ?? [],
    });

    if (idl.discriminant) {
      const discriminatorField = {
        name: 'discriminator',
        type: createTypeNodeFromIdl(idl.discriminant.type),
        docs: [],
        defaultsTo: {
          value: idl.discriminant.value,
          strategy: 'omitted' as const,
        },
      };
      args = new TypeStructNode(args.name, [
        discriminatorField,
        ...args.fields,
      ]);
    }

    return new InstructionNode(metadata, accounts, args);
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitInstruction(this);
  }

  get name(): string {
    return this.metadata.name;
  }

  get docs(): string[] {
    return this.metadata.docs;
  }

  get hasAccounts(): boolean {
    return this.accounts.length > 0;
  }

  get hasArgs(): boolean {
    return this.args.fields.length > 0;
  }
}

export function isInstructionNode(node: Node | null): node is InstructionNode {
  return !!node && node.nodeClass === 'InstructionNode';
}

export function assertInstructionNode(
  node: Node | null
): asserts node is InstructionNode {
  if (!isInstructionNode(node)) {
    throw new Error(
      `Expected InstructionNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
