import { format as formatCodeUsingPrettier } from '@prettier/sync';
import { ConfigureOptions } from 'nunjucks';
import { Options as PrettierOptions } from 'prettier';
import {
  FieldDiscriminatorNode,
  getAllAccounts,
  getAllDefinedTypes,
  getAllInstructionArguments,
  getAllInstructionsWithSubs,
  getAllPdas,
  getAllPrograms,
  InstructionNode,
  isDataEnum,
  isNode,
  isNodeFilter,
  PdaLinkNode,
  PdaNode,
  PdaSeedNode,
  ProgramNode,
  resolveNestedTypeNode,
  SizeDiscriminatorNode,
  structTypeNodeFromInstructionArgumentNodes,
  VALUE_NODES,
} from '../../nodes';
import {
  camelCase,
  getGpaFieldsFromAccount,
  ImportFrom,
  LinkableDictionary,
  logWarn,
  mainCase,
  MainCaseString,
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
import {
  CustomDataOptions,
  getDefinedTypeNodesToExtract,
  parseCustomDataOptions,
} from './customDataHelpers';
import { getTypeManifestVisitor as baseGetTypeManifestVisitor } from './getTypeManifestVisitor';
import { JavaScriptContextMap } from './JavaScriptContextMap';
import { JavaScriptImportMap } from './JavaScriptImportMap';
import { renderInstructionDefaults } from './renderInstructionDefaults';

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
  internalNodes?: string[];
  customAccountData?: CustomDataOptions[];
  customInstructionData?: CustomDataOptions[];
};

