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
  formatCode?: boolean;
  prettierOptions?: PrettierOptions;
  dependencyMap?: Record<Dependency, string>;
  typeManifestVisitor?: Visitor<JavaScriptTypeManifest> & {
    setImportStrategy: (
      importStrategy: 'all' | 'looseOnly' | 'strictOnly'
    ) => void;
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
    };
    this.resolvedInstructionAccountVisitor =
      new GetResolvedInstructionAccountsVisitor();
  }

  visitRoot(root: nodes.RootNode): RenderMap {
    const programsToExport = root.programs.filter((p) => !p.metadata.internal);
    const accountsToExport = root.allAccounts.filter(
      (a) => !a.metadata.internal
    );
    const instructionsToExport = root.allInstructionsWithSubs.filter(
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
      .mergeWith(...program.instructionsWithSubs.map((ix) => ix.accept(this)))
      .add(
        `errors/${camelCase(name)}.ts`,
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
        `programs/${camelCase(name)}.ts`,
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
        'RpcGetAccountOptions',
        'RpcGetAccountsOptions',
      ])
      .remove('generatedTypes', [account.name]);

    // Discriminator.
    const { discriminator } = account.metadata;
    let resolvedDiscriminator:
      | { kind: 'size'; value: string }
      | { kind: 'field'; name: string; value: string }
      | null = null;
    if (discriminator?.kind === 'field' && discriminator.value !== null) {
      const rendered = renderJavaScriptValueNode(discriminator.value);
      imports.mergeWith(rendered.imports);
      resolvedDiscriminator = {
        kind: 'field',
        name: discriminator.name,
        value: rendered.render,
      };
    } else if (
      discriminator?.kind === 'field' &&
      !nodes.isTypeDefinedLinkNode(account.type)
    ) {
      const discriminatorField =
        account.type.fields.find((f) => f.name === discriminator.name) ?? null;
      const discriminatorValue = discriminatorField?.metadata.defaultsTo?.value
        ? renderJavaScriptValueNode(
            discriminatorField.metadata.defaultsTo.value
          )
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
        account.metadata.size !== null
          ? { kind: 'size', value: `${account.metadata.size}` }
          : null;
    }

    // GPA Fields.
    const gpaFields = account.metadata.gpaFields.map((gpaField) => {
      const gpaFieldManifest = gpaField.type.accept(this.typeManifestVisitor);
      imports.mergeWith(gpaFieldManifest.imports);
      return { ...gpaField, manifest: gpaFieldManifest };
    });
    let resolvedGpaFields: { type: string; argument: string } | null = null;
    if (gpaFields.length > 0) {
      resolvedGpaFields = {
        type: `{ ${gpaFields.map((f) => f.manifest.looseType).join('')} }`,
        argument: `{ ${gpaFields
          .map((f) => {
            const offset = f.offset === null ? 'null' : `${f.offset}`;
            return `${f.name}: [${offset}, ${f.manifest.serializer}]`;
          })
          .join(', ')} }`,
      };
    }

    // Seeds.
    const pdaHelperNeedsSerializer =
      account.metadata.seeds.filter((seed) => seed.kind !== 'programId')
        .length > 0;
    const seeds = account.metadata.seeds.map((seed) => {
      if (seed.kind !== 'variable') return seed;
      this.typeManifestVisitor.setImportStrategy('looseOnly');
      const seedManifest = seed.type.accept(this.typeManifestVisitor);
      this.typeManifestVisitor.setImportStrategy('all');
      imports.mergeWith(seedManifest.imports);
      return { ...seed, typeManifest: seedManifest };
    });
    if (seeds.length > 0) {
      imports.add('core', ['Pda']);
    }

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
    ]);

    // Accounts.
    const accounts = instruction
      .accept(this.resolvedInstructionAccountVisitor)
      .map((account) => {
        const hasDefaultValue = account.defaultsTo.kind !== 'none';
        if (account.defaultsTo.kind === 'pda') {
          const { seeds } = account.defaultsTo;
          Object.keys(seeds).forEach((seed: string) => {
            const seedValue = seeds[seed];
            if (seedValue.kind !== 'value') return;
            const seedManifest = renderJavaScriptValueNode(seedValue.value);
            (seedValue as any).render = seedManifest.render;
            imports.mergeWith(seedManifest.imports);
          });
        }
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
    if (!nodes.isTypeDefinedLinkNode(instruction.args) && instruction.hasData) {
      imports.add('core', ['Serializer']);
    }

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
      `${instruction.name}InstructionData`,
      `${instruction.name}InstructionDataArgs`,
    ]);

    // canMergeAccountsAndArgs
    let canMergeAccountsAndArgs = false;
    if (!nodes.isTypeDefinedLinkNode(instruction.args)) {
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

    return new RenderMap().add(
      `instructions/${camelCase(instruction.name)}.ts`,
      this.render('instructionsPage.njk', {
        instruction,
        imports: imports.toString(this.options.dependencyMap),
        program: this.program,
        accounts,
        needsEddsa: accounts.some((a) => a.defaultsTo.kind === 'pda'),
        needsIdentity: accounts.some((a) => a.defaultsTo.kind === 'identity'),
        needsPayer: accounts.some((a) => a.defaultsTo.kind === 'payer'),
        typeManifest,
        canMergeAccountsAndArgs,
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
      `types/${camelCase(definedType.name)}.ts`,
      this.render('definedTypesPage.njk', {
        definedType,
        imports: imports.toString({
          ...this.options.dependencyMap,
          generatedTypes: '.',
        }),
        typeManifest,
      })
    );
  }

  get typeManifestVisitor() {
    return this.options.typeManifestVisitor;
  }

  protected getInstructionAccountType(
    account: ResolvedInstructionAccount
  ): string {
    if (account.pdaBumpArg) return 'Pda';
    if (account.isOptionalSigner) return 'PublicKey | Signer';
    return account.isSigner ? 'Signer' : 'PublicKey';
  }

  protected getInstructionAccountImports(
    accounts: ResolvedInstructionAccount[]
  ): JavaScriptImportMap {
    const imports = new JavaScriptImportMap();
    accounts.forEach((account) => {
      if (account.pdaBumpArg) {
        imports.add('core', 'Pda');
      }
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
    nodes.assertTypeStructNode(instruction.args);
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
