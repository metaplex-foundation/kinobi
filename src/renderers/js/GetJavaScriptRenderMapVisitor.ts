import type { ConfigureOptions } from 'nunjucks';
import { format as formatCode, Options as PrettierOptions } from 'prettier';
import { logWarn } from '../../logs';
import * as nodes from '../../nodes';
import { camelCase, pascalCase } from '../../utils';
import {
  Visitor,
  BaseThrowVisitor,
  GetResolvedInstructionAccountsVisitor,
  ResolvedInstructionAccount,
  Dependency,
} from '../../visitors';
import { RenderMap } from '../RenderMap';
import { resolveTemplate } from '../utils';
import {
  GetJavaScriptTypeManifestVisitor,
  JavaScriptTypeManifest,
} from './GetJavaScriptTypeManifestVisitor';
import { JavaScriptImportMap } from './JavaScriptImportMap';

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
  formatCode?: boolean;
  prettierOptions?: PrettierOptions;
  dependencyMap?: Record<Dependency, string>;
  typeManifestVisitor?: Visitor<JavaScriptTypeManifest> & {
    registerDefinedTypes?: (definedTypes: nodes.DefinedTypeNode[]) => void;
  };
};

export class GetJavaScriptRenderMapVisitor extends BaseThrowVisitor<RenderMap> {
  readonly options: Required<GetJavaScriptRenderMapOptions>;

  private program: nodes.ProgramNode | null = null;

  private resolvedInstructionAccountVisitor: Visitor<
    ResolvedInstructionAccount[]
  >;

  constructor(options: GetJavaScriptRenderMapOptions = {}) {
    super();
    this.options = {
      formatCode: options.formatCode ?? true,
      prettierOptions: {
        ...DEFAULT_PRETTIER_OPTIONS,
        ...options.prettierOptions,
      },
      dependencyMap: {
        root: '../..',
        generated: '..',
        core: '@lorisleiva/js-core',
        mplEssentials: '@lorisleiva/mpl-essentials',
        mplDigitalAssets: '@lorisleiva/mpl-digital-assets',
        ...options.dependencyMap,
        // Custom relative dependencies to link generated files together.
        generatedAccounts: '../accounts',
        generatedErrors: '../errors',
        generatedTypes: '../types',
      },
      typeManifestVisitor:
        options.typeManifestVisitor ?? new GetJavaScriptTypeManifestVisitor(),
    };
    this.resolvedInstructionAccountVisitor =
      new GetResolvedInstructionAccountsVisitor();
  }

  visitRoot(root: nodes.RootNode): RenderMap {
    if (this.typeManifestVisitor.registerDefinedTypes) {
      this.typeManifestVisitor.registerDefinedTypes(root.allDefinedTypes);
    }

    const programsToExport = root.programs.filter((p) => !p.metadata.internal);
    const accountsToExport = root.allAccounts.filter(
      (a) => !a.metadata.internal
    );
    const instructionsToExport = root.allInstructions.filter(
      (i) => !i.metadata.internal
    );
    const definedTypesToExport = root.allDefinedTypes.filter(
      (t) => !t.metadata.internal
    );
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
      .mergeWith(...root.programs.map((program) => program.accept(this)));
  }

