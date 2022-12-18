import * as nodes from '../nodes';
import { assertRootNode } from '../nodes';
import { BaseRootVisitor } from './BaseRootVisitor';
import { GetDefinedTypeHistogramVisitor } from './GetDefinedTypeHistogramVisitor';
import { InlineDefinedTypesVisitor } from './InlineDefinedTypesVisitor';

export class InlineDefinedTypesForInstructionArgsVisitor extends BaseRootVisitor {
  visitRoot(root: nodes.RootNode): nodes.RootNode {
    const histogram = root.accept(new GetDefinedTypeHistogramVisitor());
    const definedTypesToInline = Object.keys(histogram).filter(
      (key) =>
        (histogram[key].total ?? 0) === 1 &&
        (histogram[key].directlyAsInstructionArgs ?? 0) === 1,
    );
    const inlineVisitor = new InlineDefinedTypesVisitor(definedTypesToInline);
    const newRoot = root.accept(inlineVisitor);
    assertRootNode(newRoot);
    return newRoot;
  }
}
