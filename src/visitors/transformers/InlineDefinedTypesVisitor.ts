import * as nodes from '../../nodes';
import { BaseNodeVisitor } from '../BaseNodeVisitor';

export class InlineDefinedTypesVisitor extends BaseNodeVisitor {
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
      program.accounts.map((account) => {
        const child = account.accept(this);
        nodes.assertAccountNode(child);
        return child;
      }),
      program.instructions.map((instruction) => {
        const child = instruction.accept(this);
        nodes.assertInstructionNode(child);
        return child;
      }),
      program.definedTypes
        .filter((definedType) => !this.shouldInline(definedType))
        .map((definedType) => {
          const child = definedType.accept(this);
          nodes.assertDefinedTypeNode(child);
          return child;
        }),
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
