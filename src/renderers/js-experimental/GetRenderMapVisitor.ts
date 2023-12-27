import type { ConfigureOptions } from 'nunjucks';
import { format as formatCode, Options as PrettierOptions } from 'prettier';
import * as nodes from '../../nodes';
import { camelCase, ImportFrom, mainCase, RenderMap } from '../../shared';
import { logWarn } from '../../shared/logs';
import {
  BaseThrowVisitor,
  ByteSizeVisitorKeys,
  getByteSizeVisitor,
  getResolvedInstructionInputsVisitor,
  ResolvedInstructionInput,
  visit,
  Visitor,
} from '../../visitors';
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
  getInstructionParseFunctionFragment,
  getInstructionTypeFragment,
  getProgramErrorsFragment,
  getProgramFragment,
  getTypeDataEnumHelpersFragment,
  getTypeWithCodecFragment,
} from './fragments';
import { GetTypeManifestVisitor } from './GetTypeManifestVisitor';
import { ImportMap } from './ImportMap';
import {
  DEFAULT_NAME_TRANSFORMERS,
  getNameApi,
  NameApi,
  NameTransformers,
} from './nameTransformers';
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
  resolvedInstructionInputVisitor?: Visitor<
    ResolvedInstructionInput[],
    'instructionNode'
  >;
  asyncResolvers?: string[];
  nameTransformers?: Partial<NameTransformers>;
};

export class GetRenderMapVisitor extends BaseThrowVisitor<RenderMap> {
  readonly options: Required<GetRenderMapOptions> & {
    nameTransformers: NameTransformers;
  };

  private program: nodes.ProgramNode | null = null;

  private byteSizeVisitor: Visitor<number | null, ByteSizeVisitorKeys>;

  private nameApi: NameApi;

  constructor(options: GetRenderMapOptions = {}) {
    super();
    const nameTransformers = {
      ...DEFAULT_NAME_TRANSFORMERS,
      ...options.nameTransformers,
    };
    this.nameApi = getNameApi(nameTransformers);
    this.byteSizeVisitor = getByteSizeVisitor([]);
    this.options = {
      renderParentInstructions: options.renderParentInstructions ?? false,
      formatCode: options.formatCode ?? true,
      prettierOptions: {
        ...DEFAULT_PRETTIER_OPTIONS,
        ...options.prettierOptions,
      },
      dependencyMap: options.dependencyMap ?? {},
      typeManifestVisitor:
        options.typeManifestVisitor ?? new GetTypeManifestVisitor(this.nameApi),
      resolvedInstructionInputVisitor:
        options.resolvedInstructionInputVisitor ??
        getResolvedInstructionInputsVisitor(),
      asyncResolvers: options.asyncResolvers ?? [],
      nameTransformers,
    };
  }

  visitRoot(root: nodes.RootNode): RenderMap {
    this.byteSizeVisitor = getByteSizeVisitor(nodes.getAllDefinedTypes(root));

    const programsToExport = root.programs.filter((p) => !p.internal);
    const programsWithErrorsToExport = programsToExport.filter(
      (p) => p.errors.length > 0
    );
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
      programsWithErrorsToExport,
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
      map.add('programs/index.ts', this.render('programsIndex.njk', ctx));
    }
    if (programsWithErrorsToExport.length > 0) {
      map.add('errors/index.ts', this.render('errorsIndex.njk', ctx));
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
      .add('global.d.ts', this.render('globalTypesPage.njk', ctx))
      .mergeWith(...root.programs.map((program) => visit(program, this)));
  }

  visitProgram(program: nodes.ProgramNode): RenderMap {
    this.program = program;
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

    if (program.errors.length > 0) {
      const programErrorsFragment = getProgramErrorsFragment({
        programNode: program,
        nameApi: this.nameApi,
      });
      renderMap.add(
        `errors/${camelCase(program.name)}.ts`,
        this.render('errorsPage.njk', {
          imports: new ImportMap()
            .mergeWith(programErrorsFragment)
            .toString(this.options.dependencyMap),
          programErrorsFragment,
        })
      );
    }

    const programFragment = getProgramFragment({
      programNode: program,
      nameApi: this.nameApi,
    });
    renderMap.add(
      `programs/${camelCase(program.name)}.ts`,
      this.render('programsPage.njk', {
        imports: new ImportMap()
          .mergeWith(programFragment)
          .toString(this.options.dependencyMap),
        programFragment,
      })
    );

    renderMap.mergeWith(
      ...nodes
        .getAllInstructionsWithSubs(
          program,
          !this.options.renderParentInstructions
        )
        .map((ix) => visit(ix, this))
    );
    this.program = null;
    return renderMap;
  }