  visitProgram(program: nodes.ProgramNode): RenderMap {
    this.program = program;
    const { name } = program.metadata;
    const pascalCaseName = pascalCase(name);
    const renderMap = new RenderMap()
      .mergeWith(...program.accounts.map((account) => account.accept(this)))
      .mergeWith(...program.definedTypes.map((type) => type.accept(this)));

    // Internal programs are support programs that
    // were added to fill missing types or accounts.
    // They don't need to render anything else.
    if (program.metadata.internal) {
      this.program = null;
      return renderMap;
    }

    renderMap
      .mergeWith(...program.instructions.map((ix) => ix.accept(this)))
      .add(
        `errors/${name}.ts`,
        this.render('errorsPage.njk', {
          imports: new JavaScriptImportMap()
            .add('core', ['ProgramError', 'Program'])
            .toString(this.options.dependencyMap),
          program,
          errors: program.errors.map((error) => ({
            ...error,
            prefixedName:
              pascalCase(program.metadata.prefix) +
              pascalCase(error.metadata.name),
          })),
        })
      )
      .add(
        `programs/${name}.ts`,
        this.render('programsPage.njk', {
          imports: new JavaScriptImportMap()
            .add('core', ['Program', 'publicKey'])
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
    const typeManifest = account.accept(this.typeManifestVisitor);
    const imports = new JavaScriptImportMap()
      .mergeWith(typeManifest.imports)
      .add('core', [
        'Account',
        'assertAccountExists',
        'Context',
        'deserializeAccount',
        'PublicKey',
        'RpcAccount',
        'Serializer',
      ])
      .remove('generatedTypes', [account.name]);

    const seeds = account.metadata.seeds.map((seed) => {
      if (seed.kind === 'programId') return seed;
      if (seed.kind === 'literal') {
        imports.add('core', 'utf8');
        return seed;
      }
      const seedManifest = seed.type.accept(this.typeManifestVisitor);
      imports.mergeWith(seedManifest.imports);
      return { ...seed, typeManifest: seedManifest };
    });
    if (seeds.length > 0) {
      imports.add('core', ['Pda']);
    }

    return new RenderMap().add(
      `accounts/${account.name}.ts`,
      this.render('accountsPage.njk', {
        account,
        imports: imports.toString(this.options.dependencyMap),
        program: this.program,
        typeManifest,
        name: account.name,
        seeds,
      })
    );
  }

  visitInstruction(instruction: nodes.InstructionNode): RenderMap {
    // Imports.
    const imports = new JavaScriptImportMap().add('core', [
      'AccountMeta',
      'Context',
      'PublicKey',
      'Signer',
      'WrappedInstruction',
      ...(instruction.hasData ? ['Serializer'] : []),
    ]);

    // Accounts.
    const accounts = instruction
      .accept(this.resolvedInstructionAccountVisitor)
      .map((account) => {
        const hasDefaultValue = account.defaultsTo.kind !== 'none';
        return {
          ...account,
          type: this.getInstructionAccountType(account),
          optionalSign: hasDefaultValue || account.isOptional ? '?' : '',
          hasDefaultValue,
        };
      });
    imports.mergeWith(this.getInstructionAccountImports(accounts));
    if (accounts.length > 0) {
      imports
        .add('core', 'checkForIsWritableOverride')
        .addAlias('core', 'checkForIsWritableOverride', 'isWritable');
    }

    // Arguments.
    const typeManifest = instruction.accept(this.typeManifestVisitor);
    imports.mergeWith(typeManifest.imports);

    // Bytes created on chain.
    const bytes = instruction.metadata.bytesCreatedOnChain;
    if (bytes.kind !== 'none' && bytes.includeHeader) {
      imports.add('core', 'ACCOUNT_HEADER_SIZE');
    }
    if (bytes.kind === 'account') {
      const accountName = pascalCase(bytes.name);
      const dependency =
        bytes.dependency === 'generated'
          ? 'generatedAccounts'
          : bytes.dependency;
      imports.add(dependency, `get${accountName}Size`);
    }

    // Remove imports from the same module.
    imports.remove('generatedTypes', [
      `${instruction.name}InstructionAccounts`,
      `${instruction.name}InstructionArgs`,
      `${instruction.name}InstructionData`,
    ]);

    // canMergeAccountsAndArgs
    const accountsAndArgsConflicts =
      this.getMergeConflictsForInstructionAccountsAndArgs(instruction);
    if (accountsAndArgsConflicts.length > 0) {
      logWarn(
        `Accounts and args of instruction [${instruction.name}] have the following ` +
          `conflicting attributes [${accountsAndArgsConflicts.join(', ')}]. ` +
          `Thus, they could not be merged into a single input object. ` +
          'You may want to rename the conflicting attributes.'
      );
    }

    return new RenderMap().add(
      `instructions/${instruction.name}.ts`,
      this.render('instructionsPage.njk', {
        instruction,
        imports: imports.toString(this.options.dependencyMap),
        program: this.program,
        accounts,
        needsEddsa: accounts.some((a) => a.defaultsTo.kind === 'pda'),
        needsIdentity: accounts.some((a) => a.defaultsTo.kind === 'identity'),
        needsPayer: accounts.some((a) => a.defaultsTo.kind === 'payer'),
        typeManifest,
        name: instruction.name,
        camelCaseName: camelCase(instruction.name),
        canMergeAccountsAndArgs: accountsAndArgsConflicts.length === 0,
      })
    );
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): RenderMap {
    const typeManifest = definedType.accept(this.typeManifestVisitor);
    const imports = new JavaScriptImportMap()
      .mergeWith(typeManifest.imports)
      .add('core', ['Context', 'Serializer'])
      .remove('generatedTypes', [definedType.name]);

    return new RenderMap().add(
      `types/${definedType.name}.ts`,
      this.render('definedTypesPage.njk', {
        definedType,
        imports: imports.toString({
          ...this.options.dependencyMap,
          generatedTypes: '.',
        }),
        typeManifest,
        name: definedType.name,
        camelCaseName: camelCase(definedType.name),
      })
    );
  }

  get typeManifestVisitor() {
    return this.options.typeManifestVisitor;
  }

  protected getInstructionAccountType(
    account: ResolvedInstructionAccount
  ): string {
    if (account.isOptionalSigner) return 'PublicKey | Signer';
    return account.isSigner ? 'Signer' : 'PublicKey';
  }

  protected getInstructionAccountImports(
    accounts: ResolvedInstructionAccount[]
  ): JavaScriptImportMap {
    const imports = new JavaScriptImportMap();
    accounts.forEach((account) => {
      if (account.defaultsTo.kind === 'publicKey') {
        imports.add('core', 'publicKey');
      }
      if (account.defaultsTo.kind === 'pda') {
        const pdaAccount = pascalCase(account.defaultsTo.pdaAccount);
        const dependency =
          account.defaultsTo.dependency === 'generated'
            ? 'generatedAccounts'
            : account.defaultsTo.dependency;
        imports.add(dependency, `find${pdaAccount}Pda`);
        Object.values(account.defaultsTo.seeds).forEach((seed) => {
          if (seed.kind === 'account') {
            imports.add('core', 'publicKey');
          }
        });
      }
      if (account.resolvedIsOptionalSigner) {
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
      ...instruction.args.fields.map((field) => field.name),
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
