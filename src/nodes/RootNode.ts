import type { Idl } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { AccountNode } from './AccountNode';
import type { InstructionNode } from './InstructionNode';
import type { TypeNode } from './TypeNode';

export class RootNode implements Visitable {
  constructor(
    readonly idl: object,
    readonly name: string,
    readonly accounts: AccountNode[],
    readonly instructions: InstructionNode[],
    readonly types: TypeNode[],
  ) {}

  visit(visitor: Visitor): void {
    visitor.visitRoot(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  visitChildren(visitor: Visitor): void {
    //
  }
}

export function parseRootNode(idl: Partial<Idl>): RootNode {
  //
}
