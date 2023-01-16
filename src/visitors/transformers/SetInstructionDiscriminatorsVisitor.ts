import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

export class SetInstructionDiscriminatorsVisitor extends TransformNodesVisitor {
  constructor(readonly map: Record<string, string>) {
    const transforms = Object.entries(map).map(
      ([selectorStack, discriminator]): NodeTransform => {
        const stack = selectorStack.split('.');
        const name = stack.pop();
        return {
          selector: { type: 'instruction', stack, name },
          transformer: (node) => {
            nodes.assertInstructionNode(node);
            console.log(discriminator);

            // TODO
            const discriminatorField = new nodes.TypeStructFieldNode(
              {
                name: 'discriminator',
                docs: [],
                defaultsTo: {
                  kind: 'json',
                  strategy: 'omitted',
                  value: 1,
                },
              },
              new nodes.TypeLeafNode('u8')
            );

            const args = new nodes.TypeStructNode(node.args.name, [
              discriminatorField,
              ...node.args.fields,
            ]);

            return new nodes.InstructionNode(
              node.metadata,
              node.accounts,
              args
            );
          },
        };
      }
    );

    super(transforms);
  }
}
