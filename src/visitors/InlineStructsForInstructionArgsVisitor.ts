import * as nodes from '../nodes';
import { BaseNodeVisitor } from './BaseNodeVisitor';

export class InlineStructsForInstructionArgsVisitor extends BaseNodeVisitor {
  visitAccount(account: nodes.AccountNode): nodes.Node {
    return account;
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node {
    const visitedArgs = instruction.args.accept(this);
    nodes.assertTypeStructNode(visitedArgs);

    const inlinedArgs = visitedArgs.fields.reduce<nodes.TypeStructNodeField[]>(
      (all, one) => {
        if (nodes.isTypeStructNode(one.type)) {
          all.push(...one.type.fields);
        } else {
          all.push(one);
        }
        return all;
      },
      [],
    );

    const inlinedArgsNames = inlinedArgs.map((arg) => arg.name);
    const hasConflictingNames =
      new Set(inlinedArgsNames).size !== inlinedArgsNames.length;

    return new nodes.InstructionNode(
      instruction.name,
      instruction.accounts,
      hasConflictingNames ? visitedArgs : new nodes.TypeStructNode(inlinedArgs),
      instruction.discriminator,
      instruction.defaultOptionalAccounts,
    );
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): nodes.Node {
    return definedType;
  }
}
