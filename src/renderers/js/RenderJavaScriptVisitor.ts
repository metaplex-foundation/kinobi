import { RootNode } from '../../nodes';
import { BaseVoidVisitor } from '../../visitors';
import {
  createFile,
  ResolveTemplateFunction,
  resolveTemplateInsideDir,
} from '../utils';

export type RenderJavaScriptOptions = {
  //
};

export class RenderJavaScriptVisitor extends BaseVoidVisitor {
  readonly resolveTemplate: ResolveTemplateFunction;

  constructor(
    readonly path: string,
    readonly options: RenderJavaScriptOptions = {},
  ) {
    super();
    this.resolveTemplate = resolveTemplateInsideDir('js/templates');
  }

  visitRoot(root: RootNode): void {
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
  }
}
