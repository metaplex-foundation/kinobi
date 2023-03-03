import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

export class UnwrapTypeDefinedLinksVisitor extends TransformNodesVisitor {
  protected readonly availableDefinedTypes = new Map<
    string,
    nodes.DefinedTypeNode
  >();

  constructor(readonly typeDefinedLinks: string[]) {
    const transforms = typeDefinedLinks.map((selectorStack): NodeTransform => {
      const stack = selectorStack.split('.');
      const name = stack.pop();
      return {
        selector: { type: 'typeDefinedLink', stack, name },
        transformer: (node) => {
          nodes.assertTypeDefinedLinkNode(node);
          if (node.dependency !== 'generated') return node;
          const definedType = this.availableDefinedTypes.get(node.name);
          if (definedType === undefined) {
            throw new Error(
              `Trying to inline missing defined type [${node.name}]. ` +
                `Ensure this visitor starts from the root node to access all defined types.`
            );
          }
          return definedType.type;
        },
      };
    });

    super(transforms);
  }

  visitRoot(root: nodes.RootNode): nodes.Node | null {
    root.allDefinedTypes.forEach((definedType) => {
      this.availableDefinedTypes.set(definedType.name, definedType);
    });

    return super.visitRoot(root);
  }
}
