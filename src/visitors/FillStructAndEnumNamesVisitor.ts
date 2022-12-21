import * as nodes from '../nodes';
import { BaseNodeVisitor } from './BaseNodeVisitor';

export class FillStructAndEnumNamesVisitor extends BaseNodeVisitor {
  visitDefinedType(definedType: nodes.DefinedTypeNode): nodes.Node {
    // Ignore if the struct or enum already has a name.
    if (definedType.type.name) {
      return definedType;
    }

    const updatedType = nodes.isTypeStructNode(definedType.type)
      ? new nodes.TypeStructNode(definedType.name, definedType.type.fields)
      : new nodes.TypeEnumNode(definedType.name, definedType.type.variants);

    return new nodes.DefinedTypeNode(
      definedType.name,
      updatedType,
      definedType.docs,
    );
  }

  visitAccount(account: nodes.AccountNode): nodes.Node {
    // No need to visit the account trees.
    return account;
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node {
    // No need to visit the instruction trees.
    return instruction;
  }
}
