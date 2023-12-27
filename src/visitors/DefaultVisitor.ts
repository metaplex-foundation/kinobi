import * as nodes from '../nodes';
import { BaseThrowVisitor } from './BaseThrowVisitor';
import { deduplicateIdenticalDefinedTypesVisitor } from './deduplicateIdenticalDefinedTypesVisitor';
import { flattenInstructionArgsStructVisitor } from './flattenInstructionArgsStructVisitor';
import { setAnchorDiscriminatorsVisitor } from './setAnchorDiscriminatorsVisitor';
import { setFixedAccountSizesVisitor } from './setFixedAccountSizesVisitor';
import {
  DEFAULT_INSTRUCTION_ACCOUNT_DEFAULT_RULES,
  setInstructionAccountDefaultValuesVisitor,
} from './setInstructionAccountDefaultValuesVisitor';
import {
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
    updateRoot(deduplicateIdenticalDefinedTypesVisitor());

    // Accounts.
    updateRoot(setAnchorDiscriminatorsVisitor());
    updateRoot(setFixedAccountSizesVisitor());

    // Instructions.
    updateRoot(
      setInstructionAccountDefaultValuesVisitor(
        DEFAULT_INSTRUCTION_ACCOUNT_DEFAULT_RULES
      )
    );
    updateRoot(new UnwrapInstructionArgsDefinedTypesVisitor());
    updateRoot(flattenInstructionArgsStructVisitor());

    // Extras.
    updateRoot(new TransformU8ArraysToBytesVisitor());

    return root;
  }
}
