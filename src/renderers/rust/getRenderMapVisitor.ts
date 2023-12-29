import type { ConfigureOptions } from 'nunjucks';
import {
  InstructionNode,
  ProgramNode,
  getAllAccounts,
  getAllDefinedTypes,
  getAllInstructionsWithSubs,
  isOptionTypeNode,
} from '../../nodes';
import {
  ImportFrom,
  RenderMap,
  logWarn,
  pascalCase,
  resolveTemplate,
  snakeCase,
} from '../../shared';
import { extendVisitor, staticVisitor, visit } from '../../visitors';
import { RustImportMap } from './RustImportMap';
import { getTypeManifestVisitor } from './getTypeManifestVisitor';
import { renderValueNode } from './renderValueNode';

export type GetRustRenderMapOptions = {
  renderParentInstructions?: boolean;
  dependencyMap?: Record<ImportFrom, string>;
};

export function getRenderMapVisitor(options: GetRustRenderMapOptions = {}) {
  let program: ProgramNode | null = null;

  const renderParentInstructions = options.renderParentInstructions ?? false;
  const dependencyMap = options.dependencyMap ?? {};
  const typeManifestVisitor = getTypeManifestVisitor();

  const baseVisitor = staticVisitor(
    () => new RenderMap(),
    [
      'rootNode',
      'programNode',
      'instructionNode',
      'accountNode',
      'definedTypeNode',
    ]
  );

  return extendVisitor(baseVisitor, {
    visitRoot(node, _, self) {
      const programsToExport = node.programs.filter((p) => !p.internal);
      const accountsToExport = getAllAccounts(node).filter((a) => !a.internal);
      const instructionsToExport = getAllInstructionsWithSubs(
        node,
        !renderParentInstructions
      ).filter((i) => !i.internal);
      const definedTypesToExport = getAllDefinedTypes(node).filter(
        (t) => !t.internal
      );
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

    visitProgram(node, _, self) {
      program = node;
      const renderMap = new RenderMap()
        .mergeWith(...node.accounts.map((account) => visit(account, self)))
        .mergeWith(...node.definedTypes.map((type) => visit(type, self)));

      // Internal programs are support programs that
      // were added to fill missing types or accounts.
      // They don't need to render anything else.
      if (node.internal) {
        program = null;
        return renderMap;
      }

      renderMap.mergeWith(
        ...getAllInstructionsWithSubs(node, !renderParentInstructions).map(
          (ix) => visit(ix, self)
        )
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
              prefixedName: pascalCase(node.prefix) + pascalCase(error.name),
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
      const seeds = node.seeds.map((seed) => {
        if (seed.kind === 'constant') {
          const seedManifest = visit(seed.type, typeManifestVisitor);
          const seedValue = seed.value;
          const valueManifest = renderValueNode(seedValue, true);
          (seedValue as any).render = valueManifest.render;
          seedsImports.mergeWith(valueManifest.imports);
          return { ...seed, typeManifest: seedManifest };
        }
        if (seed.kind === 'variable') {
          const seedManifest = visit(seed.type, typeManifestVisitor);
          seedsImports.mergeWith(seedManifest.imports);
          return { ...seed, typeManifest: seedManifest };
        }
        return seed;
      });
      const hasVariableSeeds =
        node.seeds.filter((seed) => seed.kind === 'variable').length > 0;

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
          hasVariableSeeds,
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

      node.dataArgs.struct.fields.forEach((field) => {
        typeManifestVisitor.setParentName(
          pascalCase(node.dataArgs.name) + pascalCase(field.name)
        );
        typeManifestVisitor.setNestedStruct(true);
        const manifest = visit(field.child, typeManifestVisitor);
        imports.mergeWith(manifest.imports);
        const innerOptionType = isOptionTypeNode(field.child)
          ? manifest.type.slice('Option<'.length, -1)
          : null;
        typeManifestVisitor.setParentName(null);
        typeManifestVisitor.setNestedStruct(false);

        let renderValue: string | null = null;
        if (field.defaultsTo) {
          const { imports: argImports, render: value } = renderValueNode(
            field.defaultsTo.value
          );
          imports.mergeWith(argImports);
          renderValue = value;
        }

        hasArgs = hasArgs || field.defaultsTo?.strategy !== 'omitted';
        hasOptional = hasOptional || field.defaultsTo?.strategy === 'optional';

        const name = accountsAndArgsConflicts.includes(field.name)
          ? `${field.name}_arg`
          : field.name;

        instructionArgs.push({
          name,
          type: manifest.type,
          default: field.defaultsTo?.strategy === 'omitted',
          optional: field.defaultsTo?.strategy === 'optional',
          innerOptionType,
          value: renderValue,
        });
      });

      const typeManifest = visit(node, typeManifestVisitor);

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
  });
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
    ...instruction.dataArgs.struct.fields.map((field) => field.name),
  ];
  const duplicates = allNames.filter((e, i, a) => a.indexOf(e) !== i);
  return [...new Set(duplicates)];
}
