import * as nodes from '../../nodes';
import { mainCase } from '../../utils';
import { BaseNodeVisitor } from '../BaseNodeVisitor';
import { Dependency } from '../Dependency';

export type CustomInstructionSerializerOptions = {
  name: string;
  dependency: Dependency;
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
      if (nodes.isTypeDefinedLinkNode(instruction.args)) return;
      const newType = new nodes.DefinedTypeNode(
        {
          name: options.extractAs,
          idlName: instruction.metadata.idlName,
          docs: instruction.metadata.docs,
          internal: options.extractedTypeShouldBeInternal,
        },
        instruction.args
      );
      newDefinedTypes.push(newType);
    });

    return new nodes.ProgramNode(
      program.metadata,
      program.accounts,
      program.instructions
        .map((instruction) => instruction.accept(this))
        .filter(nodes.assertNodeFilter(nodes.assertInstructionNode)),
      newDefinedTypes,
      program.errors
    );
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node {
    const options: CustomInstructionSerializerOptions | null =
      this.map[instruction.name] ?? null;
    if (!options) return instruction;
    if (nodes.isTypeDefinedLinkNode(instruction.args)) return instruction;

    return new nodes.InstructionNode(
      instruction.metadata,
      instruction.accounts,
      new nodes.TypeDefinedLinkNode(options.name, {
        dependency: options.dependency,
      }),
      instruction.subInstructions
    );
  }
}

function parseLink(
  name: string,
  link: true | Partial<CustomInstructionSerializerOptions>
): CustomInstructionSerializerOptions {
  const defaultOptions = {
    name: `${name}InstructionData`,
    dependency: 'hooked',
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
