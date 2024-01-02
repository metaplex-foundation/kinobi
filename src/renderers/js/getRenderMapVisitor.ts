import { ConfigureOptions } from 'nunjucks';
import {
  format as formatCodeUsingPrettier,
  Options as PrettierOptions,
} from 'prettier';
import {
  getAllAccounts,
  getAllDefinedTypes,
  getAllInstructionsWithSubs,
  InstructionNode,
  isDataEnum,
  isNode,
  isNodeFilter,
  ProgramNode,
} from '../../nodes';
import {
  camelCase,
  getGpaFieldsFromAccount,
  ImportFrom,
  LinkableDictionary,
  logWarn,
  mainCase,
  pascalCase,
  pipe,
  RenderMap,
  resolveTemplate,
} from '../../shared';
import {
  extendVisitor,
  getByteSizeVisitor,
  getResolvedInstructionInputsVisitor,
  recordLinkablesVisitor,
  ResolvedInstructionAccount,
  ResolvedInstructionInput,
  staticVisitor,
  visit,
  Visitor,
} from '../../visitors';
import { getTypeManifestVisitor } from './getTypeManifestVisitor';
import { JavaScriptContextMap } from './JavaScriptContextMap';
import { JavaScriptImportMap } from './JavaScriptImportMap';
import { renderInstructionDefaults } from './renderInstructionDefaults';
import { renderValueNodeVisitor } from './renderValueNodeVisitor';

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

export type GetJavaScriptRenderMapOptions = {
  renderParentInstructions?: boolean;
  formatCode?: boolean;
  prettierOptions?: PrettierOptions;
  dependencyMap?: Record<ImportFrom, string>;
  nonScalarEnums?: string[];
};

