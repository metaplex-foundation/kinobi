import type { ConfigureOptions } from 'nunjucks';
import { format as formatCode, Options as PrettierOptions } from 'prettier';
import { logWarn } from '../../logs';
import * as nodes from '../../nodes';
import { camelCase, pascalCase, titleCase } from '../../utils';
import { Visitor, BaseThrowVisitor } from '../../visitors';
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
  typeManifestVisitor?: Visitor<JavaScriptTypeManifest> & {
    registerDefinedTypes?: (definedTypes: nodes.DefinedTypeNode[]) => void;
  };
};

export class GetJavaScriptRenderMapVisitor extends BaseThrowVisitor<RenderMap> {
  readonly options: Required<GetJavaScriptRenderMapOptions>;

  private program: nodes.ProgramNode | null = null;

  constructor(options: GetJavaScriptRenderMapOptions = {}) {
    super();
    this.options = {
      formatCode: options.formatCode ?? true,
      prettierOptions: {
        ...DEFAULT_PRETTIER_OPTIONS,
        ...options.prettierOptions,
      },
      typeManifestVisitor:
        options.typeManifestVisitor ?? new GetJavaScriptTypeManifestVisitor(),
    };
  }

  visitRoot(root: nodes.RootNode): RenderMap {
    if (this.typeManifestVisitor.registerDefinedTypes) {
      this.typeManifestVisitor.registerDefinedTypes(root.allDefinedTypes);
    }

    const programsToRender = root.programs.filter((p) => p.metadata.render);
    const ctx = { root, programsToRender };
    return new RenderMap()
      .add('index.ts', this.render('rootIndex.njk'))
      .add('accounts/index.ts', this.render('accountsIndex.njk', ctx))
      .add('instructions/index.ts', this.render('instructionsIndex.njk', ctx))
      .add('types/index.ts', this.render('definedTypesIndex.njk', ctx))
      .add('programs/index.ts', this.render('programsIndex.njk', ctx))
      .add('errors/index.ts', this.render('errorsIndex.njk', ctx))
      .mergeWith(...root.programs.map((program) => program.accept(this)));
  }

  visitProgram(program: nodes.ProgramNode): RenderMap {
    this.program = program;
    const { name } = program.metadata;
    const pascalCaseName = pascalCase(name);
    const renderMap = new RenderMap()
      .mergeWith(...program.accounts.map((account) => account.accept(this)))
      .mergeWith(...program.definedTypes.map((type) => type.accept(this)));

    // Renderless programs are support programs that
    // were added to fill missing types or accounts.
    // They don't need to render anything else.
    if (!program.metadata.render) {
      this.program = null;
      return renderMap;
    }

    renderMap
      .mergeWith(...program.instructions.map((ix) => ix.accept(this)))
      .add(
        `errors/${name}.ts`,
        this.render('errorsPage.njk', {
          imports: new JavaScriptImportMap().add('core', [
            'ProgramError',
            'Program',
          ]),
          program,
          pascalCaseName,
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
            .add('core', ['Context', 'Program'])
            .add('errors', [
              `get${pascalCaseName}ErrorFromCode`,
              `get${pascalCaseName}ErrorFromName`,
            ]),
          program,
          pascalCaseName,
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
      .remove('types', [account.name]);

    return new RenderMap().add(
      `accounts/${account.name}.ts`,
      this.render('accountsPage.njk', {
        account,
        imports,
        typeManifest,
        name: account.name,
      })
    );
  }

  visitInstruction(instruction: nodes.InstructionNode): RenderMap {
    // Imports.
    const imports = new JavaScriptImportMap().add('core', [
      'AccountMeta',
      'Context',
      'getProgramAddressWithFallback',
      'PublicKey',
      'Signer',
      'WrappedInstruction',
      ...(instruction.hasArgs ? ['Serializer'] : []),
    ]);

    // Accounts.
    const accounts = instruction.accounts.map((account) => {
      const hasDefaultValue =
        account.defaultsTo &&
        !account.isOptional &&
        !account.isSigner &&
        !account.isOptionalSigner;
      return {
        ...account,
        type: this.getInstructionAccountType(account),
        optionalSign: hasDefaultValue || account.isOptional ? '?' : '',
        titleCaseName: titleCase(account.name),
        pascalCaseName: pascalCase(account.name),
        hasDefaultValue,
      };
    });
    imports.mergeWith(this.getInstructionAccountImports(accounts));

    // Arguments.
    const typeManifest = instruction.accept(this.typeManifestVisitor);
    imports.mergeWith(typeManifest.imports);

    // Remove imports from the same module.
    imports.remove('types', [
      `${instruction.name}InstructionAccounts`,
      `${instruction.name}InstructionArgs`,
      `${instruction.name}InstructionData`,
    ]);

    // canMergeAccountsAndArgs
    const accountsAndArgsConflicts =
      this.getMergeConflictsForInstructionAccountsAndArgs(instruction);
    if (accountsAndArgsConflicts.length > 0) {
      logWarn(
        `Accounts and args of "${instruction.name}" instruction have conflicting ` +
          'attributes. Thus, they could not be merged into a single input object. ' +
          'You may want to rename the conflicting attributes.'
      );
    }

    return new RenderMap().add(
      `instructions/${instruction.name}.ts`,
      this.render('instructionsPage.njk', {
        instruction,
        imports,
        program: this.program,
        accounts,
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
      .remove('types', [definedType.name]);

    return new RenderMap().add(
      `types/${definedType.name}.ts`,
      this.render('definedTypesPage.njk', {
        definedType,
        imports,
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
    account: nodes.InstructionNodeAccount
  ): string {
    if (account.isOptionalSigner) return 'PublicKey | Signer';
    return account.isSigner ? 'Signer' : 'PublicKey';
  }

  protected getInstructionAccountImports(
    accounts: nodes.InstructionNodeAccount[]
  ): JavaScriptImportMap {
    const imports = new JavaScriptImportMap();
    accounts.forEach((account) => {
      if (account.isOptionalSigner) {
        imports.add('core', ['PublicKey', 'Signer', 'isSigner']);
      } else if (account.isSigner) {
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
