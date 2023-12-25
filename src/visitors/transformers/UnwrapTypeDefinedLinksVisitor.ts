import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

export class UnwrapTypeDefinedLinksVisitor extends TransformNodesVisitor {
  protected readonly availableDefinedTypes = new Map<
    string,
    nodes.DefinedTypeNode
  >();

  constructor(readonly definedLinksType: string[]) {
    const transforms = definedLinksType.map((selectorStack): NodeTransform => {
      const stack = selectorStack.split('.');
      const name = stack.pop();
      return {
        selector: `${stack.join('.')}.[linkTypeNode]${name}`,
        transformer: (node) => {
          nodes.assertLinkTypeNode(node);
          if (node.importFrom !== 'generated') return node;
          const definedType = this.availableDefinedTypes.get(node.name);
          if (definedType === undefined) {
            throw new Error(
              `Trying to inline missing defined type [${node.name}]. ` +
                `Ensure this visitor starts from the root node to access all defined types.`
            );
          }
          return definedType.data;
        },
      };
    });

    super(transforms);
  }

  visitRoot(root: nodes.RootNode): nodes.Node | null {
    nodes.getAllDefinedTypes(root).forEach((definedType) => {
      this.availableDefinedTypes.set(definedType.name, definedType);
    });

    return super.visitRoot(root);
  }
}
