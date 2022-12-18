import * as nodes from '../nodes';
import { BaseNodeVisitor } from './BaseNodeVisitor';

export class InlineDefinedTypesVisitor extends BaseNodeVisitor {
  protected definedTypes = new Map<string, nodes.DefinedTypeNode>();

  constructor(definedTypes: nodes.DefinedTypeNode[]) {
    super();
    definedTypes.forEach((definedType) => {
      this.definedTypes.set(definedType.name, definedType);
    });
  }

  visitRoot(root: nodes.RootNode): nodes.Node {
    // TODO: remove defined types from root.
    return super.visitRoot(root);
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.TypeDefinedLinkNode): nodes.Node {
    const definedType = this.definedTypes.get(typeDefinedLink.definedType);

    if (definedType === undefined) {
      return typeDefinedLink;
    }

    return definedType.type;
  }
}
