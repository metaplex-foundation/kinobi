import { NodeSelector } from '../shared';
import { DefinedTypeNode, ProgramNode, assertIsNode } from '../nodes';
import { getUniqueHashStringVisitor } from './getUniqueHashStringVisitor';
import { rootNodeVisitor } from './singleNodeVisitor';
import { visit } from './visitor';
import { deleteNodesVisitor } from './deleteNodesVisitor';

type DefinedTypeWithProgram = {
  program: ProgramNode;
  type: DefinedTypeNode;
};

export function deduplicateIdenticalDefinedTypesVisitor() {
  return rootNodeVisitor((root) => {
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
    const hashVisitor = getUniqueHashStringVisitor({ removeDocs: true });
    typeMap.forEach((list, name) => {
      const types = list.map((item) => visit(item.type, hashVisitor));
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
        ({ program, type }): NodeSelector =>
          `[programNode]${program.name}.[definedTypeNode]${type.name}`
      );

    // Delete the identified nodes if any.
    if (deleteSelectors.length > 0) {
      const newRoot = visit(root, deleteNodesVisitor(deleteSelectors));
      assertIsNode(newRoot, 'rootNode');
      return newRoot;
    }

    return root;
  });
}
