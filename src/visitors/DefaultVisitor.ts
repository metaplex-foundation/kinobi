import * as nodes from '../nodes';
import { BaseRootVisitor } from './BaseRootVisitor';
import { IdentifyDefaultInstructionAccountsVisitor } from './IdentifyDefaultInstructionAccountsVisitor';
import { InlineDefinedTypesForInstructionArgsVisitor } from './InlineDefinedTypesForInstructionArgsVisitor';
import { InlineStructsForInstructionArgsVisitor } from './InlineStructsForInstructionArgsVisitor';
import { TransformU8ArraysToBytesVisitor } from './TransformU8ArraysToBytesVisitor';

export class DefaultVisitor extends BaseRootVisitor {
  visitRoot(currentRoot: nodes.RootNode): nodes.RootNode {
    let root: nodes.Node = currentRoot;
    root = root.accept(new IdentifyDefaultInstructionAccountsVisitor());
    root = root.accept(new InlineDefinedTypesForInstructionArgsVisitor());
    root = root.accept(new InlineStructsForInstructionArgsVisitor());
    root = root.accept(new TransformU8ArraysToBytesVisitor());
    nodes.assertRootNode(root);
    return root;
  }
}
