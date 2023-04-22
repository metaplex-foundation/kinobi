import { NodeSelector } from '../NodeSelector';
import { TransformNodesVisitor } from './TransformNodesVisitor';

export class DeleteNodesVisitor extends TransformNodesVisitor {
  constructor(selectors: NodeSelector[]) {
    super(
      selectors.map((selector) => ({
        selector,
        transformer: () => null,
      }))
    );
  }
}
