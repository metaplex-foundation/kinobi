import type { ConfigureOptions } from 'nunjucks';
import * as nodes from '../../nodes';
import { camelCase, ImportFrom, pascalCase, snakeCase } from '../../shared';
import {
  BaseThrowVisitor,
  GetByteSizeVisitor,
  GetResolvedInstructionInputsVisitor,
  ResolvedInstructionAccount,
  ResolvedInstructionInput,
  visit,
  Visitor,
} from '../../visitors';
import { RenderMap } from '../RenderMap';
import { resolveTemplate } from '../utils';
import {
  GetRustTypeManifestVisitor,
  RustTypeManifest,
} from './GetRustTypeManifestVisitor';
import { RustImportMap } from './RustImportMap';

export type GetRustRenderMapOptions = {
  renderParentInstructions?: boolean;
  dependencyMap?: Record<ImportFrom, string>;
  typeManifestVisitor?: Visitor<RustTypeManifest>;
  byteSizeVisitor?: Visitor<number | null> & {
    registerDefinedTypes?: (definedTypes: nodes.DefinedTypeNode[]) => void;
  };
  resolvedInstructionInputVisitor?: Visitor<ResolvedInstructionInput[]>;
};

export class GetRustRenderMapVisitor extends BaseThrowVisitor<RenderMap> {
  readonly options: Required<GetRustRenderMapOptions>;

  private program: nodes.ProgramNode | null = null;

  constructor(options: GetRustRenderMapOptions = {}) {
    super();
    this.options = {
      renderParentInstructions: options.renderParentInstructions ?? false,
      dependencyMap: { ...options.dependencyMap },
      typeManifestVisitor:
        options.typeManifestVisitor ?? new GetRustTypeManifestVisitor(),
      byteSizeVisitor: options.byteSizeVisitor ?? new GetByteSizeVisitor(),
      resolvedInstructionInputVisitor:
        options.resolvedInstructionInputVisitor ??
        new GetResolvedInstructionInputsVisitor(),
    };
  }

  visitRoot(root: nodes.RootNode): RenderMap {
    this.byteSizeVisitor.registerDefinedTypes?.(nodes.getAllDefinedTypes(root));

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
        .add('programs/mod.rs', this.render('programsMod.njk', ctx))
        .add('errors/mod.rs', this.render('errorsMod.njk', ctx));
    }
    if (accountsToExport.length > 0) {
      map.add('accounts/mod.rs', this.render('accountsMod.njk', ctx));
    }
    if (instructionsToExport.length > 0) {
      map.add('instructions/mod.rs', this.render('instructionsMod.njk', ctx));
    }
    if (definedTypesToExport.length > 0) {
      map
        .add('types/mod.rs', this.render('definedTypesMod.njk', ctx))
        .add('types/helper/mod.rs', this.render('sharedPage.njk', ctx));
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

    renderMap
      .mergeWith(
        ...nodes
          .getAllInstructionsWithSubs(
            program,
            !this.options.renderParentInstructions
          )
          .map((ix) => visit(ix, this))
      )
      .add(
        `errors/${snakeCase(name)}.rs`,
        this.render('errorsPage.njk', {
          imports: new RustImportMap().toString(this.options.dependencyMap),
          program,
          errors: program.errors.map((error) => ({
            ...error,
            prefixedName: pascalCase(program.prefix) + pascalCase(error.name),
          })),
        })
      )
      .add(
        `programs/${snakeCase(name)}.rs`,
        this.render('programsPage.njk', {
          imports: new RustImportMap().toString(this.options.dependencyMap),
          program,
        })
      );
    this.program = null;
    return renderMap;
  }

  visitAccount(account: nodes.AccountNode): RenderMap {
    const typeManifest = visit(account, this.typeManifestVisitor);
    const { imports } = typeManifest;

    return new RenderMap().add(
      `accounts/${snakeCase(account.name)}.rs`,
      this.render('accountsPage.njk', {
        account,
        imports: imports.toString(this.options.dependencyMap),
        program: this.program,
        typeManifest,
      })
    );
  }

  visitInstruction(instruction: nodes.InstructionNode): RenderMap {
    // Imports.
    const imports = new RustImportMap();

    return new RenderMap().add(
      `instructions/${snakeCase(instruction.name)}.rs`,
      this.render('instructionsPage.njk', {
        instruction,
        imports: imports.toString(this.options.dependencyMap),
        program: this.program,
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
        imports: imports.toString(this.options.dependencyMap),
        typeManifest,
      })
    );
  }

  get typeManifestVisitor() {
    return this.options.typeManifestVisitor;
  }

  get byteSizeVisitor() {
    return this.options.byteSizeVisitor;
  }

  get resolvedInstructionInputVisitor() {
    return this.options.resolvedInstructionInputVisitor;
  }

  protected getInstructionAccountType(
    account: ResolvedInstructionAccount
  ): string {
    if (account.isPda && account.isSigner === false) return 'Pda';
    if (account.isSigner === 'either') return 'PublicKey | Pda | Signer';
    return account.isSigner ? 'Signer' : 'PublicKey | Pda';
  }

  protected getInstructionAccountImports(
    accounts: ResolvedInstructionAccount[]
  ): RustImportMap {
    const imports = new RustImportMap();
    accounts.forEach((account) => {
      if (account.isSigner !== true && !account.isPda)
        imports.add('umi', 'PublicKey');
      if (account.isSigner !== true) imports.add('umi', 'Pda');
      if (account.isSigner !== false) imports.add('umi', 'Signer');

      if (account.defaultsTo?.kind === 'publicKey') {
        imports.add('umi', 'publicKey');
      } else if (account.defaultsTo?.kind === 'pda') {
        const pdaAccount = pascalCase(account.defaultsTo.pdaAccount);
        const importFrom =
          account.defaultsTo.importFrom === 'generated'
            ? 'generatedAccounts'
            : account.defaultsTo.importFrom;
        imports.add(importFrom, `find${pdaAccount}Pda`);
        Object.values(account.defaultsTo.seeds).forEach((seed) => {
          if (seed.kind === 'account') {
            imports.add('umi', 'publicKey');
          }
        });
      } else if (account.defaultsTo?.kind === 'resolver') {
        imports.add(
          account.defaultsTo.importFrom,
          camelCase(account.defaultsTo.name)
        );
      }
    });
    return imports;
  }

  protected getMergeConflictsForInstructionAccountsAndArgs(
    instruction: nodes.InstructionNode
  ): string[] {
    const allNames = [
      ...instruction.accounts.map((account) => account.name),
      ...instruction.dataArgs.struct.fields.map((field) => field.name),
      ...instruction.extraArgs.struct.fields.map((field) => field.name),
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
