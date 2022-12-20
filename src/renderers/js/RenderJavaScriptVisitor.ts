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
      this.resolveTemplate('rootIndex.stub', context),
    );

    // Account index.
    createFile(
      `${this.path}/accounts/index.ts`,
      this.resolveTemplate('accountsIndex.stub', context),
    );

    // Instructions index.
    createFile(
      `${this.path}/instructions/index.ts`,
      this.resolveTemplate('instructionsIndex.stub', context),
    );

    // Types index.
    createFile(
      `${this.path}/types/index.ts`,
      this.resolveTemplate('definedTypesIndex.stub', context),
    );

    // Children.
    super.visitRoot(root);
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): void {
    const typeDefinition = definedType.accept(this.typeDefinitionVisitor);
    const context = { ...definedType, typeDefinition };

    createFile(
      `${this.path}/types/${definedType.name}.ts`,
      this.resolveTemplate('definedTypesPage.stub', context),
    );
  }

  protected resolveTemplate(
    path: string,
    context?: object,
    options?: ConfigureOptions,
  ): string {
    return formatCode(
      resolveTemplate('js/templates', path, context, options),
      this.prettierOptions,
    );
  }
}
