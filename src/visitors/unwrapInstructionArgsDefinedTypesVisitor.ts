import { assertRootNode, getAllDefinedTypes, isNode } from '../nodes';
import { MainCaseString } from '../shared';
import { getDefinedTypeHistogramVisitor } from './getDefinedTypeHistogramVisitor';
import { rootNodeVisitor } from './singleNodeVisitor';
import { unwrapDefinedTypesVisitor } from './unwrapDefinedTypesVisitor';
import { visit } from './visitor';

export function unwrapInstructionArgsDefinedTypesVisitor() {
  return rootNodeVisitor((root) => {
    const histogram = visit(root, getDefinedTypeHistogramVisitor());
    const allDefinedTypes = getAllDefinedTypes(root);

    const definedTypesToInline: string[] = Object.keys(histogram)
      // Get all defined types used exactly once as an instruction argument.
      .filter(
        (name) =>
          (histogram[name as MainCaseString].total ?? 0) === 1 &&
          (histogram[name as MainCaseString].directlyAsInstructionArgs ?? 0) ===
            1
      )
      // Filter out enums which are better defined as external types.
      .filter((name) => {
        const found = allDefinedTypes.find((type) => type.name === name);
        return found && !isNode(found.data, 'enumTypeNode');
      });

    // Inline the identified defined types if any.
    if (definedTypesToInline.length > 0) {
      const inlineVisitor = unwrapDefinedTypesVisitor(definedTypesToInline);
      const newRoot = visit(root, inlineVisitor);
      assertRootNode(newRoot);
      return newRoot;
    }

    return root;
  });
}
