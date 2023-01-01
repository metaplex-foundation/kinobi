import * as nodes from '../nodes';
import { BaseRootVisitor } from './BaseRootVisitor';
import {
  FillAnchorDiscriminatorVisitor,
  IdentifyDefaultInstructionAccountsVisitor,
  InlineDefinedTypesForInstructionArgsVisitor,
  InlineStructsForInstructionArgsVisitor,
  TransformU8ArraysToBytesVisitor,
} from './transformers';

export class DefaultVisitor extends BaseRootVisitor {
  visitRoot(currentRoot: nodes.RootNode): nodes.RootNode {
    let root: nodes.Node = currentRoot;
    root = root.accept(new FillAnchorDiscriminatorVisitor());
    root = root.accept(new IdentifyDefaultInstructionAccountsVisitor());
    root = root.accept(new InlineDefinedTypesForInstructionArgsVisitor());
    root = root.accept(new InlineStructsForInstructionArgsVisitor());
    root = root.accept(new TransformU8ArraysToBytesVisitor());
    nodes.assertRootNode(root);
    return root;
  }
}
