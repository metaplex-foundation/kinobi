import type { ConfigureOptions } from 'nunjucks';
import { format as formatCode, Options as PrettierOptions } from 'prettier';
import * as nodes from '../../nodes';
import { BaseVoidVisitor, Visitor } from '../../visitors';
import { createFile, resolveTemplate } from '../utils';
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
};

export class RenderJavaScriptVisitor extends BaseVoidVisitor {
  readonly formatCode: boolean;

  readonly prettierOptions: PrettierOptions;

  readonly typeDefinitionVisitor: Visitor<JavaScriptTypeDefinition>;

  readonly serializerVisitor: Visitor<JavaScriptSerializer>;

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
  }

  visitRoot(root: nodes.RootNode): void {
    const context = { ...root };
    this.render('rootIndex.njk', 'index.ts', context);
    this.render('accountsIndex.njk', 'accounts/index.ts', context);
    this.render('instructionsIndex.njk', 'instructions/index.ts', context);
    this.render('definedTypesIndex.njk', 'types/index.ts', context);
    super.visitRoot(root);
  }

  visitAccount(account: nodes.AccountNode): void {
    const typeDefinition = account.accept(this.typeDefinitionVisitor);
    const serializer = account.accept(this.serializerVisitor);
    const imports = new ImportMap()
      .mergeWith(typeDefinition.imports, serializer.imports)
      .add('core', ['Context', 'Serializer']);

    this.render('accountsPage.njk', `accounts/${account.name}.ts`, {
      ...account,
      typeDefinition,
      serializer,
      imports,
    });
  }

  visitInstruction(instruction: nodes.InstructionNode): void {
    const argsTypeDefinition = instruction.accept(this.typeDefinitionVisitor);
    const argsSerializer = instruction.accept(this.serializerVisitor);
    const imports = new ImportMap()
      .mergeWith(argsTypeDefinition.imports, argsSerializer.imports)
      .add('core', ['Context', 'Serializer']);

    this.render('instructionsPage.njk', `instructions/${instruction.name}.ts`, {
      ...instruction,
      argsTypeDefinition,
      argsSerializer,
      imports,
    });
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): void {
    const typeDefinition = definedType.accept(this.typeDefinitionVisitor);
    const serializer = definedType.accept(this.serializerVisitor);
    const imports = new ImportMap()
      .mergeWith(typeDefinition.imports, serializer.imports)
      .add('core', ['Context', 'Serializer']);

    this.render('definedTypesPage.njk', `types/${definedType.name}.ts`, {
      ...definedType,
      imports,
      typeDefinition,
      serializer,
    });
  }

  protected resolveTemplate(
    template: string,
    context?: object,
    options?: ConfigureOptions,
  ): string {
    const code = resolveTemplate('js/templates', template, context, options);
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
