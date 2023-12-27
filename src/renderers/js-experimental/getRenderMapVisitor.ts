import type { ConfigureOptions } from 'nunjucks';
import {
  format as formatCodeUsingPrettier,
  Options as PrettierOptions,
} from 'prettier';
import {
  getAllAccounts,
  getAllDefinedTypes,
  getAllInstructionsWithSubs,
  InstructionNode,
  ProgramNode,
} from '../../nodes';
import {
  camelCase,
  ImportFrom,
  logWarn,
  mainCase,
  RenderMap,
  resolveTemplate,
} from '../../shared';
import {
  getResolvedInstructionInputsVisitor,
  staticVisitor,
  visit,
} from '../../visitors';
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
  NameTransformers,
} from './nameTransformers';

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
  asyncResolvers?: string[];
  nameTransformers?: Partial<NameTransformers>;
};

export function getRenderMapVisitor(options: GetRenderMapOptions = {}) {
  let program: ProgramNode | null = null;

  const nameTransformers = {
    ...DEFAULT_NAME_TRANSFORMERS,
    ...options.nameTransformers,
  };
  const nameApi = getNameApi(nameTransformers);
  const renderParentInstructions = options.renderParentInstructions ?? false;
  const formatCode = options.formatCode ?? true;
  const prettierOptions = {
    ...DEFAULT_PRETTIER_OPTIONS,
    ...options.prettierOptions,
  };
  const dependencyMap = options.dependencyMap ?? {};
  const asyncResolvers = options.asyncResolvers ?? [];

  const typeManifestVisitor = new GetTypeManifestVisitor(nameApi);
  const resolvedInstructionInputVisitor = getResolvedInstructionInputsVisitor();

  function render(
    template: string,
    context?: object,
    renderOptions?: ConfigureOptions
  ): string {
    const code = resolveTemplate(
      `${__dirname}/templates`,
      template,
      context,
      renderOptions
    );
    return formatCode ? formatCodeUsingPrettier(code, prettierOptions) : code;
  }

  const visitor = staticVisitor(
    () => new RenderMap(),
    [
      'rootNode',
      'programNode',
      'instructionNode',
      'accountNode',
      'definedTypeNode',
    ]
  );

  visitor.visitRoot = (node) => {
    const programsToExport = node.programs.filter((p) => !p.internal);
    const programsWithErrorsToExport = programsToExport.filter(
      (p) => p.errors.length > 0
    );
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
      programsWithErrorsToExport,
      accountsToExport,
      instructionsToExport,
      definedTypesToExport,
      hasAnythingToExport,
    };

    const map = new RenderMap();
    if (hasAnythingToExport) {
      map.add('shared/index.ts', render('sharedPage.njk', ctx));
    }
    if (programsToExport.length > 0) {
      map.add('programs/index.ts', render('programsIndex.njk', ctx));
    }
    if (programsWithErrorsToExport.length > 0) {
      map.add('errors/index.ts', render('errorsIndex.njk', ctx));
    }
    if (accountsToExport.length > 0) {
      map.add('accounts/index.ts', render('accountsIndex.njk', ctx));
    }
    if (instructionsToExport.length > 0) {
      map.add('instructions/index.ts', render('instructionsIndex.njk', ctx));
    }
    if (definedTypesToExport.length > 0) {
      map.add('types/index.ts', render('definedTypesIndex.njk', ctx));
    }

    return map
      .add('index.ts', render('rootIndex.njk', ctx))
      .add('global.d.ts', render('globalTypesPage.njk', ctx))
      .mergeWith(...node.programs.map((p) => visit(p, visitor)));
  };

  visitor.visitProgram = (node) => {
    program = node;
    const renderMap = new RenderMap()
      .mergeWith(...node.accounts.map((account) => visit(account, visitor)))
      .mergeWith(...node.definedTypes.map((type) => visit(type, visitor)));

    // Internal programs are support programs that
    // were added to fill missing types or accounts.
    // They don't need to render anything else.
    if (node.internal) {
      program = null;
      return renderMap;
    }

    if (node.errors.length > 0) {
      const programErrorsFragment = getProgramErrorsFragment({
        programNode: node,
        nameApi,
      });
      renderMap.add(
        `errors/${camelCase(node.name)}.ts`,
        render('errorsPage.njk', {
          imports: new ImportMap()
            .mergeWith(programErrorsFragment)
            .toString(dependencyMap),
          programErrorsFragment,
        })
      );
    }

    const programFragment = getProgramFragment({ programNode: node, nameApi });
    renderMap.add(
      `programs/${camelCase(node.name)}.ts`,
      render('programsPage.njk', {
        imports: new ImportMap()
          .mergeWith(programFragment)
          .toString(dependencyMap),
        programFragment,
      })
    );

    renderMap.mergeWith(
      ...getAllInstructionsWithSubs(program, !renderParentInstructions).map(
        (ix) => visit(ix, visitor)
      )
    );
    program = null;
    return renderMap;
  };

  visitor.visitAccount = (node) => {
    if (!program) {
      throw new Error('Account must be visited inside a program.');
    }

    const scope = {
      accountNode: node,
      programNode: program,
      typeManifest: visit(node, typeManifestVisitor),
      typeManifestVisitor,
      nameApi,
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
      `accounts/${camelCase(node.name)}.ts`,
      render('accountsPage.njk', {
        imports: imports.toString(dependencyMap),
        accountTypeFragment,
        accountFetchHelpersFragment,
        accountSizeHelpersFragment,
        accountPdaHelpersFragment,
      })
    );
  };

  visitor.visitInstruction = (node) => {
    if (!program) {
      throw new Error('Instruction must be visited inside a program.');
    }

    const scope = {
      instructionNode: node,
      programNode: program,
      renamedArgs: getRenamedArgsMap(node),
      dataArgsManifest: visit(node.dataArgs, typeManifestVisitor),
      extraArgsManifest: visit(node.extraArgs, typeManifestVisitor),
      resolvedInputs: visit(node, resolvedInstructionInputVisitor),
      asyncResolvers,
      nameApi,
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
      `instructions/${camelCase(node.name)}.ts`,
      render('instructionsPage.njk', {
        instruction: node,
        imports: imports.toString(dependencyMap),
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
  };

  visitor.visitDefinedType = (node) => {
    const scope = {
      typeNode: node.data,
      name: node.name,
      manifest: visit(node, typeManifestVisitor),
      typeDocs: node.docs,
      encoderDocs: [],
      decoderDocs: [],
      codecDocs: [],
      nameApi,
    };

    const typeWithCodecFragment = getTypeWithCodecFragment(scope);
    const typeDataEnumHelpersFragment = getTypeDataEnumHelpersFragment(scope);
    const imports = new ImportMap()
      .mergeWith(typeWithCodecFragment, typeDataEnumHelpersFragment)
      .remove('generatedTypes', [
        nameApi.dataType(node.name),
        nameApi.dataArgsType(node.name),
        nameApi.encoderFunction(node.name),
        nameApi.decoderFunction(node.name),
        nameApi.codecFunction(node.name),
      ]);

    return new RenderMap().add(
      `types/${camelCase(node.name)}.ts`,
      render('definedTypesPage.njk', {
        imports: imports.toString({
          ...dependencyMap,
          generatedTypes: '.',
        }),
        typeWithCodecFragment,
        typeDataEnumHelpersFragment,
      })
    );
  };

  return visitor;
}

function getRenamedArgsMap(instruction: InstructionNode): Map<string, string> {
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
