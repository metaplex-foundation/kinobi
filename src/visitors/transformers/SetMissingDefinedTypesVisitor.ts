import { MainCaseString } from 'src/shared';
import * as nodes from '../../nodes';
import { BaseThrowVisitor } from '../BaseThrowVisitor';
import { visit } from '../Visitor';
import { getDefinedTypeHistogramVisitor } from '../getDefinedTypeHistogramVisitor';

export class SetMissingDefinedTypesVisitor extends BaseThrowVisitor<nodes.RootNode> {
  readonly programs: nodes.ProgramNode[] = [];

  constructor(programs: nodes.IdlInputs) {
    super();
    const root = nodes.rootNodeFromIdls(programs);
    this.programs = root.programs;
  }

  visitRoot(root: nodes.RootNode): nodes.RootNode {
    // Get all linked defined types missing from the registered programs.
    const histogram = visit(root, getDefinedTypeHistogramVisitor());
    const availableTypes = nodes
      .getAllDefinedTypes(root)
      .map((type) => type.name);
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
    const foundPrograms = this.programs.flatMap(
      (program): nodes.ProgramNode[] => {
        const definedTypes = program.definedTypes.filter((type) => {
          if (foundTypes.has(type.name)) return false;
          const found = missingTypes.includes(type.name);
          if (found) foundTypes.add(type.name);
          return found;
        });
        return definedTypes.length > 0
          ? [nodes.programNode({ ...program, definedTypes, internal: true })]
          : [];
      }
    );

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
      newPrograms[index] = nodes.programNode({
        ...currentProgram,
        definedTypes: [
          ...currentProgram.definedTypes,
          ...foundProgram.definedTypes,
        ],
      });
    });

    return nodes.rootNode(newPrograms);
  }
}
