import type { ConfigureOptions } from 'nunjucks';
import { format as formatCode, Options as PrettierOptions } from 'prettier';
import * as nodes from '../../nodes';
import {
  camelCase,
  getGpaFieldsFromAccount,
  ImportFrom,
  InstructionDefault,
  pascalCase,
} from '../../shared';
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
  GetJavaScriptTypeManifestVisitor,
  JavaScriptTypeManifest,
} from './GetJavaScriptTypeManifestVisitor';
import { JavaScriptImportMap } from './JavaScriptImportMap';
import { renderJavaScriptValueNode } from './RenderJavaScriptValueNode';

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
  typeManifestVisitor?: Visitor<JavaScriptTypeManifest>;
  byteSizeVisitor?: Visitor<number | null> & {
    registerDefinedTypes?: (definedTypes: nodes.DefinedTypeNode[]) => void;
  };
  resolvedInstructionInputVisitor?: Visitor<ResolvedInstructionInput[]>;
};

export class GetJavaScriptRenderMapVisitor extends BaseThrowVisitor<RenderMap> {
  readonly options: Required<GetJavaScriptRenderMapOptions>;

  private program: nodes.ProgramNode | null = null;

  constructor(options: GetJavaScriptRenderMapOptions = {}) {
    super();
    this.options = {
      renderParentInstructions: options.renderParentInstructions ?? false,
      formatCode: options.formatCode ?? true,
      prettierOptions: {
        ...DEFAULT_PRETTIER_OPTIONS,
        ...options.prettierOptions,
      },
      dependencyMap: {
        generated: '..',
        hooked: '../../hooked',
        core: '@metaplex-foundation/umi',
        mplEssentials: '@metaplex-foundation/mpl-essentials',
        ...options.dependencyMap,
        // Custom relative dependencies to link generated files together.
        generatedAccounts: '../accounts',
        generatedErrors: '../errors',
        generatedTypes: '../types',
      },
      typeManifestVisitor:
        options.typeManifestVisitor ?? new GetJavaScriptTypeManifestVisitor(),
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
    const { name } = program;
    const pascalCaseName = pascalCase(name);
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
        `errors/${camelCase(name)}.ts`,
        this.render('errorsPage.njk', {
          imports: new JavaScriptImportMap()
            .add('core', ['ProgramError', 'Program'])
            .toString(this.options.dependencyMap),
          program,
          errors: program.errors.map((error) => ({
            ...error,
            prefixedName: pascalCase(program.prefix) + pascalCase(error.name),
          })),
        })
      )
      .add(
        `programs/${camelCase(name)}.ts`,
        this.render('programsPage.njk', {
          imports: new JavaScriptImportMap()
            .add('core', [
              'ClusterFilter',
              'Context',
              'Program',
              'publicKey',
              'PublicKey',
            ])
            .add('errors', [
              `get${pascalCaseName}ErrorFromCode`,
              `get${pascalCaseName}ErrorFromName`,
            ])
            .toString(this.options.dependencyMap),
          program,
        })
      );
    this.program = null;
    return renderMap;
  }

