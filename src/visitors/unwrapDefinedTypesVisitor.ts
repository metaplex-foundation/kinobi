import { DefinedTypeNode, assertIsNodeFilter, programNode } from '../nodes';
import { MainCaseString, mainCase, pipe } from '../shared';
import { extendVisitor } from './extendVisitor';
import { identityVisitor } from './identityVisitor';
import { tapDefinedTypesVisitor } from './tapVisitor';
import { visit } from './visitor';

export function unwrapDefinedTypesVisitor(typesToInline: string[] | '*' = '*') {
  let availableDefinedTypes = new Map<string, DefinedTypeNode>();
  const typesToInlineMainCased =
    typesToInline === '*' ? '*' : typesToInline.map(mainCase);
  const shouldInline = (definedType: MainCaseString): boolean =>
    typesToInlineMainCased === '*' ||
    typesToInlineMainCased.includes(definedType);

  return pipe(
    identityVisitor(),
    (v) =>
      tapDefinedTypesVisitor(v, (definedTypes) => {
        availableDefinedTypes = new Map(
          definedTypes.map((definedType) => [definedType.name, definedType])
        );
      }),
    (v) =>
      extendVisitor(v, {
        visitProgram(program, { self }) {
          return programNode({
            ...program,
            accounts: program.accounts
              .map((account) => visit(account, self))
              .filter(assertIsNodeFilter('accountNode')),
            instructions: program.instructions
              .map((instruction) => visit(instruction, self))
              .filter(assertIsNodeFilter('instructionNode')),
            definedTypes: program.definedTypes
              .filter((definedType) => !shouldInline(definedType.name))
              .map((type) => visit(type, self))
              .filter(assertIsNodeFilter('definedTypeNode')),
          });
        },

        visitDefinedTypeLink(linkType, { self }) {
          if (!shouldInline(linkType.name) || linkType.importFrom) {
            return linkType;
          }

          const definedType = availableDefinedTypes.get(linkType.name);

          if (definedType === undefined) {
            throw new Error(
              `Trying to inline missing defined type [${linkType.name}]. ` +
                `Ensure this visitor starts from the root node to access all defined types.`
            );
          }

          return visit(definedType.data, self);
        },
      })
  );
}
