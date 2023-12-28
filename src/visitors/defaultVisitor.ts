import { Node, RootNode, assertRootNode } from '../nodes';
import { deduplicateIdenticalDefinedTypesVisitor } from './deduplicateIdenticalDefinedTypesVisitor';
import { flattenInstructionArgsStructVisitor } from './flattenInstructionArgsStructVisitor';
import { setAnchorDiscriminatorsVisitor } from './setAnchorDiscriminatorsVisitor';
import { setFixedAccountSizesVisitor } from './setFixedAccountSizesVisitor';
import {
  DEFAULT_INSTRUCTION_ACCOUNT_DEFAULT_RULES,
  setInstructionAccountDefaultValuesVisitor,
} from './setInstructionAccountDefaultValuesVisitor';
import { rootNodeVisitor } from './singleNodeVisitor';
import { transformU8ArraysToBytesVisitor } from './transformU8ArraysToBytesVisitor';
import { unwrapInstructionArgsDefinedTypesVisitor } from './unwrapInstructionArgsDefinedTypesVisitor';
import { Visitor, visit } from './visitor';

export function defaultVisitor() {
  return rootNodeVisitor((currentRoot) => {
    let root: RootNode = currentRoot;
    const updateRoot = (visitor: Visitor<Node | null, 'rootNode'>) => {
      const newRoot = visit(root, visitor);
      assertRootNode(newRoot);
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
  });
}
