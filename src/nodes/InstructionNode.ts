import { camelCase, mainCase } from '../shared';
import type { IdlInstruction } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { ImportFrom } from '../shared';
import type { Node } from './Node';
import { createTypeNodeFromIdl } from './TypeNode';
import { StructTypeNode } from './StructTypeNode';
import { StructFieldTypeNode } from './StructFieldTypeNode';
import { vScalar } from './ValueNode';
import { isLinkTypeNode, LinkTypeNode } from './LinkTypeNode';
import { InstructionDataArgsNode } from './InstructionDataArgsNode';
import { InstructionExtraArgsNode } from './InstructionExtraArgsNode';
import { InstructionAccountNode } from './InstructionAccountNode';

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

export type InstructionNode = {
  readonly __instructionNode: unique symbol;
  readonly nodeClass: 'InstructionNode';
  readonly name: string;
  readonly accountNodes: InstructionAccountNode[];
  readonly dataArgsNode: InstructionDataArgsNode;
  readonly extraArgsNode: InstructionExtraArgsNode;
  readonly subInstructionNodes: InstructionNode[];
  readonly idlName: string;
  readonly docs: string[];
  readonly internal: boolean;
  readonly bytesCreatedOnChain: InstructionNodeBytesCreatedOnChain | null;
  readonly argDefaults: Record<string, InstructionNodeArgDefaults>;
};

export type InstructionNodeInput = {
  // ...
};

export function instructionNode(input: InstructionNodeInput): InstructionNode {
  return { ...input, nodeClass: 'InstructionNode' } as InstructionNode;
}

export function instructionNodeFromIdl(
  idl: InstructionNodeIdl
): InstructionNode {
  return instructionNode(idl);
}

export class InstructionNode implements Visitable {
  readonly nodeClass = 'InstructionNode' as const;

  readonly metadata: InstructionNodeMetadata;

  readonly accounts: InstructionNodeAccount[];

  readonly args: StructTypeNode | LinkTypeNode;

  readonly extraArgs: StructTypeNode | LinkTypeNode;

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

    const accounts = idl.accounts ?? [];

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
    return isLinkTypeNode(this.args);
  }

  get hasLinkedExtraArgs(): boolean {
    return isLinkTypeNode(this.extraArgs);
  }

  get hasAccounts(): boolean {
    return this.accounts.length > 0;
  }

  get hasData(): boolean {
    if (isLinkTypeNode(this.args)) return true;
    return this.args.fields.length > 0;
  }

  get hasArgs(): boolean {
    if (isLinkTypeNode(this.args)) return true;
    const nonOmittedFields = this.args.fields.filter(
      (field) => field.metadata.defaultsTo?.strategy !== 'omitted'
    );
    return nonOmittedFields.length > 0;
  }

  get hasExtraArgs(): boolean {
    if (isLinkTypeNode(this.extraArgs)) return true;
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
