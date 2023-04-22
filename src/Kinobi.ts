import { assertRootNode, Node, ProgramInputs, RootNode } from './nodes';
import { DefaultVisitor, Visitable, Visitor } from './visitors';

export class Kinobi implements Visitable {
  public root: RootNode;

  constructor(idls: ProgramInputs, useDefaultVisitor = true) {
    this.root = root.fromProgramInputs(idls);
    if (useDefaultVisitor) this.update(new DefaultVisitor());
  }

  accept<T>(visitor: Visitor<T>): T {
    return this.root.accept(visitor);
  }

  update(visitor: Visitor<Node | null>): void {
    const newRoot = this.root.accept(visitor);
    assertRootNode(newRoot);
    this.root = newRoot;
  }

  clone(): Kinobi {
    const newRoot = new RootNode(this.root.programs);
    const kinobi = new Kinobi([]);
    kinobi.root = newRoot;
    return kinobi;
  }
}
