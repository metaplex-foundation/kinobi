import * as nodes from '../../nodes';
import { mainCase } from '../../shared';
import { BaseNodeVisitor } from '../BaseNodeVisitor';
import { visit } from '../Visitor';

export class UnwrapDefinedTypesVisitor extends BaseNodeVisitor {
  protected availableDefinedTypes = new Map<string, nodes.DefinedTypeNode>();

  protected typesToInline: string[] | '*';

  constructor(typesToInline: string[] | '*' = '*') {
    super();
    this.typesToInline =
      typesToInline === '*' ? '*' : typesToInline.map(mainCase);
  }

  visitRoot(root: nodes.RootNode): nodes.Node {
    nodes.getAllDefinedTypes(root).forEach((definedType) => {
      this.availableDefinedTypes.set(definedType.name, definedType);
    });

    return super.visitRoot(root);
  }

  visitProgram(program: nodes.ProgramNode): nodes.Node {
    return nodes.programNode({
      ...program,
      accounts: program.accounts
        .map((account) => visit(account, this))
        .filter(nodes.assertNodeFilter(nodes.assertAccountNode)),
      instructions: program.instructions
        .map((instruction) => visit(instruction, this))
        .filter(nodes.assertNodeFilter(nodes.assertInstructionNode)),
      definedTypes: program.definedTypes
        .filter((definedType) => !this.shouldInline(definedType.name))
        .map((type) => visit(type, this))
        .filter(nodes.assertNodeFilter(nodes.assertDefinedTypeNode)),
    });
  }

  visitLinkType(linkType: nodes.LinkTypeNode): nodes.Node {
    if (
      !this.shouldInline(linkType.name) ||
      linkType.importFrom !== 'generated'
    ) {
      return linkType;
    }

    const definedType = this.availableDefinedTypes.get(linkType.name);

    if (definedType === undefined) {
      throw new Error(
        `Trying to inline missing defined type [${linkType.name}]. ` +
          `Ensure this visitor starts from the root node to access all defined types.`
      );
    }

    return visit(definedType.data, this);
  }

  protected shouldInline(definedType: string): boolean {
    return (
      this.typesToInline === '*' || this.typesToInline.includes(definedType)
    );
  }
}
