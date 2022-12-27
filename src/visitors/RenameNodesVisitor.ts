import * as nodes from '../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

type RenameMap = Record<
  string,
  {
    instructions?: Record<string, string>;
    accounts?: Record<string, string>;
    types?: Record<string, string>;
    errors?: Record<string, string>;
  }
>;

export class RenameNodesVisitor extends TransformNodesVisitor {
  constructor(renameMap: RenameMap) {
    const transforms: NodeTransform[] = Object.entries(renameMap).flatMap(
      ([program, map]) => [
        ...Object.entries(map.instructions ?? {}).map(
          ([oldName, newName]): NodeTransform => ({
            selector: { instruction: oldName, program },
            transformer: (node: nodes.Node) => {
              nodes.assertInstructionNode(node);
              return new nodes.InstructionNode(
                newName,
                node.accounts,
                node.args,
                node.discriminator,
                node.defaultOptionalAccounts
              );
            },
          })
        ),
        ...Object.entries(map.accounts ?? {}).map(
          ([oldName, newName]): NodeTransform => ({
            selector: { account: oldName, program },
            transformer: (node: nodes.Node) => {
              nodes.assertAccountNode(node);
              return new nodes.AccountNode(newName, node.type, node.docs);
            },
          })
        ),
        ...Object.entries(map.types ?? {}).map(
          ([oldName, newName]): NodeTransform => ({
            selector: { type: oldName, program },
            transformer: (node: nodes.Node) => {
              nodes.assertDefinedTypeNode(node);
              return new nodes.DefinedTypeNode(newName, node.type, node.docs);
            },
          })
        ),
        ...Object.entries(map.errors ?? {}).map(
          ([oldName, newName]): NodeTransform => ({
            selector: { error: oldName, program },
            transformer: (node: nodes.Node) => {
              nodes.assertErrorNode(node);
              return new nodes.ErrorNode(
                newName,
                node.code,
                node.message,
                node.docs
              );
            },
          })
        ),
      ]
    );

    super(transforms);
  }
}
