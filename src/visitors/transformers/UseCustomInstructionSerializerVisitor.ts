import * as nodes from '../../nodes';
import { mainCase } from '../../shared';
import { ImportFrom } from '../../shared/ImportFrom';
import { BaseNodeVisitor } from '../BaseNodeVisitor';
import { visit } from '../Visitor';

export type CustomInstructionSerializerOptions = {
  name: string;
  importFrom: ImportFrom;
  extract: boolean;
  extractAs: string;
  extractedTypeShouldBeInternal: boolean;
};

export class UseCustomInstructionSerializerVisitor extends BaseNodeVisitor {
  readonly map: Record<string, CustomInstructionSerializerOptions>;

  constructor(
    map: Record<string, true | Partial<CustomInstructionSerializerOptions>>
  ) {
    super();
    this.map = Object.entries(map).reduce(
      (acc, [selector, options]) => ({
        ...acc,
        [mainCase(selector)]: parseLink(selector, options),
      }),
      {} as Record<string, CustomInstructionSerializerOptions>
    );
  }

  visitProgram(program: nodes.ProgramNode): nodes.Node {
    const newDefinedTypes = program.definedTypes;

    program.instructions.forEach((instruction) => {
      const options: CustomInstructionSerializerOptions | null =
        this.map[instruction.name] ?? null;
      if (!options || !options.extract) return;
      const newType = nodes.definedTypeNode({
        name: options.extractAs,
        data: instruction.dataArgs.struct,
        idlName: instruction.idlName,
        docs: instruction.docs,
        internal: options.extractedTypeShouldBeInternal,
      });
      newDefinedTypes.push(newType);
    });

    return nodes.programNode({
      ...program,
      definedTypes: newDefinedTypes,
      instructions: program.instructions
        .map((instruction) => visit(instruction, this))
        .filter(nodes.assertNodeFilter(nodes.assertInstructionNode)),
    });
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node {
    const options: CustomInstructionSerializerOptions | null =
      this.map[instruction.name] ?? null;
    if (!options) return instruction;
    return nodes.instructionNode({
      ...instruction,
      dataArgs: nodes.instructionDataArgsNode(
        instruction.dataArgs.struct,
        nodes.linkTypeNode(options.name, {
          importFrom: options.importFrom,
        })
      ),
    });
  }
}

function parseLink(
  name: string,
  link: true | Partial<CustomInstructionSerializerOptions>
): CustomInstructionSerializerOptions {
  const defaultOptions = {
    name: `${name}InstructionData`,
    importFrom: 'hooked',
    extract: false,
    extractAs: `${name}InstructionData`,
    extractedTypeShouldBeInternal: true,
  };
  const options =
    typeof link === 'boolean' ? defaultOptions : { ...defaultOptions, ...link };

  return {
    ...options,
    name: mainCase(options.name),
    extractAs: mainCase(options.extractAs),
  };
}
