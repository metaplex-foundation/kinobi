import type { Idl } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { AccountNode } from './AccountNode';
import { DefinedTypeNode } from './DefinedTypeNode';
import { InstructionNode } from './InstructionNode';
import type { Node } from './Node';

export type Program = {
  /** Namespaces program name. E.g. "metaplex.tokenMetadata". */
  name: string;
  /** Base 58 representation of the program address. */
  address: string;
  /** The engine that generated the program's IDL. */
  origin: 'shank' | 'anchor' | null;
};

export class RootNode implements Visitable {
  readonly nodeClass = 'RootNode' as const;

  constructor(
    readonly idl: Partial<Idl>,
    readonly programs: Program[],
    readonly accounts: AccountNode[],
    readonly instructions: InstructionNode[],
    readonly definedTypes: DefinedTypeNode[],
  ) {}

  static fromIdl(idl: Partial<Idl>): RootNode {
    const program = {
      name: idl.name ?? '',
      address: idl.metadata?.address ?? '',
      origin: idl.metadata?.origin ?? null,
    };
    const accounts = (idl.accounts ?? []).map((account) =>
      AccountNode.fromIdl(account, program),
    );
    const instructions = (idl.instructions ?? []).map((instruction) =>
      InstructionNode.fromIdl(instruction, program),
    );
    const definedTypes = (idl.types ?? []).map(DefinedTypeNode.fromIdl);

    return new RootNode(idl, [program], accounts, instructions, definedTypes);
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitRoot(this);
  }
}

export function isRootNode(node: Node): node is RootNode {
  return node.nodeClass === 'RootNode';
}

export function assertRootNode(node: Node): asserts node is RootNode {
  if (!isRootNode(node)) {
    throw new Error(`Expected RootNode, got ${node.nodeClass}.`);
  }
}
