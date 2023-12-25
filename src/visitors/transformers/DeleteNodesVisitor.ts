import { NodeSelector } from '../../shared';
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
