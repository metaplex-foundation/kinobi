import { camelCase, pascalCase } from '../utils';
import type { IdlInstruction } from '../idl';
import type { Dependency, Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { createTypeNodeFromIdl } from './TypeNode';
import { TypeStructNode } from './TypeStructNode';
import { TypeStructFieldNode } from './TypeStructFieldNode';

export type InstructionNodeAccountDefaults =
  | { kind: 'address'; address: string }
  | { kind: 'account'; name: string }
  | { kind: 'identity' }
  | { kind: 'payer' }
  | {
      kind: 'pda';
      account: string;
      dependency?: Dependency;
      seeds?: Record<string, string>;
    }
  | { kind: 'program'; program: { name: string; address: string } }
  | { kind: 'programId' }
  | { kind: 'none' };

export type InstructionNodeAccount = {
  name: string;
  isWritable: boolean;
  isSigner: boolean;
  isOptionalSigner: boolean;
  isOptional: boolean;
  description: string;
  defaultsTo: InstructionNodeAccountDefaults;
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
    const name = pascalCase(idlName);
    const metadata = { name, idlName, docs: idl.docs ?? [], internal: false };

    const accounts = (idl.accounts ?? []).map(
      (account): InstructionNodeAccount => ({
        name: camelCase(account.name ?? ''),
        isWritable: account.isMut ?? false,
        isSigner: account.isSigner ?? false,
        isOptionalSigner: account.isOptionalSigner ?? false,
        isOptional: account.optional ?? false,
        description: account.desc ?? '',
        defaultsTo: { kind: 'none' },
      })
    );

    let args = TypeStructNode.fromIdl({
      kind: 'struct',
      name: name ? `${name}InstructionArgs` : '',
      fields: idl.args ?? [],
    });

    if (idl.discriminant) {
      const discriminatorField = new TypeStructFieldNode(
        {
          name: 'discriminator',
          docs: [],
          defaultsTo: {
            kind: 'json',
            strategy: 'omitted',
            value: idl.discriminant.value,
          },
        },
        createTypeNodeFromIdl(idl.discriminant.type)
      );
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

  get hasData(): boolean {
    return this.args.fields.length > 0;
  }

  get hasArgs(): boolean {
    const requiredFields = this.args.fields.filter(
      (field) => field.metadata.defaultsTo.kind === 'none'
    );
    return requiredFields.length > 0;
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
