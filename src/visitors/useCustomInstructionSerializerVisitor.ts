import {
  assertInstructionNode,
  assertNodeFilter,
  definedTypeNode,
  instructionDataArgsNode,
  instructionNode,
  linkTypeNode,
  programNode,
} from '../nodes';
import { mainCase, pipe } from '../shared';
import { ImportFrom } from '../shared/ImportFrom';
import { extendVisitor } from './extendVisitor';
import { identityVisitor } from './identityVisitor';
import { visit } from './visitor';

export type CustomInstructionSerializerOptions = {
  name: string;
  importFrom: ImportFrom;
  extract: boolean;
  extractAs: string;
  extractedTypeShouldBeInternal: boolean;
};

export function useCustomInstructionSerializerVisitor(
  map: Record<string, true | Partial<CustomInstructionSerializerOptions>>
) {
  const parsedMap = Object.entries(map).reduce(
    (acc, [selector, options]) => ({
      ...acc,
      [mainCase(selector)]: parseLink(selector, options),
    }),
    {} as Record<string, CustomInstructionSerializerOptions>
  );

  return pipe(
    identityVisitor(['rootNode', 'programNode', 'instructionNode']),
    (v) =>
      extendVisitor(v, {
        visitProgram(program, { self }) {
          const newDefinedTypes = program.definedTypes;

          program.instructions.forEach((instruction) => {
            const options: CustomInstructionSerializerOptions | null =
              parsedMap[instruction.name] ?? null;
            if (!options || !options.extract) return;
            const newType = definedTypeNode({
              name: options.extractAs,
              data: instruction.dataArgs.struct,
              idlName: instruction.idlName,
              docs: instruction.docs,
              internal: options.extractedTypeShouldBeInternal,
            });
            newDefinedTypes.push(newType);
          });

          return programNode({
            ...program,
            definedTypes: newDefinedTypes,
            instructions: program.instructions
              .map((instruction) => visit(instruction, self))
              .filter(assertNodeFilter(assertInstructionNode)),
          });
        },

        visitInstruction(instruction) {
          const options: CustomInstructionSerializerOptions | null =
            parsedMap[instruction.name] ?? null;
          if (!options) return instruction;
          return instructionNode({
            ...instruction,
            dataArgs: instructionDataArgsNode({
              ...instruction.dataArgs,
              link: linkTypeNode(options.name, {
                importFrom: options.importFrom,
              }),
            }),
          });
        },
      })
  );
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
    importFrom: mainCase(options.importFrom),
  };
}
