import type { Idl } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { AccountNode } from './AccountNode';
import type { InstructionNode } from './InstructionNode';
import type { TypeNode } from './TypeNode';

export class RootNode implements Visitable {
  constructor(
    readonly idl: Partial<Idl>,
    readonly name: string,
    readonly address: string,
    readonly accounts: AccountNode[],
    readonly instructions: InstructionNode[],
    readonly types: TypeNode[],
    readonly origin: 'shank' | 'anchor' | null,
  ) {}

  visit(visitor: Visitor): void {
    visitor.visitRoot(this);
  }

  visitChildren(visitor: Visitor): void {
    this.accounts.forEach((account) => account.visit(visitor));
    this.instructions.forEach((instruction) => instruction.visit(visitor));
    this.types.forEach((type) => type.visit(visitor));
  }
}

export function parseRootNode(idl: Partial<Idl>): RootNode {
  const name = idl.name ?? '';
  const address = idl.metadata?.address ?? '';
  return new RootNode(idl, name, address, [], [], [], null);
}
