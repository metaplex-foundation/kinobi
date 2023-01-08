import * as nodes from '../../nodes';
import { NodeSelector } from '../NodeSelector';
import { TransformNodesVisitor } from './TransformNodesVisitor';

export class MarkNodesAsInternalVisitor extends TransformNodesVisitor {
  constructor(selectors: NodeSelector[]) {
    super(
      selectors.map((selector) => ({
        selector,
        transformer: (node: nodes.Node) => {
          if (nodes.isProgramNode(node)) {
            return new nodes.ProgramNode(
              { ...node.metadata, internal: true },
              node.accounts,
              node.instructions,
              node.definedTypes,
              node.errors
            );
          }

          if (nodes.isAccountNode(node)) {
            return new nodes.AccountNode(
              { ...node.metadata, internal: true },
              node.type
            );
          }

          if (nodes.isDefinedTypeNode(node)) {
            return new nodes.DefinedTypeNode(
              { ...node.metadata, internal: true },
              node.type
            );
          }

          if (nodes.isInstructionNode(node)) {
            return new nodes.InstructionNode(
              { ...node.metadata, internal: true },
              node.accounts,
              node.args
            );
          }

          throw new Error(
            `Node of type [${node.nodeClass}] cannot be marked as internal.`
          );
        },
      }))
    );
  }
}
