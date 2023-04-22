import * as nodes from '../../nodes';
import { BaseNodeVisitor } from '../BaseNodeVisitor';

export class TransformDefinedTypesIntoAccountsVisitor extends BaseNodeVisitor {
  constructor(readonly definedTypes: string[]) {
    super();
  }

  visitProgram(program: nodes.ProgramNode): nodes.Node {
    const typesToExtract = program.definedTypes.filter((node) =>
      this.definedTypes.includes(node.name)
    );

    const newDefinedTypes = program.definedTypes.filter(
      (node) => !this.definedTypes.includes(node.name)
    );

    const newAccounts = typesToExtract.map((node) => {
      nodes.assertStructTypeNode(node.type);
      return new nodes.AccountNode(
        {
          ...node.metadata,
          size: null,
          discriminator: null,
          seeds: [],
          gpaFields: [],
        },
        node.type
      );
    });

    return new nodes.ProgramNode(
      program.metadata,
      [...program.accounts, ...newAccounts],
      program.instructions,
      newDefinedTypes,
      program.errors
    );
  }
}
