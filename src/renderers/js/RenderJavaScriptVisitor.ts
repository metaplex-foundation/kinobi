import { BaseVoidVisitor } from '../../visitors';

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

  //
}
