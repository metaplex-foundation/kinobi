import { mainCase } from '../utils';
import type { Idl } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { AccountNode } from './AccountNode';
import { DefinedTypeNode } from './DefinedTypeNode';
import { ErrorNode } from './ErrorNode';
import { InstructionNode } from './InstructionNode';
import type { Node } from './Node';

export type ProgramNodeMetadata = {
  name: string;
  prefix: string;
  publicKey: string;
  version: string;
  origin: 'shank' | 'anchor' | null;
  idl: Partial<Idl>;
  internal: boolean;
};

export class ProgramNode implements Visitable {
  readonly nodeClass = 'ProgramNode' as const;

  readonly metadata: ProgramNodeMetadata;

  readonly accounts: AccountNode[];

  readonly instructions: InstructionNode[];

  readonly definedTypes: DefinedTypeNode[];

  readonly errors: ErrorNode[];

  constructor(
    metadata: ProgramNodeMetadata,
    accounts: AccountNode[],
    instructions: InstructionNode[],
    definedTypes: DefinedTypeNode[],
    errors: ErrorNode[]
  ) {
    this.metadata = {
      ...metadata,
      name: mainCase(metadata.name),
      prefix: mainCase(metadata.prefix),
    };
    this.accounts = accounts;
    this.instructions = instructions;
    this.definedTypes = definedTypes;
    this.errors = errors;
  }

  static fromIdl(idl: Partial<Idl>): ProgramNode {
    const origin = idl.metadata?.origin ?? null;
    const accounts = (idl.accounts ?? []).map(AccountNode.fromIdl);
    const instructions = (idl.instructions ?? []).map((ix) => {
      if (origin === 'anchor') {
        return InstructionNode.fromIdl({
          ...ix,
          defaultOptionalAccounts: ix.defaultOptionalAccounts ?? true,
        });
      }
      return InstructionNode.fromIdl(ix);
    });
    const definedTypes = (idl.types ?? []).map(DefinedTypeNode.fromIdl);
    const errors = (idl.errors ?? []).map(ErrorNode.fromIdl);
    const metadata = {
      name: idl.name ?? '',
      prefix: '',
      publicKey: idl.metadata?.address ?? '',
      version: idl.version ?? '',
      origin,
      idl,
      internal: false,
    };

    return new ProgramNode(
      metadata,
      accounts,
      instructions,
      definedTypes,
      errors
    );
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitProgram(this);
  }

  get name(): string {
    return this.metadata.name;
  }

  get instructionsWithSubs(): InstructionNode[] {
    return this.instructions.flatMap((instruction) => [
      instruction,
      ...instruction.getAllSubInstructions(),
    ]);
  }
}

export function isProgramNode(node: Node | null): node is ProgramNode {
  return !!node && node.nodeClass === 'ProgramNode';
}

export function assertProgramNode(
  node: Node | null
): asserts node is ProgramNode {
  if (!isProgramNode(node)) {
    throw new Error(`Expected ProgramNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}