  visitAccount(account: nodes.AccountNode): RenderMap {
    if (!this.program) {
      throw new Error('Account must be visited inside a program.');
    }

    const scope = {
      accountNode: account,
      programNode: this.program,
      typeManifest: visit(account, this.typeManifestVisitor),
      typeManifestVisitor: this.typeManifestVisitor,
      nameApi: this.nameApi,
    };

    const accountTypeFragment = getAccountTypeFragment(scope);
    const accountFetchHelpersFragment = getAccountFetchHelpersFragment(scope);
    const accountSizeHelpersFragment = getAccountSizeHelpersFragment(scope);
    const accountPdaHelpersFragment = getAccountPdaHelpersFragment(scope);
    const imports = new ImportMap().mergeWith(
      accountTypeFragment,
      accountFetchHelpersFragment,
      accountSizeHelpersFragment,
      accountPdaHelpersFragment
    );

    return new RenderMap().add(
      `accounts/${camelCase(account.name)}.ts`,
      this.render('accountsPage.njk', {
        imports: imports.toString(this.options.dependencyMap),
        accountTypeFragment,
        accountFetchHelpersFragment,
        accountSizeHelpersFragment,
        accountPdaHelpersFragment,
      })
    );
  }

  visitInstruction(instruction: nodes.InstructionNode): RenderMap {
    if (!this.program) {
      throw new Error('Instruction must be visited inside a program.');
    }

    const scope = {
      instructionNode: instruction,
      programNode: this.program,
      renamedArgs: this.getRenamedArgsMap(instruction),
      dataArgsManifest: visit(instruction.dataArgs, this.typeManifestVisitor),
      extraArgsManifest: visit(instruction.extraArgs, this.typeManifestVisitor),
      resolvedInputs: visit(instruction, this.resolvedInstructionInputVisitor),
      asyncResolvers: this.options.asyncResolvers,
      nameApi: this.nameApi,
    };

    // Fragments.
    const instructionTypeFragment = getInstructionTypeFragment({
      ...scope,
      withSigners: false,
    });
    const instructionTypeWithSignersFragment = getInstructionTypeFragment({
      ...scope,
      withSigners: true,
    });
    const instructionDataFragment = getInstructionDataFragment(scope);
    const instructionExtraArgsFragment = getInstructionExtraArgsFragment(scope);
    const instructionFunctionHighLevelAsyncFragment =
      getInstructionFunctionHighLevelFragment({ ...scope, useAsync: true });
    const instructionFunctionHighLevelSyncFragment =
      getInstructionFunctionHighLevelFragment({ ...scope, useAsync: false });
    const instructionFunctionLowLevelFragment =
      getInstructionFunctionLowLevelFragment(scope);
    const instructionParseFunctionFragment =
      getInstructionParseFunctionFragment(scope);

    // Imports and interfaces.
    const imports = new ImportMap().mergeWith(
      instructionTypeFragment,
      instructionTypeWithSignersFragment,
      instructionDataFragment,
      instructionExtraArgsFragment,
      instructionFunctionHighLevelAsyncFragment,
      instructionFunctionHighLevelSyncFragment,
      instructionFunctionLowLevelFragment,
      instructionParseFunctionFragment
    );

    return new RenderMap().add(
      `instructions/${camelCase(instruction.name)}.ts`,
      this.render('instructionsPage.njk', {
        instruction,
        imports: imports.toString(this.options.dependencyMap),
        instructionTypeFragment,
        instructionTypeWithSignersFragment,
        instructionDataFragment,
        instructionExtraArgsFragment,
        instructionFunctionHighLevelAsyncFragment,
        instructionFunctionHighLevelSyncFragment,
        instructionFunctionLowLevelFragment,
        instructionParseFunctionFragment,
      })
    );
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): RenderMap {
    const scope = {
      typeNode: definedType.data,
      name: definedType.name,
      manifest: visit(definedType, this.typeManifestVisitor),
      typeDocs: definedType.docs,
      encoderDocs: [],
      decoderDocs: [],
      codecDocs: [],
      nameApi: this.nameApi,
    };

    const typeWithCodecFragment = getTypeWithCodecFragment(scope);
    const typeDataEnumHelpersFragment = getTypeDataEnumHelpersFragment(scope);
    const imports = new ImportMap()
      .mergeWith(typeWithCodecFragment, typeDataEnumHelpersFragment)
      .remove('generatedTypes', [
        this.nameApi.dataType(definedType.name),
        this.nameApi.dataArgsType(definedType.name),
        this.nameApi.encoderFunction(definedType.name),
        this.nameApi.decoderFunction(definedType.name),
        this.nameApi.codecFunction(definedType.name),
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

  get resolvedInstructionInputVisitor() {
    return this.options.resolvedInstructionInputVisitor;
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
