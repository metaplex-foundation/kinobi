import * as nodes from '../nodes';
import { BaseThrowVisitor } from './BaseThrowVisitor';
import {
  AutoSetAnchorDiscriminatorsVisitor,
  AutoSetFixedAccountSizesVisitor,
  DeduplicateIdenticalDefinedTypesVisitor,
  DEFAULT_INSTRUCTION_ACCOUNT_DEFAULT_RULES,
  SetInstructionAccountDefaultValuesVisitor,
  TransformU8ArraysToBytesVisitor,
  UnwrapInstructionArgsDefinedTypesVisitor,
  UnwrapInstructionArgsStructVisitor,
} from './transformers';

export class DefaultVisitor extends BaseThrowVisitor<nodes.RootNode> {
  visitRoot(currentRoot: nodes.RootNode): nodes.RootNode {
    let root: nodes.Node = currentRoot;

    // Defined types.
    root = root.accept(new DeduplicateIdenticalDefinedTypesVisitor());

    // Accounts.
    root = root.accept(new AutoSetFixedAccountSizesVisitor());

    // Instructions.
    root = root.accept(new AutoSetAnchorDiscriminatorsVisitor());
    root = root.accept(
      new SetInstructionAccountDefaultValuesVisitor(
        DEFAULT_INSTRUCTION_ACCOUNT_DEFAULT_RULES
      )
    );
    root = root.accept(new UnwrapInstructionArgsDefinedTypesVisitor());
    root = root.accept(new UnwrapInstructionArgsStructVisitor());

    // Extras.
    root = root.accept(new TransformU8ArraysToBytesVisitor());
    nodes.assertRootNode(root);
    return root;
  }
}
