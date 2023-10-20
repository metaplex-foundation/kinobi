import type { ConfigureOptions } from 'nunjucks';
import { format as formatCode, Options as PrettierOptions } from 'prettier';
import * as nodes from '../../nodes';
import { camelCase, ImportFrom, mainCase, pascalCase } from '../../shared';
import { logWarn } from '../../shared/logs';
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
  getAccountFetchHelpersFragment,
  getAccountPdaHelpersFragment,
  getAccountSizeHelpersFragment,
  getAccountTypeFragment,
  getInstructionDataFragment,
  getInstructionExtraArgsFragment,
  getInstructionFunctionHighLevelFragment,
  getInstructionFunctionLowLevelFragment,
  getInstructionInputTypeFragment,
  getInstructionTypeFragment,
  getTypeDataEnumHelpersFragment,
  getTypeWithCodecFragment,
} from './fragments';
import { GetTypeManifestVisitor } from './GetTypeManifestVisitor';
import { ImportMap } from './ImportMap';
import { TypeManifest } from './TypeManifest';

const DEFAULT_PRETTIER_OPTIONS: PrettierOptions = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  useTabs: false,
  tabWidth: 2,
  arrowParens: 'always',
  printWidth: 80,
  parser: 'typescript',
};

export type GetRenderMapOptions = {
  renderParentInstructions?: boolean;
  formatCode?: boolean;
  prettierOptions?: PrettierOptions;
  dependencyMap?: Record<ImportFrom, string>;
  typeManifestVisitor?: Visitor<TypeManifest>;
  byteSizeVisitor?: Visitor<number | null> & {
    registerDefinedTypes?: (definedTypes: nodes.DefinedTypeNode[]) => void;
  };
  resolvedInstructionInputVisitor?: Visitor<ResolvedInstructionInput[]>;
};

export class GetRenderMapVisitor extends BaseThrowVisitor<RenderMap> {
  readonly options: Required<GetRenderMapOptions>;

  private program: nodes.ProgramNode | null = null;

  constructor(options: GetRenderMapOptions = {}) {
    super();
    this.options = {
      renderParentInstructions: options.renderParentInstructions ?? false,
      formatCode: options.formatCode ?? true,
      prettierOptions: {
        ...DEFAULT_PRETTIER_OPTIONS,
        ...options.prettierOptions,
      },
      dependencyMap: options.dependencyMap ?? {},
      typeManifestVisitor:
        options.typeManifestVisitor ?? new GetTypeManifestVisitor(),
      byteSizeVisitor: options.byteSizeVisitor ?? new GetByteSizeVisitor(),
      resolvedInstructionInputVisitor:
        options.resolvedInstructionInputVisitor ??
        new GetResolvedInstructionInputsVisitor(),
    };
  }

  visitRoot(root: nodes.RootNode): RenderMap {
    this.byteSizeVisitor.registerDefinedTypes?.(nodes.getAllDefinedTypes(root));

    const programsToExport = [] as any[]; // root.programs.filter((p) => !p.internal);
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
    if (hasAnythingToExport) {
      map.add('shared/index.ts', this.render('sharedPage.njk', ctx));
    }
    if (programsToExport.length > 0) {
      map
        .add('programs/index.ts', this.render('programsIndex.njk', ctx))
        .add('errors/index.ts', this.render('errorsIndex.njk', ctx));
    }
    if (accountsToExport.length > 0) {
      map.add('accounts/index.ts', this.render('accountsIndex.njk', ctx));
    }
    if (instructionsToExport.length > 0) {
      map.add(
        'instructions/index.ts',
        this.render('instructionsIndex.njk', ctx)
      );
    }
    if (definedTypesToExport.length > 0) {
      map.add('types/index.ts', this.render('definedTypesIndex.njk', ctx));
    }

    return map
      .add('index.ts', this.render('rootIndex.njk', ctx))
      .mergeWith(...root.programs.map((program) => visit(program, this)));
  }

  visitProgram(program: nodes.ProgramNode): RenderMap {
    this.program = program;
    // const { name } = program;
    // const pascalCaseName = pascalCase(name);
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
    // .add(
    //   `errors/${camelCase(name)}.ts`,
    //   this.render('errorsPage.njk', {
    //     imports: new ImportMap()
    //       .add('umi', ['ProgramError', 'Program'])
    //       .toString(this.options.dependencyMap),
    //     program,
    //     errors: program.errors.map((error) => ({
    //       ...error,
    //       prefixedName: pascalCase(program.prefix) + pascalCase(error.name),
    //     })),
    //   })
    // )
    // .add(
    //   `programs/${camelCase(name)}.ts`,
    //   this.render('programsPage.njk', {
    //     imports: new ImportMap()
    //       .add('umi', ['ClusterFilter', 'Context', 'Program', 'PublicKey'])
    //       .add('errors', [
    //         `get${pascalCaseName}ErrorFromCode`,
    //         `get${pascalCaseName}ErrorFromName`,
    //       ])
    //       .toString(this.options.dependencyMap),
    //     program,
    //   })
    // );
    this.program = null;
    return renderMap;
  }

