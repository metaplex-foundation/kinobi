import {
  IdlInputs,
  ProgramNode,
  getAllDefinedTypes,
  programNode,
  rootNode,
  rootNodeFromIdls,
} from '../nodes';
import { MainCaseString } from '../shared';
import { getDefinedTypeHistogramVisitor } from './getDefinedTypeHistogramVisitor';
import { rootNodeVisitor } from './singleNodeVisitor';
import { visit } from './visitor';

export function setMissingDefinedTypesVisitor(programs: IdlInputs) {
  const programNodes = rootNodeFromIdls(programs).programs;

  return rootNodeVisitor((root) => {
    // Get all linked defined types missing from the registered programs.
    const histogram = visit(root, getDefinedTypeHistogramVisitor());
    const availableTypes = getAllDefinedTypes(root).map((type) => type.name);
    const missingTypes = Object.keys(histogram).filter((name) => {
      const { total } = histogram[name as MainCaseString];
      return total > 0 && !availableTypes.includes(name as MainCaseString);
    });

    // If no missing types, abort.
    if (missingTypes.length === 0) {
      return root;
    }

    // Get all programs that define the missing types
    // and trim them to only include the missing types.
    const foundTypes = new Set<string>();
    const foundPrograms = programNodes.flatMap((program): ProgramNode[] => {
      const definedTypes = program.definedTypes.filter((type) => {
        if (foundTypes.has(type.name)) return false;
        const found = missingTypes.includes(type.name);
        if (found) foundTypes.add(type.name);
        return found;
      });
      return definedTypes.length > 0
        ? [programNode({ ...program, definedTypes, internal: true })]
        : [];
    });

    // If no provided program includes missing types, abort.
    if (foundPrograms.length === 0) {
      return root;
    }

    // Merge the existing programs with the found programs.
    const newPrograms = [...root.programs];
    foundPrograms.forEach((foundProgram) => {
      const index = newPrograms.findIndex(
        (newProgram) => newProgram.name === foundProgram.name
      );
      if (index === -1) {
        newPrograms.push(foundProgram);
        return;
      }
      const currentProgram = newPrograms[index];
      newPrograms[index] = programNode({
        ...currentProgram,
        definedTypes: [
          ...currentProgram.definedTypes,
          ...foundProgram.definedTypes,
        ],
      });
    });

    return rootNode(newPrograms);
  });
}
