import * as nodes from '../../nodes';
import { assertRootNode } from '../../nodes';
import { GetDefinedTypeHistogramVisitor } from '../aggregators/GetDefinedTypeHistogramVisitor';
import { UnwrapDefinedTypesVisitor } from './UnwrapDefinedTypesVisitor';
import { BaseThrowVisitor } from '../BaseThrowVisitor';

export class UnwrapInstructionArgsDefinedTypesVisitor extends BaseThrowVisitor<nodes.RootNode> {
  visitRoot(root: nodes.RootNode): nodes.RootNode {
    const histogram = root.accept(new GetDefinedTypeHistogramVisitor());
    const { allDefinedTypes } = root;

    const definedTypesToInline: string[] = Object.keys(histogram)
      // Get all defined types used exactly once as an instruction argument.
      .filter(
        (name) =>
          (histogram[name].total ?? 0) === 1 &&
          (histogram[name].directlyAsInstructionArgs ?? 0) === 1
      )
      // Filter out enums which are better defined as external types.
      .filter((name) => {
        const found = allDefinedTypes.find((type) => type.name === name);
        return found && !nodes.isTypeEnumNode(found.type);
      });

    // Inline the identified defined types if any.
    if (definedTypesToInline.length > 0) {
      const inlineVisitor = new UnwrapDefinedTypesVisitor(definedTypesToInline);
      const newRoot = root.accept(inlineVisitor);
      assertRootNode(newRoot);
      return newRoot;
    }

    return root;
  }
}
