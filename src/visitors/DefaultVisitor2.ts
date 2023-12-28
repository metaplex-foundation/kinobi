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
import { transformU8ArraysToBytesVisitor } from './transformU8ArraysToBytesVisitor';
import { unwrapInstructionArgsDefinedTypesVisitor } from './unwrapInstructionArgsDefinedTypesVisitor';
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
    updateRoot(unwrapInstructionArgsDefinedTypesVisitor());
    updateRoot(flattenInstructionArgsStructVisitor());

    // Extras.
    updateRoot(transformU8ArraysToBytesVisitor());

    return root;
  }
}
