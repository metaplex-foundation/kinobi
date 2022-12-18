import { RootNode } from '../../nodes';
import { BaseVoidVisitor } from '../../visitors';
import { createFile } from '../utils';

export type RenderJavaScriptOptions = {
  //
};

export class RenderJavaScriptVisitor extends BaseVoidVisitor {
  constructor(
    readonly path: string,
    readonly options: RenderJavaScriptOptions = {},
  ) {
    super();
  }

  visitRoot(root: RootNode): void {
    createFile(`${this.path}/index.ts`, 'Hello World');
    console.log(root.name);
  }
}
