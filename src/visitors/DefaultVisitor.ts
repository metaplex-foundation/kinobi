import * as nodes from '../nodes';
import { BaseRootVisitor } from './BaseRootVisitor';
import {
  DeduplicateIdenticalDefinedTypesVisitor,
  SetAnchorDiscriminatorsVisitor,
  SetInstructionAccountDefaultValuesVisitor,
  InlineDefinedTypesForInstructionArgsVisitor,
  InlineStructsForInstructionArgsVisitor,
  TransformU8ArraysToBytesVisitor,
} from './transformers';

export class DefaultVisitor extends BaseRootVisitor {
  visitRoot(currentRoot: nodes.RootNode): nodes.RootNode {
    let root: nodes.Node = currentRoot;
    // Anchor discriminators.
    root = root.accept(new SetAnchorDiscriminatorsVisitor());

    // Defined types.
    root = root.accept(new DeduplicateIdenticalDefinedTypesVisitor());
    root = root.accept(new InlineDefinedTypesForInstructionArgsVisitor());

    // Instructions.
    root = root.accept(new SetInstructionAccountDefaultValuesVisitor());
    root = root.accept(new InlineStructsForInstructionArgsVisitor());

    // Extras.
    root = root.accept(new TransformU8ArraysToBytesVisitor());
    nodes.assertRootNode(root);
    return root;
  }
}
