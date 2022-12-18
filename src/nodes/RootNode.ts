import type { Idl } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { AccountNode } from './AccountNode';
import { DefinedTypeNode } from './DefinedTypeNode';
import { InstructionNode } from './InstructionNode';
import type { Node } from './Node';

export class RootNode implements Visitable {
  readonly nodeClass = 'RootNode' as const;

  constructor(
    readonly idl: Partial<Idl>,
    readonly name: string,
    readonly address: string,
    readonly accounts: AccountNode[],
    readonly instructions: InstructionNode[],
    readonly definedTypes: DefinedTypeNode[],
    readonly origin: 'shank' | 'anchor' | null,
  ) {}

  static fromIdl(idl: Partial<Idl>): RootNode {
    const name = idl.name ?? '';
    const address = idl.metadata?.address ?? '';
    const accounts = (idl.accounts ?? []).map(AccountNode.fromIdl);
    const instructions = (idl.instructions ?? []).map(InstructionNode.fromIdl);
    const definedTypes = (idl.types ?? []).map(DefinedTypeNode.fromIdl);
    const origin = idl.metadata?.origin ?? null;

    return new RootNode(
      idl,
      name,
      address,
      accounts,
      instructions,
      definedTypes,
      origin,
    );
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
