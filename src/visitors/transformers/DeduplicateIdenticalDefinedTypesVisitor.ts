import * as nodes from '../../nodes';
import { GetNodeInlineStringVisitor } from '../aggregators';
import { BaseThrowVisitor } from '../BaseThrowVisitor';
import { NodeSelector } from '../NodeSelector';
import { visit } from '../Visitor';
import { DeleteNodesVisitor } from './DeleteNodesVisitor';

type DefinedTypeWithProgram = {
  program: nodes.ProgramNode;
  type: nodes.DefinedTypeNode;
};

export class DeduplicateIdenticalDefinedTypesVisitor extends BaseThrowVisitor<nodes.RootNode> {
  visitRoot(root: nodes.RootNode): nodes.RootNode {
    const typeMap = new Map<string, DefinedTypeWithProgram[]>();

    // Fill the type map with all defined types.
    root.programs.forEach((program) => {
      program.definedTypes.forEach((type) => {
        const typeWithProgram = { program, type };
        const list = typeMap.get(type.name) ?? [];
        typeMap.set(type.name, [...list, typeWithProgram]);
      });
    });

    // Remove all types that are not duplicated.
    typeMap.forEach((list, name) => {
      if (list.length <= 1) {
        typeMap.delete(name);
      }
    });

    // Remove duplicates whose types are not equal.
    const strVisitor = new GetNodeInlineStringVisitor();
    typeMap.forEach((list, name) => {
      const types = list.map((item) => visit(item.type, strVisitor));
      const typesAreEqual = types.every((type, i, arr) => type === arr[0]);
      if (!typesAreEqual) {
        typeMap.delete(name);
      }
    });

    // Get the selectors for all defined types that needs deleting.
    // Thus, we must select all but the first duplicate of each list.
    const deleteSelectors = Array.from(typeMap.values())
      // Order lists by program index, get their tails and flatten.
      .flatMap((list) => {
        const sortedList = list.sort(
          (a, b) =>
            root.programs.indexOf(a.program) - root.programs.indexOf(b.program)
        );
        const [, ...sortedListTail] = sortedList;
        return sortedListTail;
      })
      // Get selectors from the defined types and their programs.
      .map(
        ({ program, type }): NodeSelector => ({
          kind: 'definedTypeNode',
          name: type.name,
          program: program.name,
        })
      );

    // Delete the identified nodes if any.
    if (deleteSelectors.length > 0) {
      const newRoot = visit(root, new DeleteNodesVisitor(deleteSelectors));
      nodes.assertRootNode(newRoot);
      return newRoot;
    }

    return root;
  }
}
