import * as nodes from '../../nodes';
import { mainCase } from '../../utils';
import { BaseNodeVisitor } from '../BaseNodeVisitor';

export class UnwrapDefinedTypesVisitor extends BaseNodeVisitor {
  protected availableDefinedTypes = new Map<string, nodes.DefinedTypeNode>();

  protected typesToInline: string[] | '*';

  constructor(typesToInline: string[] | '*' = '*') {
    super();
    this.typesToInline =
      typesToInline === '*' ? '*' : typesToInline.map(mainCase);
  }

  visitRoot(root: nodes.RootNode): nodes.Node {
    root.allDefinedTypes.forEach((definedType) => {
      this.availableDefinedTypes.set(definedType.name, definedType);
    });

    return super.visitRoot(root);
  }

  visitProgram(program: nodes.ProgramNode): nodes.Node {
    return nodes.programNode(
      program.metadata,
      program.accounts
        .map((account) => account.accept(this))
        .filter(nodes.assertNodeFilter(nodes.assertAccountNode)),
      program.instructions
        .map((instruction) => instruction.accept(this))
        .filter(nodes.assertNodeFilter(nodes.assertInstructionNode)),
      program.definedTypes
        .filter((definedType) => !this.shouldInline(definedType.name))
        .map((type) => type.accept(this))
        .filter(nodes.assertNodeFilter(nodes.assertDefinedTypeNode)),
      program.errors
    );
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.LinkTypeNode): nodes.Node {
    if (
      !this.shouldInline(typeDefinedLink.name) ||
      typeDefinedLink.importFrom !== 'generated'
    ) {
      return typeDefinedLink;
    }

    const definedType = this.availableDefinedTypes.get(typeDefinedLink.name);

    if (definedType === undefined) {
      throw new Error(
        `Trying to inline missing defined type [${typeDefinedLink.name}]. ` +
          `Ensure this visitor starts from the root node to access all defined types.`
      );
    }

    return definedType.type.accept(this);
  }

  protected shouldInline(definedType: string): boolean {
    return (
      this.typesToInline === '*' || this.typesToInline.includes(definedType)
    );
  }
}
