import * as nodes from '../nodes';
import { BaseThrowVisitor } from './BaseThrowVisitor';
import {
  DeduplicateIdenticalDefinedTypesVisitor,
  SetAnchorDiscriminatorsVisitor,
  SetInstructionAccountDefaultValuesVisitor,
  UnwrapInstructionArgsDefinedTypesVisitor,
  UnwrapInstructionArgsStructVisitor,
  TransformU8ArraysToBytesVisitor,
} from './transformers';

export class DefaultVisitor extends BaseThrowVisitor<nodes.RootNode> {
  visitRoot(currentRoot: nodes.RootNode): nodes.RootNode {
    let root: nodes.Node = currentRoot;
    // Anchor discriminators.
    root = root.accept(new SetAnchorDiscriminatorsVisitor());

    // Defined types.
    root = root.accept(new DeduplicateIdenticalDefinedTypesVisitor());

    // Instructions.
    root = root.accept(new SetInstructionAccountDefaultValuesVisitor());
    root = root.accept(new UnwrapInstructionArgsDefinedTypesVisitor());
    root = root.accept(new UnwrapInstructionArgsStructVisitor());

    // Extras.
    root = root.accept(new TransformU8ArraysToBytesVisitor());
    nodes.assertRootNode(root);
    return root;
  }
}
