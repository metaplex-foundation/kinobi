import type { ConfigureOptions } from 'nunjucks';
import {
  InstructionNode,
  ProgramNode,
  VALUE_NODES,
  getAllAccounts,
  getAllDefinedTypes,
  getAllInstructionsWithSubs,
  isNode,
  isNodeFilter,
  resolveNestedTypeNode,
  structTypeNodeFromInstructionArgumentNodes,
} from '../../nodes';
import {
  ImportFrom,
  LinkableDictionary,
  RenderMap,
  logWarn,
  pascalCase,
  pipe,
  resolveTemplate,
  snakeCase,
} from '../../shared';
import {
  extendVisitor,
  recordLinkablesVisitor,
  staticVisitor,
  visit,
} from '../../visitors';
import { RustImportMap } from './RustImportMap';
import { getTypeManifestVisitor } from './getTypeManifestVisitor';
import { renderValueNode } from './renderValueNodeVisitor';

export type GetRustRenderMapOptions = {
  renderParentInstructions?: boolean;
  dependencyMap?: Record<ImportFrom, string>;
};

export function getRenderMapVisitor(options: GetRustRenderMapOptions = {}) {
  const linkables = new LinkableDictionary();
  let program: ProgramNode | null = null;

  const renderParentInstructions = options.renderParentInstructions ?? false;
  const dependencyMap = options.dependencyMap ?? {};
  const typeManifestVisitor = getTypeManifestVisitor();

  return pipe(
    staticVisitor(
      () => new RenderMap(),
      [
        'rootNode',
        'programNode',
        'instructionNode',
        'accountNode',
        'definedTypeNode',
      ]
    ),
    (v) =>
      extendVisitor(v, {
        visitRoot(node, { self }) {
          const programsToExport = node.programs;
          const accountsToExport = getAllAccounts(node);
          const instructionsToExport = getAllInstructionsWithSubs(node, {
            leavesOnly: !renderParentInstructions,
          });
          const definedTypesToExport = getAllDefinedTypes(node);
          const hasAnythingToExport =
            programsToExport.length > 0 ||
            accountsToExport.length > 0 ||
            instructionsToExport.length > 0 ||
            definedTypesToExport.length > 0;

          const ctx = {
            root: node,
            programsToExport,
            accountsToExport,
            instructionsToExport,
            definedTypesToExport,
            hasAnythingToExport,
          };

          const map = new RenderMap();
          if (programsToExport.length > 0) {
            map
              .add('programs.rs', render('programsMod.njk', ctx))
              .add('errors/mod.rs', render('errorsMod.njk', ctx));
          }
          if (accountsToExport.length > 0) {
            map.add('accounts/mod.rs', render('accountsMod.njk', ctx));
          }
          if (instructionsToExport.length > 0) {
            map.add('instructions/mod.rs', render('instructionsMod.njk', ctx));
          }
          if (definedTypesToExport.length > 0) {
            map.add('types/mod.rs', render('definedTypesMod.njk', ctx));
          }

          return map
            .add('mod.rs', render('rootMod.njk', ctx))
            .mergeWith(...node.programs.map((p) => visit(p, self)));
        },

        visitProgram(node, { self }) {
          program = node;
          const renderMap = new RenderMap()
            .mergeWith(...node.accounts.map((account) => visit(account, self)))
            .mergeWith(...node.definedTypes.map((type) => visit(type, self)))
            .mergeWith(
              ...getAllInstructionsWithSubs(node, {
                leavesOnly: !renderParentInstructions,
              }).map((ix) => visit(ix, self))
            );

          // Errors.
          if (node.errors.length > 0) {
            renderMap.add(
              `errors/${snakeCase(node.name)}.rs`,
              render('errorsPage.njk', {
                imports: new RustImportMap().toString(dependencyMap),
                program: node,
                errors: node.errors.map((error) => ({
                  ...error,
                  prefixedName:
                    pascalCase(node.prefix) + pascalCase(error.name),
                })),
              })
            );
          }

          program = null;
          return renderMap;
        },

        visitAccount(node) {
          const typeManifest = visit(node, typeManifestVisitor);

          // Seeds.
          const seedsImports = new RustImportMap();
          const pda = node.pda ? linkables.get(node.pda) : undefined;
          const pdaSeeds = pda?.seeds ?? [];
          const seeds = pdaSeeds.map((seed) => {
            if (isNode(seed, 'variablePdaSeedNode')) {
              const seedManifest = visit(seed.type, typeManifestVisitor);
              seedsImports.mergeWith(seedManifest.imports);
              const resolvedType = resolveNestedTypeNode(seed.type);
              return { ...seed, resolvedType, typeManifest: seedManifest };
            }
            if (isNode(seed.value, 'programIdValueNode')) {
              return seed;
            }
            const seedManifest = visit(seed.type, typeManifestVisitor);
            const seedValue = seed.value;
            const valueManifest = renderValueNode(seedValue, true);
            (seedValue as any).render = valueManifest.render;
            seedsImports.mergeWith(valueManifest.imports);
            const resolvedType = resolveNestedTypeNode(seed.type);
            return { ...seed, resolvedType, typeManifest: seedManifest };
          });
          const hasVariableSeeds =
            pdaSeeds.filter(isNodeFilter('variablePdaSeedNode')).length > 0;
          const constantSeeds = pdaSeeds.filter(
            isNodeFilter('constantPdaSeedNode')
          );

          const { imports } = typeManifest;

          if (hasVariableSeeds) {
            imports.mergeWith(seedsImports);
          }

          return new RenderMap().add(
            `accounts/${snakeCase(node.name)}.rs`,
            render('accountsPage.njk', {
              account: node,
              imports: imports
                .remove(`generatedAccounts::${pascalCase(node.name)}`)
                .toString(dependencyMap),
              program,
              typeManifest,
              seeds,
              constantSeeds,
              hasVariableSeeds,
              pda,
            })
          );
        },

        visitInstruction(node) {
          // Imports.
          const imports = new RustImportMap();
          imports.add(['borsh::BorshDeserialize', 'borsh::BorshSerialize']);

          // canMergeAccountsAndArgs
          const accountsAndArgsConflicts =
            getConflictsForInstructionAccountsAndArgs(node);
          if (accountsAndArgsConflicts.length > 0) {
            logWarn(
              `[Rust] Accounts and args of instruction [${node.name}] have the following ` +
                `conflicting attributes [${accountsAndArgsConflicts.join(
                  ', '
                )}]. ` +
                `Thus, the conflicting arguments will be suffixed with "_arg". ` +
                'You may want to rename the conflicting attributes.'
            );
          }

          // Instruction args.
          const instructionArgs: {
            name: string;
            type: string;
            default: boolean;
            optional: boolean;
            innerOptionType: string | null;
            value: string | null;
          }[] = [];
          let hasArgs = false;
          let hasOptional = false;

          node.arguments.forEach((argument) => {
            typeManifestVisitor.setParentName(
              `${pascalCase(node.name)}InstructionData${pascalCase(
                argument.name
              )}`
            );
            typeManifestVisitor.setNestedStruct(true);
            const manifest = visit(argument.type, typeManifestVisitor);
            imports.mergeWith(manifest.imports);
            const innerOptionType = isNode(argument.type, 'optionTypeNode')
              ? manifest.type.slice('Option<'.length, -1)
              : null;
            typeManifestVisitor.setParentName(null);
            typeManifestVisitor.setNestedStruct(false);

            const hasDefaultValue =
              !!argument.defaultValue &&
              isNode(argument.defaultValue, VALUE_NODES);
            let renderValue: string | null = null;
            if (hasDefaultValue) {
              const { imports: argImports, render: value } = renderValueNode(
                argument.defaultValue
              );
              imports.mergeWith(argImports);
              renderValue = value;
            }

            hasArgs = hasArgs || argument.defaultValueStrategy !== 'omitted';
            hasOptional =
              hasOptional ||
              (hasDefaultValue && argument.defaultValueStrategy !== 'omitted');

            const name = accountsAndArgsConflicts.includes(argument.name)
              ? `${argument.name}_arg`
              : argument.name;

            instructionArgs.push({
              name,
              type: manifest.type,
              default:
                hasDefaultValue && argument.defaultValueStrategy === 'omitted',
              optional:
                hasDefaultValue && argument.defaultValueStrategy !== 'omitted',
              innerOptionType,
              value: renderValue,
            });
          });

          const struct = structTypeNodeFromInstructionArgumentNodes(
            node.arguments
          );
          typeManifestVisitor.setParentName(
            `${pascalCase(node.name)}InstructionData`
          );
          const typeManifest = visit(struct, typeManifestVisitor);
          typeManifestVisitor.setParentName(null);

          return new RenderMap().add(
            `instructions/${snakeCase(node.name)}.rs`,
            render('instructionsPage.njk', {
              instruction: node,
              imports: imports
                .remove(`generatedInstructions::${pascalCase(node.name)}`)
                .toString(dependencyMap),
              instructionArgs,
              hasArgs,
              hasOptional,
              program,
              typeManifest,
            })
          );
        },

        visitDefinedType(node) {
          const typeManifest = visit(node, typeManifestVisitor);
          const imports = new RustImportMap().mergeWithManifest(typeManifest);

          return new RenderMap().add(
            `types/${snakeCase(node.name)}.rs`,
            render('definedTypesPage.njk', {
              definedType: node,
              imports: imports
                .remove(`generatedTypes::${pascalCase(node.name)}`)
                .toString(dependencyMap),
              typeManifest,
            })
          );
        },
      }),
    (v) => recordLinkablesVisitor(v, linkables)
  );
}

function render(
  template: string,
  context?: object,
  renderOptions?: ConfigureOptions
): string {
  return resolveTemplate(
    `${__dirname}/templates`,
    template,
    context,
    renderOptions
  );
}

function getConflictsForInstructionAccountsAndArgs(
  instruction: InstructionNode
): string[] {
  const allNames = [
    ...instruction.accounts.map((account) => account.name),
    ...instruction.arguments.map((argument) => argument.name),
  ];
  const duplicates = allNames.filter((e, i, a) => a.indexOf(e) !== i);
  return [...new Set(duplicates)];
}
