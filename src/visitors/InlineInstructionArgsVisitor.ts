import * as nodes from '../nodes';
import { assertRootNode } from '../nodes';
import { BaseRootVisitor } from './BaseRootVisitor';
import { GetDefinedTypeHistogramVisitor } from './GetDefinedTypeHistogramVisitor';
import { InlineDefinedTypesVisitor } from './InlineDefinedTypesVisitor';

export class InlineInstructionArgsVisitor extends BaseRootVisitor {
  visitRoot(root: nodes.RootNode): nodes.RootNode {
    const histogram = root.accept(new GetDefinedTypeHistogramVisitor());
    const definedTypesToInline = root.definedTypes.filter(
      (definedType) =>
        (histogram[definedType.name] ?? 0) === 1 &&
        definedType.name.endsWith('Args'),
    );

    const newRoot = root.accept(
      new InlineDefinedTypesVisitor(definedTypesToInline),
    );
    assertRootNode(newRoot);
    return newRoot;
  }
}
