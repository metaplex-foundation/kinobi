import { camelCase } from '../utils';
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
  address: string;
  version: string;
  origin: 'shank' | 'anchor' | null;
};

export class ProgramNode implements Visitable {
  readonly nodeClass = 'ProgramNode' as const;

  constructor(
    readonly idl: Partial<Idl>,
    readonly metadata: ProgramNodeMetadata,
    readonly accounts: AccountNode[],
    readonly instructions: InstructionNode[],
    readonly definedTypes: DefinedTypeNode[],
    readonly errors: ErrorNode[]
  ) {}

  static fromIdl(idl: Partial<Idl>): ProgramNode {
    const accounts = (idl.accounts ?? []).map(AccountNode.fromIdl);
    const instructions = (idl.instructions ?? []).map(InstructionNode.fromIdl);
    const definedTypes = (idl.types ?? []).map(DefinedTypeNode.fromIdl);
    const errors = (idl.errors ?? []).map(ErrorNode.fromIdl);
    const metadata = {
      name: camelCase(idl.name ?? ''),
      prefix: '',
      address: idl.metadata?.address ?? '',
      version: idl.version ?? '',
      origin: idl.metadata?.origin ?? null,
    };

    return new ProgramNode(
      idl,
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
}

export function isProgramNode(node: Node): node is ProgramNode {
  return node.nodeClass === 'ProgramNode';
}

export function assertProgramNode(node: Node): asserts node is ProgramNode {
  if (!isProgramNode(node)) {
    throw new Error(`Expected ProgramNode, got ${node.nodeClass}.`);
  }
}
