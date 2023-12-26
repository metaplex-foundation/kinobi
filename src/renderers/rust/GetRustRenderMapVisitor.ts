import type { ConfigureOptions } from 'nunjucks';
import * as nodes from '../../nodes';
import { ImportFrom, logWarn, pascalCase, snakeCase } from '../../shared';
import {
  BaseThrowVisitor,
  ByteSizeVisitorKeys,
  GetResolvedInstructionInputsVisitor,
  ResolvedInstructionInput,
  Visitor,
  getByteSizeVisitor,
  visit,
} from '../../visitors';
import { RenderMap } from '../RenderMap';
import { resolveTemplate } from '../utils';
import {
  GetRustTypeManifestVisitor,
  RustTypeManifest,
} from './GetRustTypeManifestVisitor';
import { renderRustValueNode } from './RenderRustValueNode';
import { RustImportMap } from './RustImportMap';

export type GetRustRenderMapOptions = {
  renderParentInstructions?: boolean;
  dependencyMap?: Record<ImportFrom, string>;
  typeManifestVisitor?: Visitor<RustTypeManifest> & {
    parentName: string | null;
    nestedStruct: boolean;
  };
  resolvedInstructionInputVisitor?: Visitor<ResolvedInstructionInput[]>;
};

export class GetRustRenderMapVisitor extends BaseThrowVisitor<RenderMap> {
  readonly options: Required<GetRustRenderMapOptions>;

  private program: nodes.ProgramNode | null = null;

  private byteSizeVisitor: Visitor<number | null, ByteSizeVisitorKeys>;

  constructor(options: GetRustRenderMapOptions = {}) {
    super();
    this.byteSizeVisitor = getByteSizeVisitor([]);
    this.options = {
      renderParentInstructions: options.renderParentInstructions ?? false,
      dependencyMap: { ...options.dependencyMap },
      typeManifestVisitor:
        options.typeManifestVisitor ?? new GetRustTypeManifestVisitor(),
      resolvedInstructionInputVisitor:
        options.resolvedInstructionInputVisitor ??
        new GetResolvedInstructionInputsVisitor(),
    };
  }

  visitRoot(root: nodes.RootNode): RenderMap {
    this.byteSizeVisitor = getByteSizeVisitor(nodes.getAllDefinedTypes(root));

    const programsToExport = root.programs.filter((p) => !p.internal);
    const accountsToExport = nodes
      .getAllAccounts(root)
      .filter((a) => !a.internal);
    const instructionsToExport = nodes
      .getAllInstructionsWithSubs(root, !this.options.renderParentInstructions)
      .filter((i) => !i.internal);
    const definedTypesToExport = nodes
      .getAllDefinedTypes(root)
      .filter((t) => !t.internal);
    const hasAnythingToExport =
      programsToExport.length > 0 ||
      accountsToExport.length > 0 ||
      instructionsToExport.length > 0 ||
      definedTypesToExport.length > 0;

    const ctx = {
      root,
      programsToExport,
      accountsToExport,
      instructionsToExport,
      definedTypesToExport,
      hasAnythingToExport,
    };

    const map = new RenderMap();
    if (programsToExport.length > 0) {
      map
        .add('programs.rs', this.render('programsMod.njk', ctx))
        .add('errors/mod.rs', this.render('errorsMod.njk', ctx));
    }
    if (accountsToExport.length > 0) {
      map.add('accounts/mod.rs', this.render('accountsMod.njk', ctx));
    }
    if (instructionsToExport.length > 0) {
      map.add('instructions/mod.rs', this.render('instructionsMod.njk', ctx));
    }
    if (definedTypesToExport.length > 0) {
      map.add('types/mod.rs', this.render('definedTypesMod.njk', ctx));
    }

    return map
      .add('mod.rs', this.render('rootMod.njk', ctx))
      .mergeWith(...root.programs.map((program) => visit(program, this)));
  }

  visitProgram(program: nodes.ProgramNode): RenderMap {
    this.program = program;
    const { name } = program;
    const renderMap = new RenderMap()
      .mergeWith(...program.accounts.map((account) => visit(account, this)))
      .mergeWith(...program.definedTypes.map((type) => visit(type, this)));

    // Internal programs are support programs that
    // were added to fill missing types or accounts.
    // They don't need to render anything else.
    if (program.internal) {
      this.program = null;
      return renderMap;
    }

    renderMap.mergeWith(
      ...nodes
        .getAllInstructionsWithSubs(
          program,
          !this.options.renderParentInstructions
        )
        .map((ix) => visit(ix, this))
    );

    // Errors.
    if (program.errors.length > 0) {
      renderMap.add(
        `errors/${snakeCase(name)}.rs`,
        this.render('errorsPage.njk', {
          imports: new RustImportMap().toString(this.options.dependencyMap),
          program,
          errors: program.errors.map((error) => ({
            ...error,
            prefixedName: pascalCase(program.prefix) + pascalCase(error.name),
          })),
        })
      );
    }

    this.program = null;
    return renderMap;
  }

