import type { ConfigureOptions } from 'nunjucks';
import { format as formatCode, Options as PrettierOptions } from 'prettier';
import * as nodes from '../../nodes';
import { camelCase, pascalCase, titleCase } from '../../utils';
import { BaseVoidVisitor, Visitor } from '../../visitors';
import { createFile, deleteFolder, resolveTemplate } from '../utils';
import {
  GetJavaScriptSerializerVisitor,
  JavaScriptSerializer,
} from './GetJavaScriptSerializerVisitor';
import {
  GetJavaScriptTypeDefinitionVisitor,
  JavaScriptTypeDefinition,
} from './GetJavaScriptTypeDefinitionVisitor';
import { ImportMap } from './ImportMap';

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

export type RenderJavaScriptOptions = {
  formatCode?: boolean;
  prettier?: PrettierOptions;
  typeDefinitionVisitor?: Visitor<JavaScriptTypeDefinition>;
  serializerVisitor?: Visitor<JavaScriptSerializer>;
  deleteFolderBeforeRendering?: boolean;
};

export class RenderJavaScriptVisitor extends BaseVoidVisitor {
  readonly formatCode: boolean;

  readonly prettierOptions: PrettierOptions;

  readonly typeDefinitionVisitor: Visitor<JavaScriptTypeDefinition>;

  readonly serializerVisitor: Visitor<JavaScriptSerializer>;

  readonly deleteFolderBeforeRendering: boolean;

  private program: nodes.ProgramNode | null = null;

  constructor(
    readonly path: string,
    readonly options: RenderJavaScriptOptions = {},
  ) {
    super();
    this.formatCode = options.formatCode ?? true;
    this.prettierOptions = { ...DEFAULT_PRETTIER_OPTIONS, ...options.prettier };
    this.typeDefinitionVisitor =
      this.options.typeDefinitionVisitor ??
      new GetJavaScriptTypeDefinitionVisitor();
    this.serializerVisitor =
      this.options.serializerVisitor ?? new GetJavaScriptSerializerVisitor();
    this.deleteFolderBeforeRendering =
      options.deleteFolderBeforeRendering ?? true;
  }

  visitRoot(root: nodes.RootNode): void {
    if (this.deleteFolderBeforeRendering) {
      deleteFolder(this.path);
    }

    const context = { root };
    this.render('rootIndex.njk', 'index.ts');
    this.render('accountsIndex.njk', 'accounts/index.ts', context);
    this.render('instructionsIndex.njk', 'instructions/index.ts', context);
    this.render('definedTypesIndex.njk', 'types/index.ts', context);
    root.programs.forEach((program) => program.accept(this));
  }

  visitProgram(program: nodes.ProgramNode): void {
    this.program = program;
    program.accounts.forEach((account) => account.accept(this));
    program.instructions.forEach((instruction) => instruction.accept(this));
    program.definedTypes.forEach((type) => type.accept(this));
    this.render('errorsIndex.njk', `errors/index.ts`, {
      imports: new ImportMap().add('core', ['ErrorWithCode']),
      errors: program.errors,
    });
    // TODO(loris): Create program page and error page per program.
    this.program = null;
  }

  visitAccount(account: nodes.AccountNode): void {
    const typeDefinition = account.accept(this.typeDefinitionVisitor);
    const serializer = account.accept(this.serializerVisitor);
    const imports = new ImportMap()
      .mergeWith(typeDefinition.imports, serializer.imports)
      .add('core', ['Context', 'Serializer'])
      .remove('types', [account.name]);

    this.render('accountsPage.njk', `accounts/${account.name}.ts`, {
      account,
      imports,
      typeDefinition,
      serializer,
      name: account.name,
    });
  }

  visitInstruction(instruction: nodes.InstructionNode): void {
    // Imports.
    const imports = new ImportMap().add('core', [
      'AccountMeta',
      'Context',
      'getProgramAddressWithFallback',
      'PublicKey',
      'Signer',
      'WrappedInstruction',
      ...(instruction.hasAccounts || instruction.hasData ? ['Serializer'] : []),
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
    const argsTypeDefinition = instruction.args.accept(
      this.typeDefinitionVisitor,
    );
    imports.mergeWith(argsTypeDefinition.imports);

    // Discriminator.
    const discriminatorTypeDefinition = instruction.discriminator?.type.accept(
      this.typeDefinitionVisitor,
    );
    if (discriminatorTypeDefinition) {
      imports.mergeWith(discriminatorTypeDefinition.imports);
    }

    // Data.
    let dataSerializer: JavaScriptSerializer | undefined;
    if (instruction.hasData) {
      const ixDataName = `${instruction.name}InstructionData`;
      const discriminatorType = instruction.discriminator?.type;
      const struct = new nodes.TypeStructNode(ixDataName, [
        ...(discriminatorType
          ? [{ name: 'discriminator', type: discriminatorType, docs: [] }]
          : []),
        ...instruction.args.fields,
      ]);
      const definedType = new nodes.DefinedTypeNode(ixDataName, struct, []);
      dataSerializer = definedType.accept(this.serializerVisitor);
      imports.mergeWith(dataSerializer.imports);
      if (instruction.hasDiscriminator) {
        imports.add('core', 'mapSerializer');
      }
    }

    // Remove imports from the same module.
    imports.remove('types', [
      `${instruction.name}InstructionAccounts`,
      `${instruction.name}InstructionArgs`,
      `${instruction.name}InstructionData`,
    ]);

    this.render('instructionsPage.njk', `instructions/${instruction.name}.ts`, {
      instruction,
      imports,
      program: this.program,
      accounts,
      argsTypeDefinition,
      discriminatorTypeDefinition,
      dataSerializer,
      name: instruction.name,
      camelCaseName: camelCase(instruction.name),
    });
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): void {
    const typeDefinition = definedType.accept(this.typeDefinitionVisitor);
    const serializer = definedType.accept(this.serializerVisitor);
    const imports = new ImportMap()
      .mergeWith(typeDefinition.imports, serializer.imports)
      .add('core', ['Context', 'Serializer'])
      .remove('types', [definedType.name]);

    this.render('definedTypesPage.njk', `types/${definedType.name}.ts`, {
      definedType,
      imports,
      typeDefinition,
      serializer,
      name: definedType.name,
    });
  }

  protected getInstructionAccountType(
    account: nodes.InstructionNodeAccount,
  ): string {
    if (account.isOptionalSigner) return 'PublicKey | Signer';
    return account.isSigner ? 'Signer' : 'PublicKey';
  }

  protected getInstructionAccountImports(
    accounts: nodes.InstructionNodeAccount[],
  ): ImportMap {
    const imports = new ImportMap();
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

  protected resolveTemplate(
    template: string,
    context?: object,
    options?: ConfigureOptions,
  ): string {
    const code = resolveTemplate(
      `${__dirname}/templates`,
      template,
      context,
      options,
    );
    return this.formatCode ? formatCode(code, this.prettierOptions) : code;
  }

  protected render(
    template: string,
    path: string,
    context?: object,
    options?: ConfigureOptions,
  ): void {
    createFile(
      `${this.path}/${path}`,
      this.resolveTemplate(template, context, options),
    );
  }
}
