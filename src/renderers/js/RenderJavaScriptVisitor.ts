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
    const context = { username: 'Loris' };
    const content = this.resolveTemplate('hello.stub', context);
    createFile(`${this.path}/render.txt`, content);
    console.log(root.name);
  }
}
