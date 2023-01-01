import * as nodes from '../../nodes';
import { BaseNodeVisitor } from '../BaseNodeVisitor';

export class UnwrapDefinedTypesVisitor extends BaseNodeVisitor {
  protected availableDefinedTypes = new Map<string, nodes.DefinedTypeNode>();

  protected typesToInline: string[] | '*';

  constructor(typesToInline: string[] | '*' = '*') {
    super();
    this.typesToInline = typesToInline;
  }

  visitRoot(root: nodes.RootNode): nodes.Node {
    root.allDefinedTypes.forEach((definedType) => {
      this.availableDefinedTypes.set(definedType.name, definedType);
    });

    return super.visitRoot(root);
  }

  visitProgram(program: nodes.ProgramNode): nodes.Node {
    return new nodes.ProgramNode(
      program.metadata,
      program.accounts
        .map((account) => account.accept(this))
        .filter(nodes.assertNodeFilter(nodes.assertAccountNode)),
      program.instructions
        .map((instruction) => instruction.accept(this))
        .filter(nodes.assertNodeFilter(nodes.assertInstructionNode)),
      program.definedTypes
        .filter((definedType) => !this.shouldInline(definedType))
        .map((type) => type.accept(this))
        .filter(nodes.assertNodeFilter(nodes.assertDefinedTypeNode)),
      program.errors
    );
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.TypeDefinedLinkNode): nodes.Node {
    const definedType = this.availableDefinedTypes.get(
      typeDefinedLink.definedType
    );

    if (definedType === undefined) {
      throw new Error(
        `Trying to inline missing defined type [${typeDefinedLink.definedType}]. ` +
          `Ensure this visitor starts from the root node to access all defined types.`
      );
    }

    if (!this.shouldInline(definedType)) {
      return typeDefinedLink;
    }

    return definedType.type.accept(this);
  }

  protected shouldInline(definedType: nodes.DefinedTypeNode): boolean {
    return (
      this.typesToInline === '*' ||
      this.typesToInline.includes(definedType.name)
    );
  }
}