export function getRenderMapVisitor(
  options: GetJavaScriptRenderMapOptions = {}
): Visitor<RenderMap> {
  const linkables = new LinkableDictionary();
  const byteSizeVisitor = getByteSizeVisitor(linkables);
  let program: ProgramNode | null = null;

  const renderParentInstructions = options.renderParentInstructions ?? false;
  const formatCode = options.formatCode ?? true;
  const prettierOptions = {
    ...DEFAULT_PRETTIER_OPTIONS,
    ...options.prettierOptions,
  };
  const dependencyMap = {
    generated: '..',
    hooked: '../../hooked',
    umi: '@metaplex-foundation/umi',
    umiSerializers: '@metaplex-foundation/umi/serializers',
    mplEssentials: '@metaplex-foundation/mpl-toolbox',
    mplToolbox: '@metaplex-foundation/mpl-toolbox',
    ...options.dependencyMap,
    // Custom relative dependencies to link generated files together.
    generatedPrograms: '../programs',
    generatedAccounts: '../accounts',
    generatedErrors: '../errors',
    generatedTypes: '../types',
  };
  const nonScalarEnums = (options.nonScalarEnums ?? []).map(mainCase);

  const valueNodeVisitor = renderValueNodeVisitor({
    linkables,
    nonScalarEnums,
  });
  const typeManifestVisitor = getTypeManifestVisitor(valueNodeVisitor);
  const resolvedInstructionInputVisitor = getResolvedInstructionInputsVisitor();

  function getInstructionAccountType(
    account: ResolvedInstructionAccount
  ): string {
    if (account.isPda && account.isSigner === false) return 'Pda';
    if (account.isSigner === 'either') return 'PublicKey | Pda | Signer';
    return account.isSigner ? 'Signer' : 'PublicKey | Pda';
  }

  function getInstructionAccountImports(
    accounts: ResolvedInstructionAccount[]
  ): JavaScriptImportMap {
    const imports = new JavaScriptImportMap();
    accounts.forEach((account) => {
      if (account.isSigner !== true && !account.isPda)
        imports.add('umi', 'PublicKey');
      if (account.isSigner !== true) imports.add('umi', 'Pda');
      if (account.isSigner !== false) imports.add('umi', 'Signer');
    });
    return imports;
  }

  function getMergeConflictsForInstructionAccountsAndArgs(
    instruction: InstructionNode
  ): string[] {
    const allNames = [
      ...instruction.accounts.map((account) => account.name),
      ...instruction.dataArgs.struct.fields.map((field) => field.name),
      ...instruction.extraArgs.struct.fields.map((field) => field.name),
    ];
    const duplicates = allNames.filter((e, i, a) => a.indexOf(e) !== i);
    return [...new Set(duplicates)];
  }

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

  return pipe(
    staticVisitor(() => new RenderMap()),
    (v) =>
      extendVisitor(v, {
        visitRoot(node, { self }) {
          const programsToExport = node.programs.filter((p) => !p.internal);
          const accountsToExport = getAllAccounts(node).filter(
            (a) => !a.internal
          );
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
          if (hasAnythingToExport) {
            map.add('shared/index.ts', render('sharedPage.njk', ctx));
          }
          if (programsToExport.length > 0) {
            map
              .add('programs/index.ts', render('programsIndex.njk', ctx))
              .add('errors/index.ts', render('errorsIndex.njk', ctx));
          }
          if (accountsToExport.length > 0) {
            map.add('accounts/index.ts', render('accountsIndex.njk', ctx));
          }
          if (instructionsToExport.length > 0) {
            map.add(
              'instructions/index.ts',
              render('instructionsIndex.njk', ctx)
            );
          }
          if (definedTypesToExport.length > 0) {
            map.add('types/index.ts', render('definedTypesIndex.njk', ctx));
          }

          return map
            .add('index.ts', render('rootIndex.njk', ctx))
            .mergeWith(...node.programs.map((p) => visit(p, self)));
        },

        visitProgram(node, { self }) {
          program = node;
          const pascalCaseName = pascalCase(node.name);
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

          renderMap
            .mergeWith(
              ...getAllInstructionsWithSubs(
                node,
                !renderParentInstructions
              ).map((ix) => visit(ix, self))
            )
            .add(
              `errors/${camelCase(node.name)}.ts`,
              render('errorsPage.njk', {
                imports: new JavaScriptImportMap()
                  .add('umi', ['ProgramError', 'Program'])
                  .toString(dependencyMap),
                program: node,
                errors: node.errors.map((error) => ({
                  ...error,
                  prefixedName:
                    pascalCase(node.prefix) + pascalCase(error.name),
                })),
              })
            )
            .add(
              `programs/${camelCase(node.name)}.ts`,
              render('programsPage.njk', {
                imports: new JavaScriptImportMap()
                  .add('umi', [
                    'ClusterFilter',
                    'Context',
                    'Program',
                    'PublicKey',
                  ])
                  .add('errors', [
                    `get${pascalCaseName}ErrorFromCode`,
                    `get${pascalCaseName}ErrorFromName`,
                  ])
                  .toString(dependencyMap),
                program: node,
              })
            );
          program = null;
          return renderMap;
        },

        visitAccount(node) {
          const isLinked = !!node.data.link;
          const typeManifest = visit(node, typeManifestVisitor);
          const imports = new JavaScriptImportMap().mergeWith(
            typeManifest.strictImports,
            typeManifest.serializerImports
          );
          if (!isLinked) {
            imports.mergeWith(typeManifest.looseImports);
          }
          imports
            .add('umi', [
              'Account',
              'assertAccountExists',
              'Context',
              'deserializeAccount',
              'Pda',
              'PublicKey',
              'publicKey',
              'RpcAccount',
              'RpcGetAccountOptions',
              'RpcGetAccountsOptions',
            ])
            .add('umiSerializers', !isLinked ? ['Serializer'] : [])
            .addAlias('umi', 'publicKey', 'toPublicKey');

          // Discriminator.
          const { discriminator } = node;
          let resolvedDiscriminator:
            | { kind: 'size'; value: string }
            | { kind: 'field'; name: string; value: string }
            | null = null;
          if (discriminator?.kind === 'field') {
            const discriminatorField = node.data.struct.fields.find(
              (f) => f.name === discriminator.name
            );
            const discriminatorValue = discriminatorField?.defaultValue
              ? visit(discriminatorField.defaultValue, valueNodeVisitor)
              : undefined;
            if (discriminatorValue) {
              imports.mergeWith(discriminatorValue.imports);
              resolvedDiscriminator = {
                kind: 'field',
                name: discriminator.name,
                value: discriminatorValue.render,
              };
            }
          } else if (discriminator?.kind === 'size') {
            resolvedDiscriminator =
              node.size !== undefined
                ? { kind: 'size', value: `${node.size}` }
                : null;
          }

          // GPA Fields.
          const gpaFields = getGpaFieldsFromAccount(node, byteSizeVisitor).map(
            (gpaField) => {
              const gpaFieldManifest = visit(
                gpaField.type,
                typeManifestVisitor
              );
              imports.mergeWith(
                gpaFieldManifest.looseImports,
                gpaFieldManifest.serializerImports
              );
              return { ...gpaField, manifest: gpaFieldManifest };
            }
          );
          let resolvedGpaFields: { type: string; argument: string } | null =
            null;
          if (gpaFields.length > 0) {
            imports.add('umi', ['gpaBuilder']);
            resolvedGpaFields = {
              type: `{ ${gpaFields
                .map((f) => `'${f.name}': ${f.manifest.looseType}`)
                .join(', ')} }`,
              argument: `{ ${gpaFields
                .map((f) => {
                  const offset = f.offset === null ? 'null' : `${f.offset}`;
                  return `'${f.name}': [${offset}, ${f.manifest.serializer}]`;
                })
                .join(', ')} }`,
            };
          }

          // Seeds.
          const pda = node.pda ? linkables.get(node.pda) : undefined;
          const pdaSeeds = pda?.seeds ?? [];
          const seeds = pdaSeeds.map((seed) => {
            if (isNode(seed, 'constantPdaSeedNode')) {
              const seedManifest = visit(seed.type, typeManifestVisitor);
              imports.mergeWith(seedManifest.serializerImports);
              const seedValue = seed.value;
              const valueManifest = visit(seedValue, valueNodeVisitor);
              (seedValue as any).render = valueManifest.render;
              imports.mergeWith(valueManifest.imports);
              return { ...seed, typeManifest: seedManifest };
            }
            if (isNode(seed, 'variablePdaSeedNode')) {
              const seedManifest = visit(seed.type, typeManifestVisitor);
              imports.mergeWith(
                seedManifest.looseImports,
                seedManifest.serializerImports
              );
              return { ...seed, typeManifest: seedManifest };
            }
            imports
              .add('umiSerializers', 'publicKey')
              .addAlias('umiSerializers', 'publicKey', 'publicKeySerializer');
            return seed;
          });
          if (seeds.length > 0) {
            imports.add('umi', ['Pda']);
          }
          const hasVariableSeeds =
            pdaSeeds.filter(isNodeFilter('variablePdaSeedNode')).length > 0;

          return new RenderMap().add(
            `accounts/${camelCase(node.name)}.ts`,
            render('accountsPage.njk', {
              account: node,
              imports: imports.toString(dependencyMap),
              program,
              typeManifest,
              discriminator: resolvedDiscriminator,
              gpaFields: resolvedGpaFields,
              seeds,
              hasVariableSeeds,
            })
          );
        },

        visitInstruction(node) {
          // Imports and interfaces.
          const interfaces = new JavaScriptContextMap().add('programs');
          const imports = new JavaScriptImportMap()
            .add('umi', ['Context', 'TransactionBuilder', 'transactionBuilder'])
            .add('shared', [
              'ResolvedAccount',
              'ResolvedAccountsWithIndices',
              'getAccountMetasAndSigners',
            ]);

          // Instruction helpers.
          const hasAccounts = node.accounts.length > 0;
          const hasData =
            !!node.dataArgs.link || node.dataArgs.struct.fields.length > 0;
          const hasDataArgs =
            !!node.dataArgs.link ||
            node.dataArgs.struct.fields.filter(
              (field) => field.defaultValueStrategy !== 'omitted'
            ).length > 0;
          const hasExtraArgs =
            !!node.extraArgs.link ||
            node.extraArgs.struct.fields.filter(
              (field) => field.defaultValueStrategy !== 'omitted'
            ).length > 0;
          const hasAnyArgs = hasDataArgs || hasExtraArgs;
          const hasArgDefaults = Object.keys(node.argDefaults).length > 0;
          const hasArgResolvers = Object.values(node.argDefaults).some(
            isNodeFilter('resolverValueNode')
          );
          const hasAccountResolvers = node.accounts.some(({ defaultsTo }) =>
            isNode(defaultsTo, 'resolverValueNode')
          );
          const hasByteResolver = node.bytesCreatedOnChain?.kind === 'resolver';
          const hasRemainingAccountsResolver =
            node.remainingAccounts?.kind === 'resolver';
          const hasResolvers =
            hasArgResolvers ||
            hasAccountResolvers ||
            hasByteResolver ||
            hasRemainingAccountsResolver;
          const hasResolvedArgs = hasDataArgs || hasArgDefaults || hasResolvers;
          if (hasResolvers) {
            interfaces.add(['eddsa', 'identity', 'payer']);
          }

          // canMergeAccountsAndArgs
          const linkedDataArgs = !!node.dataArgs.link;
          const linkedExtraArgs = !!node.extraArgs.link;
          let canMergeAccountsAndArgs = false;
          if (!linkedDataArgs && !linkedExtraArgs) {
            const accountsAndArgsConflicts =
              getMergeConflictsForInstructionAccountsAndArgs(node);
            if (accountsAndArgsConflicts.length > 0) {
              logWarn(
                `[JavaScript] Accounts and args of instruction [${node.name}] have the following ` +
                  `conflicting attributes [${accountsAndArgsConflicts.join(
                    ', '
                  )}]. ` +
                  `Thus, they could not be merged into a single input object. ` +
                  'You may want to rename the conflicting attributes.'
              );
            }
            canMergeAccountsAndArgs = accountsAndArgsConflicts.length === 0;
          }

          // Resolved inputs.
          let argObject = canMergeAccountsAndArgs ? 'input' : 'args';
          argObject = hasResolvedArgs ? 'resolvedArgs' : argObject;
          const resolvedInputs = visit(
            node,
            resolvedInstructionInputVisitor
          ).map((input: ResolvedInstructionInput) => {
            const renderedInput = renderInstructionDefaults(
              input,
              valueNodeVisitor,
              node.optionalAccountStrategy,
              argObject
            );
            imports.mergeWith(renderedInput.imports);
            interfaces.mergeWith(renderedInput.interfaces);
            return { ...input, render: renderedInput.render };
          });
          const resolvedInputsWithDefaults = resolvedInputs.filter(
            (input) => input.defaultsTo !== undefined && input.render !== ''
          );
          const argsWithDefaults = resolvedInputsWithDefaults
            .filter((input) => input.kind === 'argument')
            .map((input) => input.name);

          // Accounts.
          const accounts = node.accounts.map((account) => {
            const hasDefaultValue = !!account.defaultsTo;
            const resolvedAccount = resolvedInputs.find(
              (input) =>
                input.kind === 'instructionAccountNode' &&
                input.name === account.name
            ) as ResolvedInstructionAccount;
            return {
              ...resolvedAccount,
              type: getInstructionAccountType(resolvedAccount),
              optionalSign: hasDefaultValue || account.isOptional ? '?' : '',
              hasDefaultValue,
            };
          });
          imports.mergeWith(getInstructionAccountImports(accounts));

          // Data Args.
          const dataArgManifest = visit(node.dataArgs, typeManifestVisitor);
          if (linkedDataArgs || hasData) {
            imports.mergeWith(
              dataArgManifest.looseImports,
              dataArgManifest.serializerImports
            );
          }
          if (!linkedDataArgs) {
            imports.mergeWith(dataArgManifest.strictImports);
          }
          if (!linkedDataArgs && hasData) {
            imports.add('umiSerializers', ['Serializer']);
          }

          // Extra args.
          const extraArgManifest = visit(node.extraArgs, typeManifestVisitor);
          imports.mergeWith(extraArgManifest.looseImports);

          // Arg defaults.
          Object.values(node.argDefaults).forEach((argDefault) => {
            if (isNode(argDefault, 'resolverValueNode')) {
              imports.add(
                argDefault.importFrom ?? 'hooked',
                camelCase(argDefault.name)
              );
            }
          });
          if (argsWithDefaults.length > 0) {
            imports.add('shared', ['PickPartial']);
          }

          // Bytes created on chain.
          const bytes = node.bytesCreatedOnChain;
          if (bytes && 'includeHeader' in bytes && bytes.includeHeader) {
            imports.add('umi', 'ACCOUNT_HEADER_SIZE');
          }
          if (bytes?.kind === 'account') {
            const accountName = pascalCase(bytes.name);
            const importFrom = bytes.importFrom ?? 'generatedAccounts';
            imports.add(importFrom, `get${accountName}Size`);
          } else if (bytes?.kind === 'resolver') {
            imports.add(bytes.importFrom, camelCase(bytes.name));
          }

          // Remaining accounts.
          const { remainingAccounts } = node;
          if (remainingAccounts?.kind === 'resolver') {
            imports.add(
              remainingAccounts.importFrom,
              camelCase(remainingAccounts.name)
            );
          }

          return new RenderMap().add(
            `instructions/${camelCase(node.name)}.ts`,
            render('instructionsPage.njk', {
              instruction: node,
              imports: imports.toString(dependencyMap),
              interfaces: interfaces.toString(),
              program,
              resolvedInputs,
              resolvedInputsWithDefaults,
              argsWithDefaults,
              accounts,
              dataArgManifest,
              extraArgManifest,
              canMergeAccountsAndArgs,
              hasAccounts,
              hasData,
              hasDataArgs,
              hasExtraArgs,
              hasAnyArgs,
              hasArgDefaults,
              hasArgResolvers,
              hasAccountResolvers,
              hasByteResolver,
              hasRemainingAccountsResolver,
              hasResolvers,
              hasResolvedArgs,
            })
          );
        },

        visitDefinedType(node) {
          const pascalCaseName = pascalCase(node.name);
          const typeManifest = visit(node, typeManifestVisitor);
          const imports = new JavaScriptImportMap()
            .mergeWithManifest(typeManifest)
            .add('umiSerializers', ['Serializer'])
            .remove('generatedTypes', [
              pascalCaseName,
              `${pascalCaseName}Args`,
              `get${pascalCaseName}Serializer`,
            ]);

          return new RenderMap().add(
            `types/${camelCase(node.name)}.ts`,
            render('definedTypesPage.njk', {
              definedType: node,
              imports: imports.toString({
                ...dependencyMap,
                generatedTypes: '.',
              }),
              typeManifest,
              isDataEnum:
                isNode(node.type, 'enumTypeNode') && isDataEnum(node.type),
            })
          );
        },
      }),
    (v) => recordLinkablesVisitor(v, linkables)
  );
}
