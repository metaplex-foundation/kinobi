import { camelCase, mainCase } from '../utils';
import type { IdlInstruction } from '../idl';
import type { ImportFrom, Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { createTypeNodeFromIdl } from './TypeNode';
import { StructTypeNode } from './StructTypeNode';
import { StructFieldTypeNode } from './StructFieldTypeNode';
import { ValueNode, vScalar } from './ValueNode';
import {
  isDefinedLinkTypeNode,
  DefinedLinkTypeNode,
} from './DefinedLinkTypeNode';

export type InstructionNodeMetadata = {
  name: string;
  idlName: string;
  docs: string[];
  internal: boolean;
  bytesCreatedOnChain: InstructionNodeBytesCreatedOnChain | null;
  argDefaults: Record<string, InstructionNodeArgDefaults>;
};

export type InstructionNodeAccount = {
  name: string;
  isWritable: boolean;
  isSigner: boolean | 'either';
  isOptional: boolean;
  description: string;
  defaultsTo: InstructionNodeAccountDefaults | null;
};

export type InstructionNodeInputDependency = {
  kind: 'account' | 'arg';
  name: string;
};

export type InstructionNodeArgDefaults =
  | { kind: 'arg'; name: string }
  | { kind: 'account'; name: string }
  | { kind: 'accountBump'; name: string }
  | { kind: 'value'; value: ValueNode }
  | {
      kind: 'resolver';
      name: string;
      importFrom: ImportFrom;
      dependsOn: InstructionNodeInputDependency[];
    };

export type InstructionNodeAccountDefaults =
  | { kind: 'programId' }
  | { kind: 'program'; program: { name: string; publicKey: string } }
  | { kind: 'publicKey'; publicKey: string }
  | { kind: 'account'; name: string }
  | { kind: 'identity' }
  | { kind: 'payer' }
  | {
      kind: 'pda';
      pdaAccount: string;
      importFrom: ImportFrom;
      seeds: Record<string, InstructionNodeAccountDefaultsSeed>;
    }
  | {
      kind: 'resolver';
      name: string;
      importFrom: ImportFrom;
      dependsOn: InstructionNodeInputDependency[];
      resolvedIsSigner?: boolean | 'either';
      resolvedIsOptional?: boolean;
    };

export type InstructionNodeAccountDefaultsSeed =
  | { kind: 'account'; name: string }
  | { kind: 'arg'; name: string }
  | { kind: 'value'; value: ValueNode };

export type InstructionNodeBytesCreatedOnChain =
  | { kind: 'number'; value: number; includeHeader: boolean }
  | { kind: 'arg'; name: string; includeHeader: boolean }
  | {
      kind: 'account';
      name: string;
      importFrom: ImportFrom;
      includeHeader: boolean;
    }
  | { kind: 'resolver'; name: string; importFrom: ImportFrom };

export class InstructionNode implements Visitable {
  readonly nodeClass = 'InstructionNode' as const;

  readonly metadata: InstructionNodeMetadata;

  readonly accounts: InstructionNodeAccount[];

  readonly args: StructTypeNode | DefinedLinkTypeNode;

  readonly extraArgs: StructTypeNode | DefinedLinkTypeNode;

  readonly subInstructions: InstructionNode[];

  constructor(
    metadata: InstructionNodeMetadata,
    accounts: InstructionNodeAccount[],
    args: InstructionNode['args'],
    extraArgs: InstructionNode['extraArgs'],
    subInstructions: InstructionNode[]
  ) {
    const bytes = metadata.bytesCreatedOnChain;
    this.metadata = {
      ...metadata,
      name: mainCase(metadata.name),
      bytesCreatedOnChain:
        bytes && 'name' in bytes
          ? { ...bytes, name: mainCase(bytes.name) }
          : bytes,
      argDefaults: Object.fromEntries(
        Object.entries(metadata.argDefaults).map(([key, value]) => {
          const newValue = { ...value };
          if ('name' in newValue) {
            newValue.name = mainCase(newValue.name);
          }
          if (newValue.kind === 'resolver') {
            newValue.dependsOn = newValue.dependsOn.map((dep) => ({
              ...dep,
              name: mainCase(dep.name),
            }));
          }
          return [mainCase(key), newValue];
        })
      ),
    };
    this.accounts = accounts.map((account) => {
      const { defaultsTo } = account;
      if (defaultsTo?.kind === 'account') {
        defaultsTo.name = mainCase(defaultsTo.name);
      } else if (defaultsTo?.kind === 'program') {
        defaultsTo.program.name = mainCase(defaultsTo.program.name);
      } else if (defaultsTo?.kind === 'pda') {
        defaultsTo.pdaAccount = mainCase(defaultsTo.pdaAccount);
        defaultsTo.seeds = Object.fromEntries(
          Object.entries(defaultsTo.seeds).map(([key, seed]) => [
            mainCase(key),
            seed.kind === 'value'
              ? seed
              : { ...seed, name: mainCase(seed.name) },
          ])
        );
      } else if (defaultsTo?.kind === 'resolver') {
        defaultsTo.name = mainCase(defaultsTo.name);
        defaultsTo.dependsOn = defaultsTo.dependsOn.map((dep) => ({
          ...dep,
          name: mainCase(dep.name),
        }));
      }
      return { ...account, name: mainCase(account.name), defaultsTo };
    });
    this.args = args;
    this.extraArgs = extraArgs;
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
      bytesCreatedOnChain: null,
      argDefaults: {},
    };

    const accounts = (idl.accounts ?? []).map(
      (account): InstructionNodeAccount => {
        const isOptional = account.optional ?? account.isOptional ?? false;
        return {
          name: camelCase(account.name ?? ''),
          isWritable: account.isMut ?? false,
          isSigner: account.isOptionalSigner
            ? 'either'
            : account.isSigner ?? false,
          isOptional,
          description: account.desc ?? '',
          defaultsTo:
            isOptional && useProgramIdForOptionalAccounts
              ? { kind: 'programId' }
              : null,
        };
      }
    );

    let args = StructTypeNode.fromIdl({
      kind: 'struct',
      name: name ? `${name}InstructionData` : '',
      fields: idl.args ?? [],
    });

    if (idl.discriminant) {
      const discriminatorField = new StructFieldTypeNode(
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
      args = new StructTypeNode(args.name, [
        discriminatorField,
        ...args.fields,
      ]);
    }

    const extraArgs = StructTypeNode.fromIdl({
      kind: 'struct',
      name: name ? `${name}InstructionExtra` : '',
      fields: [],
    });

    return new InstructionNode(metadata, accounts, args, extraArgs, []);
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

  get hasLinkedArgs(): boolean {
    return isDefinedLinkTypeNode(this.args);
  }

  get hasLinkedExtraArgs(): boolean {
    return isDefinedLinkTypeNode(this.extraArgs);
  }

  get hasAccounts(): boolean {
    return this.accounts.length > 0;
  }

  get hasData(): boolean {
    if (isDefinedLinkTypeNode(this.args)) return true;
    return this.args.fields.length > 0;
  }

  get hasArgs(): boolean {
    if (isDefinedLinkTypeNode(this.args)) return true;
    const nonOmittedFields = this.args.fields.filter(
      (field) => field.metadata.defaultsTo?.strategy !== 'omitted'
    );
    return nonOmittedFields.length > 0;
  }

  get hasExtraArgs(): boolean {
    if (isDefinedLinkTypeNode(this.extraArgs)) return true;
    const nonOmittedFields = this.extraArgs.fields.filter(
      (field) => field.metadata.defaultsTo?.strategy !== 'omitted'
    );
    return nonOmittedFields.length > 0;
  }

  get hasAnyArgs(): boolean {
    return this.hasArgs || this.hasExtraArgs;
  }

  get hasArgDefaults(): boolean {
    return Object.keys(this.metadata.argDefaults).length > 0;
  }

  get hasArgResolvers(): boolean {
    return Object.values(this.metadata.argDefaults).some(
      ({ kind }) => kind === 'resolver'
    );
  }

  get hasAccountResolvers(): boolean {
    return this.accounts.some(
      ({ defaultsTo }) => defaultsTo?.kind === 'resolver'
    );
  }

  get hasByteResolver(): boolean {
    return this.metadata.bytesCreatedOnChain?.kind === 'resolver';
  }

  get hasResolvers(): boolean {
    return (
      this.hasArgResolvers || this.hasAccountResolvers || this.hasByteResolver
    );
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
