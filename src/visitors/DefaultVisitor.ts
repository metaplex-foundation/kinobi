import * as nodes from '../nodes';
import { BaseThrowVisitor } from './BaseThrowVisitor';
import { setAnchorDiscriminatorsVisitor } from './setAnchorDiscriminatorsVisitor';
import { setFixedAccountSizesVisitor } from './setFixedAccountSizesVisitor';
import {
  DEFAULT_INSTRUCTION_ACCOUNT_DEFAULT_RULES,
  DeduplicateIdenticalDefinedTypesVisitor,
  FlattenInstructionArgsStructVisitor,
  SetInstructionAccountDefaultValuesVisitor,
  TransformU8ArraysToBytesVisitor,
  UnwrapInstructionArgsDefinedTypesVisitor,
} from './transformers';
import { Visitor, visit } from './visitor';

export class DefaultVisitor extends BaseThrowVisitor<nodes.RootNode> {
  visitRoot(currentRoot: nodes.RootNode): nodes.RootNode {
    let root: nodes.RootNode = currentRoot;
    const updateRoot = (visitor: Visitor<nodes.Node | null, 'rootNode'>) => {
      const newRoot = visit(root, visitor);
      nodes.assertRootNode(newRoot);
      root = newRoot;
    };

    // Defined types.
    updateRoot(new DeduplicateIdenticalDefinedTypesVisitor());

    // Accounts.
    updateRoot(setAnchorDiscriminatorsVisitor());
    updateRoot(setFixedAccountSizesVisitor(nodes.getAllDefinedTypes(root)));

    // Instructions.
    updateRoot(
      new SetInstructionAccountDefaultValuesVisitor(
        DEFAULT_INSTRUCTION_ACCOUNT_DEFAULT_RULES
      )
    );
    updateRoot(new UnwrapInstructionArgsDefinedTypesVisitor());
    updateRoot(new FlattenInstructionArgsStructVisitor());

    // Extras.
    updateRoot(new TransformU8ArraysToBytesVisitor());

    return root;
  }
}
