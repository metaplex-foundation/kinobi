import * as nodes from '../nodes';
import { BaseNodeVisitor } from './BaseNodeVisitor';

export class InlineStructsForInstructionArgsVisitor extends BaseNodeVisitor {
  visitAccount(account: nodes.AccountNode): nodes.Node {
    return account;
  }

  visitInstructionArgs(instructionArgs: nodes.InstructionArgsNode): nodes.Node {
    const visitedArgs = instructionArgs.args.accept(this);
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

    return new nodes.InstructionArgsNode(
      hasConflictingNames ? visitedArgs : new nodes.TypeStructNode(inlinedArgs),
    );
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): nodes.Node {
    return definedType;
  }
}