export function getRenderMapVisitor(
  options: GetJavaScriptRenderMapOptions = {}
): Visitor<RenderMap> {
  const linkables = new LinkableDictionary();
  const sharedSerializers = new Set<string>();
  // Names of every account across all programs, populated by `visitRoot`
  // before any program is rendered. `visitProgram` reads it to keep a
  // standalone PDA from overwriting an account module that shares its output
  // path (`accounts/<name>.ts`), even when they live in different programs.
  let allAccountNames = new Set<string>();
  // Names of every account-linked PDA across all programs, populated by
  // `visitRoot`. A linked PDA's finder is emitted inline in its account page,
  // so `visitProgram` skips rendering a standalone file for the same name.
  let allLinkedPdaNames = new Set<string>();
  // Names of standalone (account-less) PDAs already rendered to
  // `accounts/<name>.ts` this run, so a same-named PDA in a later program
  // cannot silently overwrite the first one.
  const renderedOrphanPdaNames = new Set<string>();
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
  const internalNodes = (options.internalNodes ?? []).map(mainCase);
  const customAccountData = parseCustomDataOptions(
    options.customAccountData ?? [],
    'AccountData'
  );
  const customInstructionData = parseCustomDataOptions(
    options.customInstructionData ?? [],
    'InstructionData'
  );

  const getTypeManifestVisitor = (parentName?: {
    strict: string;
    loose: string;
  }) =>
    baseGetTypeManifestVisitor({
      linkables,
      nonScalarEnums,
      customAccountData,
      customInstructionData,
      parentName,
      sharedSerializers,
    });
  const typeManifestVisitor = getTypeManifestVisitor();
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
      ...instruction.arguments.map((field) => field.name),
      ...(instruction.extraArguments ?? []).map((field) => field.name),
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

  // Shared by `visitAccount` (a pda linked to an account, rendered inline
  // in that account's own file) and `renderStandalonePda` below (a pda with
  // no owning account, e.g. Token-2022's `associatedToken` pda) so both
  // code paths derive identical seed manifests.
  function getPdaSeedsManifest(
    pdaSeeds: PdaSeedNode[],
    imports: JavaScriptImportMap
  ) {
    const seeds = pdaSeeds.map((seed) => {
      if (isNode(seed, 'variablePdaSeedNode')) {
        const seedManifest = visit(seed.type, typeManifestVisitor);
        imports.mergeWith(
          seedManifest.looseImports,
          seedManifest.serializerImports
        );
        return { ...seed, typeManifest: seedManifest };
      }
      if (isNode(seed.value, 'programIdValueNode')) {
        imports
          .add('umiSerializers', 'publicKey')
          .addAlias('umiSerializers', 'publicKey', 'publicKeySerializer');
        return seed;
      }
      const seedManifest = visit(seed.type, typeManifestVisitor);
      imports.mergeWith(seedManifest.serializerImports);
      const seedValue = seed.value;
      const valueManifest = visit(seedValue, typeManifestVisitor);
      (seedValue as any).render = valueManifest.value;
      imports.mergeWith(valueManifest.valueImports);
      return { ...seed, typeManifest: seedManifest };
    });
    if (seeds.length > 0) {
      imports.add('umi', ['Pda']);
    }
    const hasVariableSeeds =
      pdaSeeds.filter(isNodeFilter('variablePdaSeedNode')).length > 0;
    return { seeds, hasVariableSeeds };
  }

  // Renders a `find<Name>Pda` helper for a pda that is not linked to any
  // account of its own (e.g. Token-2022's `associatedToken` pda, whose
  // account is a `Token` account owned by a different program). It is
  // emitted under `accounts/`, matching the `generatedAccounts` default
  // `pdaImportFrom` used when resolving `pdaValueNode` default values.
  function renderStandalonePda(pda: PdaNode): RenderMap {
    if (!program) {
      throw new Error('Pda must be visited inside a program.');
    }
    const imports = new JavaScriptImportMap().add('umi', ['Context', 'Pda']);
    const { seeds, hasVariableSeeds } = getPdaSeedsManifest(pda.seeds, imports);
    return new RenderMap().add(
      `accounts/${camelCase(pda.name)}.ts`,
      render('pdaPage.njk', {
        pda,
        imports: imports.toString(dependencyMap),
        program,
        seeds,
        hasVariableSeeds,
      })
    );
  }

  return pipe(
    staticVisitor(() => new RenderMap()),
    (v) =>
      extendVisitor(v, {
        visitRoot(node, { self }) {
          const isNotInternal = (n: { name: MainCaseString }) =>
            !internalNodes.includes(n.name);
          const programsToExport = getAllPrograms(node).filter(isNotInternal);
          const accountsToExport = getAllAccounts(node).filter(isNotInternal);
          // Names of every PDA linked to an account across all programs. A
          // linked PDA's finder is rendered inline in its account page, so a
          // standalone PDA of the same name is redundant and excluded from the
          // index here — `visitProgram` reads this set to also skip rendering
          // its file, keeping the two sides consistent.
          allLinkedPdaNames = new Set<string>(
            getAllAccounts(node)
              .map((a) => a.pda)
              .filter((pdaLink): pdaLink is PdaLinkNode => !!pdaLink)
              .map((pdaLink) => pdaLink.name)
          );
          // A standalone PDA renders to `accounts/<name>.ts`; exclude any
          // whose name collides with an account in ANY program so the account
          // module (which also owns that path) is never overwritten. This
          // root-wide set is also read by `visitProgram` below.
          allAccountNames = new Set<string>(
            getAllAccounts(node).map((a) => a.name)
          );
          const exportedOrphanPdaNames = new Set<string>();
          const orphanPdasToExport = getAllPdas(node)
            .filter((p) => !allLinkedPdaNames.has(p.name))
            .filter((p) => !allAccountNames.has(p.name))
            .filter((p) => {
              // Two standalone PDAs (in different programs) sharing a name
              // would emit duplicate `export * from './<name>'` lines; keep the
              // first, matching the single file that survives rendering.
              if (exportedOrphanPdaNames.has(p.name)) return false;
              exportedOrphanPdaNames.add(p.name);
              return true;
            })
            .filter(isNotInternal);
          const instructionsToExport = getAllInstructionsWithSubs(node, {
            leavesOnly: !renderParentInstructions,
          }).filter(isNotInternal);
          const definedTypesToExport =
            getAllDefinedTypes(node).filter(isNotInternal);
          const hasAnythingToExport =
            programsToExport.length > 0 ||
            accountsToExport.length > 0 ||
            orphanPdasToExport.length > 0 ||
            instructionsToExport.length > 0 ||
            definedTypesToExport.length > 0;

          // Programs must be rendered before `ctx` is built: rendering them is
          // what populates `sharedSerializers`, which `ctx` then feeds to
          // `sharedPage.njk` so `shared/index.ts` includes exactly the helpers
          // the generated code uses. Moving this below `ctx` would emit the
          // shared module without those helpers.
          const programRenderMaps = getAllPrograms(node).map((p) =>
            visit(p, self)
          );

          const ctx = {
            root: node,
            programsToExport,
            accountsToExport,
            orphanPdasToExport,
            instructionsToExport,
            definedTypesToExport,
            hasAnythingToExport,
            sharedSerializers: [...sharedSerializers].sort(),
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
          if (accountsToExport.length > 0 || orphanPdasToExport.length > 0) {
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
            .mergeWith(...programRenderMaps);
        },

        visitProgram(node, { self }) {
          program = node;
          const pascalCaseName = pascalCase(node.name);
          const customDataDefinedType = [
            ...getDefinedTypeNodesToExtract(node.accounts, customAccountData),
            ...getDefinedTypeNodesToExtract(
              node.instructions,
              customInstructionData
            ),
          ];
          // PDAs that aren't linked to any account in this program still
          // need a `find<Name>Pda` helper so instructions referencing them
          // as a default account value can resolve it.
          //
          // Note: this `linkedPdaNames` is scoped to `node.accounts` (this
          // program only), which decides what gets *rendered* here. It is
          // intentionally narrower than `visitRoot`'s `linkedPdaNames`,
          // which is derived from `getAllAccounts(node)` (every program) and
          // decides what gets *re-exported* from `accounts/index.ts`. The
          // two only diverge when a PDA name collides across programs
          // (already requires a config-level rename to resolve), so this
          // asymmetry is intentional and unexercised by single-program or
          // disjoint-name IDLs.
          const linkedPdaNames = new Set(
            node.accounts
              .map((a) => a.pda)
              .filter((pdaLink): pdaLink is PdaLinkNode => !!pdaLink)
              .map((pdaLink) => pdaLink.name)
          );
          // A standalone PDA renders to `accounts/<name>.ts`. Skip (with a
          // warning, never silently) any whose name is already owned by an
          // account — in this program or any other, via the root-wide
          // `allAccountNames` populated by `visitRoot` — or by a standalone PDA
          // from an earlier program, so the existing module is never
          // overwritten. The union with `node.accounts` also covers a
          // standalone `visitProgram` call, where `allAccountNames` is empty.
          const accountNames = new Set<string>([
            ...node.accounts.map((a) => a.name),
            ...allAccountNames,
          ]);
          const orphanPdas = node.pdas.filter((p) => {
            if (linkedPdaNames.has(p.name)) return false;
            // Linked to an account in another program: its finder is rendered
            // inline there and `visitRoot` already excludes this name from the
            // accounts index, so rendering a standalone file would be dead,
            // un-exported output. Skip it (with a warning, not silently).
            if (allLinkedPdaNames.has(p.name)) {
              logWarn(
                `Skipping the "${p.name}" PDA finder in program ` +
                  `"${node.name}": a PDA of that name is linked to an account ` +
                  `in another program and is excluded from the accounts index. ` +
                  `Rename it to expose a standalone finder.`
              );
              return false;
            }
            if (accountNames.has(p.name)) {
              logWarn(
                `Skipping the "${p.name}" PDA finder in program ` +
                  `"${node.name}": an account of the same name already owns ` +
                  `accounts/${camelCase(p.name)}.ts. Rename the PDA or link ` +
                  `it to that account.`
              );
              return false;
            }
            if (renderedOrphanPdaNames.has(p.name)) {
              logWarn(
                `Skipping the "${p.name}" PDA finder in program ` +
                  `"${node.name}": another program already renders a PDA of ` +
                  `that name to accounts/${camelCase(p.name)}.ts. Rename one ` +
                  `of them.`
              );
              return false;
            }
            renderedOrphanPdaNames.add(p.name);
            return true;
          });
          const renderMap = new RenderMap()
            .mergeWith(...node.accounts.map((a) => visit(a, self)))
            .mergeWith(...orphanPdas.map((p) => renderStandalonePda(p)))
            .mergeWith(...node.definedTypes.map((t) => visit(t, self)))
            .mergeWith(...customDataDefinedType.map((t) => visit(t, self)))
            .mergeWith(
              ...getAllInstructionsWithSubs(node, {
                leavesOnly: !renderParentInstructions,
              }).map((ix) => visit(ix, self))
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
          const customData = customAccountData.get(node.name);
          const isLinked = !!customData;
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
          const discriminator =
            (node.discriminators ?? []).find(
              (d) => !isNode(d, 'constantDiscriminatorNode')
            ) ?? null;
          let resolvedDiscriminator:
            | SizeDiscriminatorNode
            | (FieldDiscriminatorNode & { value: string })
            | null = null;
          if (isNode(discriminator, 'fieldDiscriminatorNode')) {
            const discriminatorField = resolveNestedTypeNode(
              node.data
            ).fields.find((f) => f.name === discriminator.name);
            const discriminatorValue = discriminatorField?.defaultValue
              ? visit(discriminatorField.defaultValue, typeManifestVisitor)
              : undefined;
            if (discriminatorValue) {
              imports.mergeWith(discriminatorValue.valueImports);
              resolvedDiscriminator = {
                ...discriminator,
                value: discriminatorValue.value,
              };
            }
          } else if (isNode(discriminator, 'sizeDiscriminatorNode')) {
            resolvedDiscriminator = discriminator;
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
          const { seeds, hasVariableSeeds } = getPdaSeedsManifest(
            pdaSeeds,
            imports
          );

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
              customData,
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
          const customData = customInstructionData.get(node.name);
          const linkedDataArgs = !!customData;
          const hasAccounts = node.accounts.length > 0;
          const hasData = linkedDataArgs || node.arguments.length > 0;
          const hasDataArgs =
            linkedDataArgs ||
            node.arguments.filter(
              (field) => field.defaultValueStrategy !== 'omitted'
            ).length > 0;
          const hasExtraArgs =
            (node.extraArguments ?? []).filter(
              (field) => field.defaultValueStrategy !== 'omitted'
            ).length > 0;
          const hasAnyArgs = hasDataArgs || hasExtraArgs;
          const allArgumentsWithDefaultValue = [
            ...node.arguments.filter(
              (a) => a.defaultValue && !isNode(a.defaultValue, VALUE_NODES)
            ),
            ...(node.extraArguments ?? []).filter((a) => a.defaultValue),
          ];
          const hasArgDefaults = allArgumentsWithDefaultValue.length > 0;
          const hasArgResolvers = allArgumentsWithDefaultValue.some((a) =>
            isNode(a.defaultValue, 'resolverValueNode')
          );
          const hasAccountResolvers = node.accounts.some((a) =>
            isNode(a.defaultValue, 'resolverValueNode')
          );
          const byteDelta = node.byteDeltas?.[0] ?? undefined;
          const hasByteResolver =
            byteDelta && isNode(byteDelta.value, 'resolverValueNode');
          let remainingAccounts = node.remainingAccounts?.[0] ?? undefined;
          if (
            remainingAccounts &&
            isNode(remainingAccounts.value, 'argumentValueNode') &&
            getAllInstructionArguments(node).every(
              (arg) => arg.name !== remainingAccounts?.value.name
            )
          ) {
            remainingAccounts = undefined;
          }
          const hasRemainingAccountsResolver =
            remainingAccounts &&
            isNode(remainingAccounts.value, 'resolverValueNode');
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
          let canMergeAccountsAndArgs = false;
          if (!linkedDataArgs) {
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
              typeManifestVisitor,
              node.optionalAccountStrategy,
              argObject
            );
            imports.mergeWith(renderedInput.imports);
            interfaces.mergeWith(renderedInput.interfaces);
            return { ...input, render: renderedInput.render };
          });
          const resolvedInputsWithDefaults = resolvedInputs.filter(
            (input) => input.defaultValue !== undefined && input.render !== ''
          );
          const argsWithDefaults = resolvedInputsWithDefaults
            .filter(isNodeFilter('instructionArgumentNode'))
            .map((input) => input.name);

          // Accounts.
          const accounts = node.accounts.map((account) => {
            const hasDefaultValue = !!account.defaultValue;
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
          const dataArgManifest = visit(node, typeManifestVisitor);
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
          const extraArgStruct = structTypeNodeFromInstructionArgumentNodes(
            node.extraArguments ?? []
          );
          const visitor = getTypeManifestVisitor({
            strict: `${node.name}InstructionExtra`,
            loose: `${node.name}InstructionExtraArgs`,
          });
          const extraArgManifest = visit(extraArgStruct, visitor);
          imports.mergeWith(extraArgManifest.looseImports);

          // Arg defaults.
          allArgumentsWithDefaultValue.forEach((argument) => {
            if (isNode(argument.defaultValue, 'resolverValueNode')) {
              imports.add(
                argument.defaultValue.importFrom ?? 'hooked',
                camelCase(argument.defaultValue.name)
              );
            }
          });
          if (argsWithDefaults.length > 0) {
            imports.add('shared', ['PickPartial']);
          }

          // Bytes created on chain.
          if (byteDelta && byteDelta.withHeader) {
            imports.add('umi', 'ACCOUNT_HEADER_SIZE');
          }
          if (byteDelta && isNode(byteDelta.value, 'accountLinkNode')) {
            const accountName = pascalCase(byteDelta.value.name);
            const importFrom =
              byteDelta.value.importFrom ?? 'generatedAccounts';
            imports.add(importFrom, `get${accountName}Size`);
          } else if (
            byteDelta &&
            isNode(byteDelta.value, 'resolverValueNode')
          ) {
            imports.add(
              byteDelta.value.importFrom ?? 'hooked',
              camelCase(byteDelta.value.name)
            );
          }

          // Remaining accounts.
          if (
            remainingAccounts &&
            isNode(remainingAccounts.value, 'resolverValueNode')
          ) {
            imports.add(
              remainingAccounts.value.importFrom ?? 'hooked',
              camelCase(remainingAccounts.value.name)
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
              customData,
              remainingAccounts,
              byteDelta,
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
