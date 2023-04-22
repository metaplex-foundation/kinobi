import { NodeSelector } from '../NodeSelector';
import { TransformNodesVisitor } from './TransformNodesVisitor';

export type DeleteNode = {
  readonly __deleteNode: unique symbol;
  readonly nodeClass: 'DeleteNode';
};

export type DeleteNodeInput = {
  // ...
};

export function deleteNode(input: DeleteNodeInput): DeleteNode {
  return { ...input, nodeClass: 'DeleteNode' } as DeleteNode;
}

export function deleteNodeFromIdl(idl: DeleteNodeIdl): DeleteNode {
  return deleteNode(idl);
}

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
