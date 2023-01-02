import { assertRootNode, Node, ProgramInputs, RootNode } from './nodes';
import { DefaultVisitor, Visitable, Visitor } from './visitors';

export class Kinobi implements Visitable {
  public rootNode: RootNode;

  constructor(idls: ProgramInputs, useDefaultVisitor = true) {
    this.rootNode = RootNode.fromProgramInputs(idls);
    if (useDefaultVisitor) this.update(new DefaultVisitor());
  }

  accept<T>(visitor: Visitor<T>): T {
    return this.rootNode.accept(visitor);
  }

  update(visitor: Visitor<Node | null>): Kinobi {
    const newRoot = this.rootNode.accept(visitor);
    assertRootNode(newRoot);
    this.rootNode = newRoot;
    return this;
  }
}
