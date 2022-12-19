import * as nodes from '../../nodes';
import { BaseVoidVisitor } from '../../visitors';
import {
  createFile,
  ResolveTemplateFunction,
  resolveTemplateInsideDir,
} from '../utils';
import { GetJavaScriptTypeDefinitionVisitor } from './GetJavaScriptTypeDefinitionVisitor';

export type RenderJavaScriptOptions = {
  //
};

export class RenderJavaScriptVisitor extends BaseVoidVisitor {
  readonly typeDefinitionVisitor: GetJavaScriptTypeDefinitionVisitor;

  readonly resolveTemplate: ResolveTemplateFunction;

  constructor(
    readonly path: string,
    readonly options: RenderJavaScriptOptions = {},
  ) {
    super();
    this.typeDefinitionVisitor = new GetJavaScriptTypeDefinitionVisitor();
    this.resolveTemplate = resolveTemplateInsideDir('js/templates');
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
}
