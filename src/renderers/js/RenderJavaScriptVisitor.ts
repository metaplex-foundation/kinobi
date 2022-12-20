import type { ConfigureOptions } from 'nunjucks';
import { format as formatCode, Options as PrettierOptions } from 'prettier';
import * as nodes from '../../nodes';
import { BaseVoidVisitor } from '../../visitors';
import { createFile, resolveTemplate } from '../utils';
import { GetJavaScriptTypeDefinitionVisitor } from './GetJavaScriptTypeDefinitionVisitor';

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
};

export class RenderJavaScriptVisitor extends BaseVoidVisitor {
  readonly typeDefinitionVisitor: GetJavaScriptTypeDefinitionVisitor;

  readonly prettierOptions: PrettierOptions;

  constructor(
    readonly path: string,
    readonly options: RenderJavaScriptOptions = {},
  ) {
    super();
    this.typeDefinitionVisitor = new GetJavaScriptTypeDefinitionVisitor();
    this.prettierOptions = { ...DEFAULT_PRETTIER_OPTIONS, ...options.prettier };
  }

  visitRoot(root: nodes.RootNode): void {
    const context = { ...root };

    // Root index.
    createFile(
      `${this.path}/index.ts`,
      this.resolveTemplate('rootIndex.njk', context),
    );

    // Account index.
    createFile(
      `${this.path}/accounts/index.ts`,
      this.resolveTemplate('accountsIndex.njk', context),
    );

    // Instructions index.
    createFile(
      `${this.path}/instructions/index.ts`,
      this.resolveTemplate('instructionsIndex.njk', context),
    );

    // Types index.
    createFile(
      `${this.path}/types/index.ts`,
      this.resolveTemplate('definedTypesIndex.njk', context),
    );

    // Children.
    super.visitRoot(root);
  }

  visitAccount(account: nodes.AccountNode): void {
    const typeDefinition = account.accept(this.typeDefinitionVisitor);
    const context = { ...account, typeDefinition };

    createFile(
      `${this.path}/accounts/${account.name}.ts`,
      this.resolveTemplate('accountsPage.njk', context),
    );
  }

  visitInstruction(instruction: nodes.InstructionNode): void {
    const argsTypeDefinition = instruction.accept(this.typeDefinitionVisitor);
    const context = { ...instruction, argsTypeDefinition };

    createFile(
      `${this.path}/instructions/${instruction.name}.ts`,
      this.resolveTemplate('instructionsPage.njk', context),
    );
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): void {
    const typeDefinition = definedType.accept(this.typeDefinitionVisitor);
    const context = { ...definedType, typeDefinition };

    createFile(
      `${this.path}/types/${definedType.name}.ts`,
      this.resolveTemplate('definedTypesPage.njk', context),
    );
  }

  protected resolveTemplate(
    path: string,
    context?: object,
    options?: ConfigureOptions,
  ): string {
    const code = resolveTemplate('js/templates', path, context, options);
    return this.options.formatCode ?? true
      ? formatCode(code, this.prettierOptions)
      : code;
  }
}