  visitAccount(account: nodes.AccountNode): RenderMap {
    const isLinked = !!account.data.link;
    const typeManifest = visit(account, this.typeManifestVisitor);
    const imports = new JavaScriptImportMap().mergeWith(
      typeManifest.strictImports,
      typeManifest.serializerImports
    );
    if (!isLinked) {
      imports.mergeWith(typeManifest.looseImports);
    }
    imports.add('core', [
      'Account',
      'assertAccountExists',
      'Context',
      'deserializeAccount',
      'PublicKey',
      'RpcAccount',
      'RpcGetAccountOptions',
      'RpcGetAccountsOptions',
      ...(!isLinked ? ['Serializer'] : []),
    ]);

    // Discriminator.
    const { discriminator } = account;
    let resolvedDiscriminator:
      | { kind: 'size'; value: string }
      | { kind: 'field'; name: string; value: string }
      | null = null;
    if (discriminator?.kind === 'field') {
      const discriminatorField = account.data.struct.fields.find(
        (f) => f.name === discriminator.name
      );
      const discriminatorValue = discriminatorField?.defaultsTo?.value
        ? renderJavaScriptValueNode(discriminatorField.defaultsTo.value)
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
        account.size !== undefined
          ? { kind: 'size', value: `${account.size}` }
          : null;
    }

    // GPA Fields.
    const gpaFields = getGpaFieldsFromAccount(
      account,
      this.byteSizeVisitor
    ).map((gpaField) => {
      const gpaFieldManifest = visit(gpaField.type, this.typeManifestVisitor);
      imports.mergeWith(
        gpaFieldManifest.looseImports,
        gpaFieldManifest.serializerImports
      );
      return { ...gpaField, manifest: gpaFieldManifest };
    });
    let resolvedGpaFields: { type: string; argument: string } | null = null;
    if (gpaFields.length > 0) {
      imports.add('core', ['gpaBuilder']);
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
    const pdaHelperNeedsSerializer =
      account.seeds.filter((seed) => seed.kind !== 'programId').length > 0;
    const seeds = account.seeds.map((seed) => {
      if (seed.kind === 'constant') {
        const seedManifest = visit(seed.type, this.typeManifestVisitor);
        imports.mergeWith(seedManifest.serializerImports);
        const seedValue = seed.value;
        const valueManifest = renderJavaScriptValueNode(seedValue);
        (seedValue as any).render = valueManifest.render;
        imports.mergeWith(valueManifest.imports);
        return { ...seed, typeManifest: seedManifest };
      }
      if (seed.kind === 'variable') {
        const seedManifest = visit(seed.type, this.typeManifestVisitor);
        imports.mergeWith(
          seedManifest.looseImports,
          seedManifest.serializerImports
        );
        return { ...seed, typeManifest: seedManifest };
      }
      return seed;
    });
    if (seeds.length > 0) {
      imports.add('core', ['Pda']);
    }
    const hasVariableSeeds =
      account.seeds.filter((seed) => seed.kind === 'variable').length > 0;

    return new RenderMap().add(
      `accounts/${camelCase(account.name)}.ts`,
      this.render('accountsPage.njk', {
        account,
        imports: imports.toString(this.options.dependencyMap),
        program: this.program,
        typeManifest,
        discriminator: resolvedDiscriminator,
        gpaFields: resolvedGpaFields,
        seeds,
        pdaHelperNeedsSerializer,
        hasVariableSeeds,
      })
    );
  }

  visitInstruction(instruction: nodes.InstructionNode): RenderMap {
    // Imports.
    const imports = new JavaScriptImportMap().add('core', [
      'AccountMeta',
      'Context',
      'Signer',
      'TransactionBuilder',
      'transactionBuilder',
    ]);

    // Instruction helpers.
    const hasAccounts = instruction.accounts.length > 0;
    const hasData =
      !!instruction.dataArgs.link ||
      instruction.dataArgs.struct.fields.length > 0;
    const hasDataArgs =
      !!instruction.dataArgs.link ||
      instruction.dataArgs.struct.fields.filter(
        (field) => field.defaultsTo?.strategy !== 'omitted'
      ).length > 0;
    const hasExtraArgs =
      !!instruction.extraArgs.link ||
      instruction.extraArgs.struct.fields.filter(
        (field) => field.defaultsTo?.strategy !== 'omitted'
      ).length > 0;
    const hasAnyArgs = hasDataArgs || hasExtraArgs;
    const hasArgDefaults = Object.keys(instruction.argDefaults).length > 0;
    const hasArgResolvers = Object.values(instruction.argDefaults).some(
      ({ kind }) => kind === 'resolver'
    );
    const hasAccountResolvers = instruction.accounts.some(
      ({ defaultsTo }) => defaultsTo?.kind === 'resolver'
    );
    const hasByteResolver =
      instruction.bytesCreatedOnChain?.kind === 'resolver';
    const hasResolvers =
      hasArgResolvers || hasAccountResolvers || hasByteResolver;

    // Resolved inputs.
    const resolvedInputs = visit(
      instruction,
      this.resolvedInstructionInputVisitor
    ).map((input: ResolvedInstructionInput) => {
      if (input.defaultsTo?.kind === 'pda') {
        const { seeds } = input.defaultsTo;
        Object.keys(seeds).forEach((seed: string) => {
          const seedValue = seeds[seed];
          if (seedValue.kind !== 'value') return;
          const valueManifest = renderJavaScriptValueNode(seedValue.value);
          (seedValue as any).render = valueManifest.render;
          imports.mergeWith(valueManifest.imports);
        });
      } else if (input.defaultsTo?.kind === 'value') {
        const { defaultsTo } = input;
        const valueManifest = renderJavaScriptValueNode(defaultsTo.value);
        (defaultsTo as any).render = valueManifest.render;
        imports.mergeWith(valueManifest.imports);
      }
      return input;
    });
    const resolvedInputsWithDefaults = resolvedInputs.filter(
      (input) => input.kind !== 'account' || input.defaultsTo !== undefined
    );
    if (resolvedInputsWithDefaults.length > 0) {
      imports.add('shared', 'addObjectProperty');
    }
    const accountsWithDefaults = resolvedInputsWithDefaults
      .filter((input) => input.kind === 'account')
      .map((input) => input.name);
    const argsWithDefaults = resolvedInputsWithDefaults
      .filter((input) => input.kind === 'arg')
      .map((input) => input.name);

    // Accounts.
    const accounts = instruction.accounts.map((account) => {
      const hasDefaultValue = !!account.defaultsTo;
      const resolvedAccount = resolvedInputs.find(
        (input) => input.kind === 'account' && input.name === account.name
      ) as ResolvedInstructionAccount;
      return {
        ...resolvedAccount,
        type: this.getInstructionAccountType(resolvedAccount),
        optionalSign: hasDefaultValue || account.isOptional ? '?' : '',
        hasDefaultValue,
      };
    });
    imports.mergeWith(this.getInstructionAccountImports(accounts));
    if (accounts.length > 0) {
      imports.add('shared', 'isWritable');
    }

    // Data Args.
    const linkedDataArgs = !!instruction.dataArgs.link;
    const dataArgManifest = visit(
      instruction.dataArgs,
      this.typeManifestVisitor
    );
    imports.mergeWith(
      dataArgManifest.looseImports,
      dataArgManifest.serializerImports
    );
    if (!linkedDataArgs) {
      imports.mergeWith(dataArgManifest.strictImports);
    }
    if (!linkedDataArgs && hasData) {
      imports.add('core', ['Serializer']);
    }

    // Extra args.
    const linkedExtraArgs = !!instruction.extraArgs.link;
    const extraArgManifest = visit(
      instruction.extraArgs,
      this.typeManifestVisitor
    );
    imports.mergeWith(extraArgManifest.looseImports);

    // Arg defaults.
    Object.values(instruction.argDefaults).forEach((argDefault) => {
      if (argDefault.kind === 'resolver') {
        imports.add(argDefault.importFrom, camelCase(argDefault.name));
      }
    });
    if (argsWithDefaults.length > 0) {
      imports.add('shared', ['PickPartial']);
    }

    // Bytes created on chain.
    const bytes = instruction.bytesCreatedOnChain;
    if (bytes && 'includeHeader' in bytes && bytes.includeHeader) {
      imports.add('core', 'ACCOUNT_HEADER_SIZE');
    }
    if (bytes?.kind === 'account') {
      const accountName = pascalCase(bytes.name);
      const importFrom =
        bytes.importFrom === 'generated'
          ? 'generatedAccounts'
          : bytes.importFrom;
      imports.add(importFrom, `get${accountName}Size`);
    } else if (bytes?.kind === 'resolver') {
      imports.add(bytes.importFrom, camelCase(bytes.name));
    }

    // canMergeAccountsAndArgs
    let canMergeAccountsAndArgs = false;
    if (!linkedDataArgs && !linkedExtraArgs) {
      const accountsAndArgsConflicts =
        this.getMergeConflictsForInstructionAccountsAndArgs(instruction);
      if (accountsAndArgsConflicts.length > 0) {
        logWarn(
          `Accounts and args of instruction [${instruction.name}] have the following ` +
            `conflicting attributes [${accountsAndArgsConflicts.join(
              ', '
            )}]. ` +
            `Thus, they could not be merged into a single input object. ` +
            'You may want to rename the conflicting attributes.'
        );
      }
      canMergeAccountsAndArgs = accountsAndArgsConflicts.length === 0;
    }

    const hasDefaultKinds = (kinds: Array<InstructionDefault['kind']>) =>
      resolvedInputs.some(
        (input) => input.defaultsTo && kinds.includes(input.defaultsTo.kind)
      );

    return new RenderMap().add(
      `instructions/${camelCase(instruction.name)}.ts`,
      this.render('instructionsPage.njk', {
        instruction,
        imports: imports.toString(this.options.dependencyMap),
        program: this.program,
        resolvedInputs,
        resolvedInputsWithDefaults,
        accountsWithDefaults,
        argsWithDefaults,
        accounts,
        needsEddsa: hasDefaultKinds(['pda']) || hasResolvers,
        needsIdentity: hasDefaultKinds(['identity']) || hasResolvers,
        needsPayer: hasDefaultKinds(['payer']) || hasResolvers,
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
        hasResolvers,
      })
    );
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): RenderMap {
    const pascalCaseName = pascalCase(definedType.name);
    const typeManifest = visit(definedType, this.typeManifestVisitor);
    const imports = new JavaScriptImportMap()
      .mergeWithManifest(typeManifest)
      .add('core', ['Context', 'Serializer'])
      .remove('generatedTypes', [
        pascalCaseName,
        `${pascalCaseName}Args`,
        `get${pascalCaseName}Serializer`,
      ]);

    return new RenderMap().add(
      `types/${camelCase(definedType.name)}.ts`,
      this.render('definedTypesPage.njk', {
        definedType,
        imports: imports.toString({
          ...this.options.dependencyMap,
          generatedTypes: '.',
        }),
        typeManifest,
        isDataEnum:
          nodes.isEnumTypeNode(definedType.data) &&
          nodes.isDataEnum(definedType.data),
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
    if (account.isSigner === 'either') return 'PublicKey | Signer';
    return account.isSigner ? 'Signer' : 'PublicKey';
  }

  protected getInstructionAccountImports(
    accounts: ResolvedInstructionAccount[]
  ): JavaScriptImportMap {
    const imports = new JavaScriptImportMap();
    accounts.forEach((account) => {
      if (account.isPda && account.isSigner === false) {
        imports.add('core', 'Pda');
      }
      if (account.defaultsTo?.kind === 'publicKey') {
        imports.add('core', 'publicKey');
      } else if (account.defaultsTo?.kind === 'pda') {
        const pdaAccount = pascalCase(account.defaultsTo.pdaAccount);
        const importFrom =
          account.defaultsTo.importFrom === 'generated'
            ? 'generatedAccounts'
            : account.defaultsTo.importFrom;
        imports.add(importFrom, `find${pdaAccount}Pda`);
        Object.values(account.defaultsTo.seeds).forEach((seed) => {
          if (seed.kind === 'account') {
            imports.add('core', 'publicKey');
          }
        });
      } else if (account.defaultsTo?.kind === 'resolver') {
        imports.add(
          account.defaultsTo.importFrom,
          camelCase(account.defaultsTo.name)
        );
      }
      if (account.resolvedIsSigner === 'either') {
        imports.add('core', ['PublicKey', 'publicKey', 'Signer', 'isSigner']);
      } else if (account.resolvedIsSigner) {
        imports.add('core', 'Signer');
      } else {
        imports.add('core', 'PublicKey');
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
    return this.options.formatCode
      ? formatCode(code, this.options.prettierOptions)
      : code;
  }
}
