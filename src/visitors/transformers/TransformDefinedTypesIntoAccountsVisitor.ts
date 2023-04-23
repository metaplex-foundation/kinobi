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
      nodes.assertStructTypeNode(node.data);
      return nodes.accountNode({
        ...node,
        data: nodes.accountDataNode({
          name: `${node.name}AccountData`,
          struct: node.data,
        }),
        size: undefined,
        discriminator: undefined,
        seeds: [],
      });
    });

    return nodes.programNode({
      ...program,
      accounts: [...program.accounts, ...newAccounts],
      definedTypes: newDefinedTypes,
    });
  }
}
