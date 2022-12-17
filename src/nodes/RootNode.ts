import type { Idl } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { AccountNode } from './AccountNode';
import { DefinedTypeNode } from './DefinedTypeNode';
import type { InstructionNode } from './InstructionNode';

export class RootNode implements Visitable {
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
    const definedTypes = (idl.types ?? []).map(DefinedTypeNode.fromIdl);
    return new RootNode(idl, name, address, accounts, [], definedTypes, null);
  }

  visit(visitor: Visitor): void {
    visitor.visitRoot(this);
  }

  visitChildren(visitor: Visitor): void {
    this.accounts.forEach((account) => account.visit(visitor));
    this.instructions.forEach((instruction) => instruction.visit(visitor));
    this.definedTypes.forEach((type) => type.visit(visitor));
  }
}
