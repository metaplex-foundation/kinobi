import * as nodes from '../../nodes';
import { GetDefinedTypeHistogramVisitor } from '../aggregators';
import { BaseThrowVisitor } from '../BaseThrowVisitor';

export class SetMissingDefinedTypesVisitor extends BaseThrowVisitor<nodes.RootNode> {
  readonly programs: nodes.ProgramNode[] = [];

  constructor(programs: nodes.ProgramInputs) {
    super();
    const root = nodes.RootNode.fromProgramInputs(programs);
    this.programs = root.programs;
  }

  visitRoot(root: nodes.RootNode): nodes.RootNode {
    // Get all linked defined types missing from the registered programs.
    const histogram = root.accept(new GetDefinedTypeHistogramVisitor());
    const availableTypes = root.allDefinedTypes.map((type) => type.name);
    const missingTypes = Object.keys(histogram).filter((name) => {
      const { total } = histogram[name];
      return total > 0 && !availableTypes.includes(name);
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
        const metadata = { ...program.metadata, internal: true };
        const types = program.definedTypes.filter((type) => {
          if (foundTypes.has(type.name)) return false;
          const found = missingTypes.includes(type.name);
          if (found) foundTypes.add(type.name);
          return found;
        });
        return types.length > 0
          ? [nodes.programNode(metadata, [], [], types, [])]
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
      newPrograms[index] = nodes.programNode(
        currentProgram.metadata,
        currentProgram.accounts,
        currentProgram.instructions,
        [...currentProgram.definedTypes, ...foundProgram.definedTypes],
        currentProgram.errors
      );
    });

    return nodes.rootNode(newPrograms);
  }
}