  visitAccount(account: nodes.AccountNode): RenderMap {
    const typeManifest = visit(account, this.typeManifestVisitor);

    // Seeds.
    const seedsImports = new RustImportMap();
    const seeds = account.seeds.map((seed) => {
      if (seed.kind === 'constant') {
        const seedManifest = visit(seed.type, this.typeManifestVisitor);
        const seedValue = seed.value;
        const valueManifest = renderRustValueNode(seedValue, true);
        (seedValue as any).render = valueManifest.render;
        seedsImports.mergeWith(valueManifest.imports);
        return { ...seed, typeManifest: seedManifest };
      }
      if (seed.kind === 'variable') {
        const seedManifest = visit(seed.type, this.typeManifestVisitor);
        seedsImports.mergeWith(seedManifest.imports);
        return { ...seed, typeManifest: seedManifest };
      }
      return seed;
    });
    const hasVariableSeeds =
      account.seeds.filter((seed) => seed.kind === 'variable').length > 0;

    const { imports } = typeManifest;

    if (hasVariableSeeds) {
      imports.mergeWith(seedsImports);
    }

    return new RenderMap().add(
      `accounts/${snakeCase(account.name)}.rs`,
      this.render('accountsPage.njk', {
        account,
        imports: imports
          .remove(`generatedAccounts::${pascalCase(account.name)}`)
          .toString(this.options.dependencyMap),
        program: this.program,
        typeManifest,
        seeds,
        hasVariableSeeds,
      })
    );
  }

  visitInstruction(instruction: nodes.InstructionNode): RenderMap {
    // Imports.
    const imports = new RustImportMap();
    imports.add(['borsh::BorshDeserialize', 'borsh::BorshSerialize']);

    // canMergeAccountsAndArgs
    const accountsAndArgsConflicts =
      this.getConflictsForInstructionAccountsAndArgs(instruction);
    if (accountsAndArgsConflicts.length > 0) {
      logWarn(
        `[Rust] Accounts and args of instruction [${instruction.name}] have the following ` +
          `conflicting attributes [${accountsAndArgsConflicts.join(', ')}]. ` +
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

    instruction.dataArgs.struct.fields.forEach((field) => {
      this.typeManifestVisitor.parentName =
        pascalCase(instruction.dataArgs.name) + pascalCase(field.name);
      this.typeManifestVisitor.nestedStruct = true;
      const manifest = visit(field.child, this.typeManifestVisitor);
      imports.mergeWith(manifest.imports);
      const innerOptionType = nodes.isOptionTypeNode(field.child)
        ? manifest.type.slice('Option<'.length, -1)
        : null;
      this.typeManifestVisitor.parentName = null;
      this.typeManifestVisitor.nestedStruct = false;

      let renderValue: string | null = null;
      if (field.defaultsTo) {
        const { imports: argImports, render: value } = renderRustValueNode(
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

    const typeManifest = visit(instruction, this.typeManifestVisitor);

    return new RenderMap().add(
      `instructions/${snakeCase(instruction.name)}.rs`,
      this.render('instructionsPage.njk', {
        instruction,
        imports: imports
          .remove(`generatedInstructions::${pascalCase(instruction.name)}`)
          .toString(this.options.dependencyMap),
        instructionArgs,
        hasArgs,
        hasOptional,
        program: this.program,
        typeManifest,
      })
    );
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): RenderMap {
    const typeManifest = visit(definedType, this.typeManifestVisitor);
    const imports = new RustImportMap().mergeWithManifest(typeManifest);

    return new RenderMap().add(
      `types/${snakeCase(definedType.name)}.rs`,
      this.render('definedTypesPage.njk', {
        definedType,
        imports: imports
          .remove(`generatedTypes::${pascalCase(definedType.name)}`)
          .toString(this.options.dependencyMap),
        typeManifest,
      })
    );
  }

  get typeManifestVisitor() {
    return this.options.typeManifestVisitor;
  }

  get resolvedInstructionInputVisitor() {
    return this.options.resolvedInstructionInputVisitor;
  }

  protected getConflictsForInstructionAccountsAndArgs(
    instruction: nodes.InstructionNode
  ): string[] {
    const allNames = [
      ...instruction.accounts.map((account) => account.name),
      ...instruction.dataArgs.struct.fields.map((field) => field.name),
    ];
    const duplicates = allNames.filter((e, i, a) => a.indexOf(e) !== i);
    return [...new Set(duplicates)];
  }

  protected render(
    template: string,
    context?: object,
    options?: ConfigureOptions
  ): string {
    const code = resolveTemplate(
      `${__dirname}/templates`,
      template,
      context,
      options
    );
    return code;
  }
}
