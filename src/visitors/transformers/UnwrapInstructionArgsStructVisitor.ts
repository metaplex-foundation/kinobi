import * as nodes from '../../nodes';
import { BaseNodeVisitor } from '../BaseNodeVisitor';

export class UnwrapInstructionArgsStructVisitor extends BaseNodeVisitor {
  visitInstruction(instruction: nodes.InstructionNode): nodes.Node {
    const currentArgs = instruction.args;
    const inlinedArgs = currentArgs.fields.reduce<nodes.TypeStructFieldNode[]>(
      (all, one) => {
        if (nodes.isTypeStructNode(one.type)) {
          all.push(...one.type.fields);
        } else {
          all.push(one);
        }
        return all;
      },
      []
    );

    const inlinedArgsNames = inlinedArgs.map((arg) => arg.name);
    const hasConflictingNames =
      new Set(inlinedArgsNames).size !== inlinedArgsNames.length;

    return new nodes.InstructionNode(
      instruction.metadata,
      instruction.accounts,
      hasConflictingNames
        ? currentArgs
        : new nodes.TypeStructNode(currentArgs.name, inlinedArgs)
    );
  }

  visitAccount(account: nodes.AccountNode): nodes.Node {
    // No need to visit the account trees.
    return account;
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): nodes.Node {
    // No need to visit the defined type trees.
    return definedType;
  }
}
