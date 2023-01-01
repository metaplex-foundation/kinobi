import * as nodes from '../../nodes';
import { BaseRootVisitor } from '../BaseRootVisitor';

type DefinedTypeWithProgram = {
  program: nodes.ProgramNode;
  type: nodes.DefinedTypeNode;
};

export class DeduplicateDefinedTypesVisitor extends BaseRootVisitor {
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
      if (list.length === 1) {
        typeMap.delete(name);
      }
    });

    console.log(typeMap);

    return root;
  }
}