  visitAccount(account: nodes.AccountNode): RenderMap {
    const typeManifest = visit(account, this.typeManifestVisitor);
    const program = this.program as nodes.ProgramNode;
    const accountTypeFragment = getAccountTypeFragment(account, typeManifest);
    const accountFetchHelpersFragment = getAccountFetchHelpersFragment(
      account,
      typeManifest
    );
    // const accountGpaHelpersFragment = getAccountGpaHelpersFragment(
    //   account,
    //   program,
    //   this.typeManifestVisitor,
    //   this.byteSizeVisitor
    // );
    const accountSizeHelpersFragment = getAccountSizeHelpersFragment(account);
    const accountPdaHelpersFragment = getAccountPdaHelpersFragment(
      account,
      program,
      this.typeManifestVisitor
    );
    const imports = new ImportMap().mergeWith(
      accountTypeFragment,
      accountFetchHelpersFragment,
      // accountGpaHelpersFragment,
      accountSizeHelpersFragment,
      accountPdaHelpersFragment
    );

    return new RenderMap().add(
      `accounts/${camelCase(account.name)}.ts`,
      this.render('accountsPage.njk', {
        imports: imports.toString(this.options.dependencyMap),
        accountTypeFragment,
        accountFetchHelpersFragment,
        // accountGpaHelpersFragment,
        accountSizeHelpersFragment,
        accountPdaHelpersFragment,
      })
    );
  }

  visitInstruction(instruction: nodes.InstructionNode): RenderMap {
    if (!this.program) {
      throw new Error('Instruction must be visited inside a program.');
    }

    // Data for fragments.
    const resolvedInputs = visit(
      instruction,
      this.resolvedInstructionInputVisitor
    );
    const dataArgsManifest = visit(
      instruction.dataArgs,
      this.typeManifestVisitor
    );
    const extraArgsManifest = visit(
      instruction.extraArgs,
      this.typeManifestVisitor
    );
    const renamedArgs = this.getRenamedArgsMap(instruction);

    // Fragments.
    const instructionTypeFragment = getInstructionTypeFragment(
      instruction,
      this.program
    );
    const instructionDataFragment = getInstructionDataFragment(
      instruction,
      dataArgsManifest
    );
    const instructionExtraArgsFragment = getInstructionExtraArgsFragment(
      instruction,
      extraArgsManifest
    );
    const instructionFunctionLowLevelFragment =
      getInstructionFunctionLowLevelFragment(
        instruction,
        this.program,
        dataArgsManifest
      );
    const instructionInputTypeFragment = getInstructionInputTypeFragment(
      instruction,
      resolvedInputs,
      renamedArgs,
      dataArgsManifest,
      extraArgsManifest,
      this.program
    );
    const instructionFunctionHighLevelFragment =
      getInstructionFunctionHighLevelFragment(
        instruction,
        this.program,
        renamedArgs,
        dataArgsManifest,
        resolvedInputs
      );

    // Imports and interfaces.
    const imports = new ImportMap().mergeWith(
      instructionTypeFragment,
      instructionDataFragment,
      instructionExtraArgsFragment,
      instructionFunctionLowLevelFragment,
      instructionInputTypeFragment,
      instructionFunctionHighLevelFragment
    );

    return new RenderMap().add(
      `instructions/${camelCase(instruction.name)}.ts`,
      this.render('instructionsPage.njk', {
        instruction,
        imports: imports.toString(this.options.dependencyMap),
        instructionTypeFragment,
        instructionDataFragment,
        instructionExtraArgsFragment,
        instructionFunctionLowLevelFragment,
        instructionInputTypeFragment,
        instructionFunctionHighLevelFragment,
      })
    );
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): RenderMap {
    const pascalCaseName = pascalCase(definedType.name);
    const typeManifest = visit(definedType, this.typeManifestVisitor);
    const typeWithCodecFragment = getTypeWithCodecFragment(
      pascalCaseName,
      typeManifest,
      definedType.docs
    );
    const typeDataEnumHelpersFragment = getTypeDataEnumHelpersFragment(
      pascalCaseName,
      definedType.data
    );
    const imports = new ImportMap()
      .mergeWith(typeWithCodecFragment, typeDataEnumHelpersFragment)
      .remove('generatedTypes', [
        pascalCaseName,
        `${pascalCaseName}Args`,
        `get${pascalCaseName}Serializer`,
      ]);

    return new RenderMap().add(
      `types/${camelCase(definedType.name)}.ts`,
      this.render('definedTypesPage.njk', {
        imports: imports.toString({
          ...this.options.dependencyMap,
          generatedTypes: '.',
        }),
        typeWithCodecFragment,
        typeDataEnumHelpersFragment,
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
  ): ImportMap {
    const imports = new ImportMap();
    accounts.forEach((account) => {
      if (account.isSigner !== true && !account.isPda)
        imports.add('umi', 'PublicKey');
      if (account.isSigner !== true) imports.add('umi', 'Pda');
      if (account.isSigner !== false) imports.add('umi', 'Signer');
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

  protected getRenamedArgsMap(
    instruction: nodes.InstructionNode
  ): Map<string, string> {
    const argNames = [
      ...instruction.dataArgs.struct.fields.map((field) => field.name),
      ...instruction.extraArgs.struct.fields.map((field) => field.name),
    ];
    const duplicateArgs = argNames.filter((e, i, a) => a.indexOf(e) !== i);
    if (duplicateArgs.length > 0) {
      throw new Error(
        `Duplicate args found: [${duplicateArgs.join(', ')}] in instruction [${
          instruction.name
        }].`
      );
    }

    const allNames = [
      ...instruction.accounts.map((account) => account.name),
      ...argNames,
    ];
    const duplicates = allNames.filter((e, i, a) => a.indexOf(e) !== i);
    if (duplicates.length === 0) return new Map();

    logWarn(
      `[JavaScriptExperimental] Accounts and args of instruction [${instruction.name}] have the following ` +
        `conflicting attributes [${duplicates.join(', ')}]. ` +
        `Thus, the arguments have been renamed to avoid conflicts in the input type.`
    );

    return new Map(
      duplicates.map((name) => [mainCase(name), mainCase(`${name}Arg`)])
    );
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
    return this.options.formatCode
      ? formatCode(code, this.options.prettierOptions)
      : code;
  }
}
