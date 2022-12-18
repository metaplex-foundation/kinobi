import nunjucks from 'nunjucks';
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
    const template = `${__dirname}/renderers/js/templates/hello.stub`;
    const result = nunjucks.render(template, {
      username: 'Loris',
    });
    createFile(`${this.path}/render.txt`, result);
    console.log(root.name);
  }
}
