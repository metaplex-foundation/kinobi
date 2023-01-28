import { camelCase, mainCase } from '../utils';
import type { IdlInstruction } from '../idl';
import type { Dependency, Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { createTypeNodeFromIdl } from './TypeNode';
import { TypeStructNode } from './TypeStructNode';
import { TypeStructFieldNode } from './TypeStructFieldNode';
import { vScalar } from './ValueNode';

export type InstructionNodeMetadata = {
  name: string;
  idlName: string;
  docs: string[];
  internal: boolean;
  bytesCreatedOnChain: InstructionNodeBytesCreatedOnChain;
};

export type InstructionNodeAccount = {
  name: string;
  isWritable: boolean;
  isSigner: boolean;
  isOptionalSigner: boolean;
  isOptional: boolean;
  description: string;
  defaultsTo: InstructionNodeAccountDefaults;
};

export type InstructionNodeAccountDefaults =
  | { kind: 'publicKey'; publicKey: string }
  | { kind: 'account'; name: string }
  | { kind: 'identity' }
  | { kind: 'payer' }
  | {
      kind: 'pda';
      pdaAccount: string;
      dependency: Dependency;
      seeds: Record<string, InstructionNodeAccountDefaultsSeed>;
    }
  | { kind: 'program'; program: { name: string; publicKey: string } }
  | { kind: 'programId' }
  | { kind: 'none' };

export type InstructionNodeAccountDefaultsSeed =
  | { kind: 'account'; name: string }
  | { kind: 'arg'; name: string };

export type InstructionNodeBytesCreatedOnChain =
  | { kind: 'number'; value: number; includeHeader: boolean }
  | { kind: 'arg'; name: string; includeHeader: boolean }
  | {
      kind: 'account';
      name: string;
      dependency: string;
      includeHeader: boolean;
    }
  | { kind: 'none' };

export class InstructionNode implements Visitable {
  readonly nodeClass = 'InstructionNode' as const;

  readonly metadata: InstructionNodeMetadata;

  readonly accounts: InstructionNodeAccount[];

  readonly args: TypeStructNode;

  readonly subInstructions: InstructionNode[];

  constructor(
    metadata: InstructionNodeMetadata,
    accounts: InstructionNodeAccount[],
    args: TypeStructNode,
    subInstructions: InstructionNode[]
  ) {
    const bytes = metadata.bytesCreatedOnChain;
    this.metadata = {
      ...metadata,
      name: mainCase(metadata.name),
      bytesCreatedOnChain:
        'name' in bytes ? { ...bytes, name: mainCase(bytes.name) } : bytes,
    };
    this.accounts = accounts.map((account) => {
      const { defaultsTo } = account;
      if (defaultsTo.kind === 'account') {
        defaultsTo.name = mainCase(defaultsTo.name);
      } else if (defaultsTo.kind === 'program') {
        defaultsTo.program.name = mainCase(defaultsTo.program.name);
      } else if (defaultsTo.kind === 'pda') {
        defaultsTo.pdaAccount = mainCase(defaultsTo.pdaAccount);
        defaultsTo.seeds = Object.fromEntries(
          Object.entries(defaultsTo.seeds).map(([key, seed]) => [
            mainCase(key),
            { ...seed, name: mainCase(seed.name) },
          ])
        );
      }
      return { ...account, name: mainCase(account.name), defaultsTo };
    });
    this.args = args;
    this.subInstructions = subInstructions;
  }

  static fromIdl(idl: Partial<IdlInstruction>): InstructionNode {
    const idlName = idl.name ?? '';
    const name = camelCase(idlName);
    const useProgramIdForOptionalAccounts =
      idl.defaultOptionalAccounts ?? false;
    const metadata: InstructionNodeMetadata = {
      name,
      idlName,
      docs: idl.docs ?? [],
      internal: false,
      bytesCreatedOnChain: { kind: 'none' },
    };

    const accounts = (idl.accounts ?? []).map(
      (account): InstructionNodeAccount => {
        const isOptional = account.optional ?? false;
        return {
          name: camelCase(account.name ?? ''),
          isWritable: account.isMut ?? false,
          isSigner: account.isSigner ?? false,
          isOptionalSigner: account.isOptionalSigner ?? false,
          isOptional,
          description: account.desc ?? '',
          defaultsTo:
            isOptional && useProgramIdForOptionalAccounts
              ? { kind: 'programId' }
              : { kind: 'none' },
        };
      }
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
            strategy: 'omitted',
            value: vScalar(idl.discriminant.value),
          },
        },
        createTypeNodeFromIdl(idl.discriminant.type)
      );
      args = new TypeStructNode(args.name, [
        discriminatorField,
        ...args.fields,
      ]);
    }

    return new InstructionNode(metadata, accounts, args, []);
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitInstruction(this);
  }

  getAllSubInstructions(): InstructionNode[] {
    return this.subInstructions.flatMap((subInstruction) => [
      subInstruction,
      ...subInstruction.getAllSubInstructions(),
    ]);
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
    const nonOmittedFields = this.args.fields.filter(
      (field) => field.metadata.defaultsTo?.strategy !== 'omitted'
    );
    return nonOmittedFields.length > 0;
  }

  get hasRequiredArgs(): boolean {
    const requiredFields = this.args.fields.filter(
      (field) => field.metadata.defaultsTo === null
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
