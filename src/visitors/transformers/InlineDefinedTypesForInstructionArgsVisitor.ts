import * as nodes from '../../nodes';
import { assertRootNode } from '../../nodes';
import { BaseRootVisitor } from '../BaseRootVisitor';
import { GetDefinedTypeHistogramVisitor } from '../aggregators/GetDefinedTypeHistogramVisitor';
import { InlineDefinedTypesVisitor } from './InlineDefinedTypesVisitor';

export class InlineDefinedTypesForInstructionArgsVisitor extends BaseRootVisitor {
  visitRoot(root: nodes.RootNode): nodes.RootNode {
    // Get all defined types used exactly once as an instruction argument.
    const histogram = root.accept(new GetDefinedTypeHistogramVisitor());
    let definedTypesToInline: string[] = Object.keys(histogram).filter(
      (key) =>
        (histogram[key].total ?? 0) === 1 &&
        (histogram[key].directlyAsInstructionArgs ?? 0) === 1
    );

    // Filter out enums which are better defined as external types.
    const { allDefinedTypes } = root;
    definedTypesToInline = definedTypesToInline.filter((definedtype) => {
      const found = allDefinedTypes.find(({ name }) => name === definedtype);
      return found && !nodes.isTypeEnumNode(found.type);
    });

    // Inline the identified defined types.
    const inlineVisitor = new InlineDefinedTypesVisitor(definedTypesToInline);
    const newRoot = root.accept(inlineVisitor);
    assertRootNode(newRoot);
    return newRoot;
  }
}
