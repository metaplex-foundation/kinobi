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
    return new nodes.RootNode(
      root.idl,
      root.name,
      root.address,
      root.accounts.map((account) => {
        const child = account.accept(this);
        nodes.assertAccountNode(child);
        return child;
      }),
      root.instructions.map((instruction) => {
        const child = instruction.accept(this);
        nodes.assertInstructionNode(child);
        return child;
      }),
      root.definedTypes
        .filter((definedType) => !this.definedTypes.has(definedType.name))
        .map((definedType) => {
          const child = definedType.accept(this);
          nodes.assertDefinedTypeNode(child);
          return child;
        }),
      root.origin,
    );
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.TypeDefinedLinkNode): nodes.Node {
    const definedType = this.definedTypes.get(typeDefinedLink.definedType);

    if (definedType === undefined) {
      return typeDefinedLink;
    }

    return definedType.type.accept(this);
  }
}
