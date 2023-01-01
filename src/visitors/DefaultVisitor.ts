import * as nodes from '../nodes';
import { BaseRootVisitor } from './BaseRootVisitor';
import {
  DeduplicateDefinedTypesVisitor,
  FillAnchorDiscriminatorVisitor,
  IdentifyDefaultInstructionAccountsVisitor,
  InlineDefinedTypesForInstructionArgsVisitor,
  InlineStructsForInstructionArgsVisitor,
  TransformU8ArraysToBytesVisitor,
} from './transformers';

export class DefaultVisitor extends BaseRootVisitor {
  visitRoot(currentRoot: nodes.RootNode): nodes.RootNode {
    let root: nodes.Node = currentRoot;
    // Anchor discriminators.
    root = root.accept(new FillAnchorDiscriminatorVisitor());

    // Defined types.
    root = root.accept(new DeduplicateDefinedTypesVisitor());
    root = root.accept(new InlineDefinedTypesForInstructionArgsVisitor());

    // Instructions.
    root = root.accept(new IdentifyDefaultInstructionAccountsVisitor());
    root = root.accept(new InlineStructsForInstructionArgsVisitor());

    // Extras.
    root = root.accept(new TransformU8ArraysToBytesVisitor());
    nodes.assertRootNode(root);
    return root;
  }
}
