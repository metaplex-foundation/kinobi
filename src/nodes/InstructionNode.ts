import type { Visitable, Visitor } from '../visitors';

export class InstructionNode implements Visitable {
  visit(visitor: Visitor): void {
    visitor.visitInstruction(this);
  }
}
