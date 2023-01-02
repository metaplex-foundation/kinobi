import { Visitor, BaseDelegateVisitor } from '../visitors';
import { RenderMap } from './RenderMap';

export class WriteRenderMapVisitor extends BaseDelegateVisitor<
  RenderMap,
  void
> {
  constructor(readonly visitor: Visitor<RenderMap>, readonly path: string) {
    super(visitor);
  }

  map(renderMap: RenderMap): void {
    renderMap.write(this.path);
  }
}
