import * as nodes from '../nodes';
import { BaseNodeVisitor } from './BaseNodeVisitor';

export class InlineDefinedTypesVisitor extends BaseNodeVisitor {
  protected definedTypes = new Map<string, nodes.DefinedTypeNode>();

  protected typesToInline: string[] | '*';

  constructor(typesToInline: string[] | '*' = '*') {
    super();
    this.typesToInline = typesToInline;
  }

  visitProgram(program: nodes.ProgramNode): nodes.Node {
    program.definedTypes.forEach((definedType) => {
      this.definedTypes.set(definedType.name, definedType);
    });

    return new nodes.ProgramNode(
      program.idl,
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
        .filter((definedType) => !this.shouldInline(definedType.name))
        .map((definedType) => {
          const child = definedType.accept(this);
          nodes.assertDefinedTypeNode(child);
          return child;
        }),
      program.errors,
    );
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.TypeDefinedLinkNode): nodes.Node {
    const shouldInline = this.shouldInline(typeDefinedLink.definedType);
    const definedType = this.definedTypes.get(typeDefinedLink.definedType);

    if (!shouldInline) {
      return typeDefinedLink;
    }

    if (definedType === undefined) {
      throw new Error(
        `Trying to inline missing defined type [${typeDefinedLink.definedType}]. ` +
          `Ensure this visitor starts from the root node to access all defined types.`,
      );
    }

    return definedType.type.accept(this);
  }

  protected shouldInline(definedTypeName: string): boolean {
    return (
      this.typesToInline === '*' || this.typesToInline.includes(definedTypeName)
    );
  }
}
