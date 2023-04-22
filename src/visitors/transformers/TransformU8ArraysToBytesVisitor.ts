import * as nodes from '../../nodes';
import { BaseNodeVisitor } from '../BaseNodeVisitor';

export class TransformU8ArraysToBytesVisitor extends BaseNodeVisitor {
  constructor(readonly sizes: number[] | '*' = [32, 64]) {
    super();
  }

  visitTypeArray(typeArray: nodes.ArrayTypeNode): nodes.Node {
    const item = typeArray.item.accept(this);
    nodes.assertTypeNode(item);

    if (
      nodes.isNumberTypeNode(item) &&
      item.format === 'u8' &&
      typeArray.size.kind === 'fixed' &&
      this.hasRequiredSize(typeArray.size)
    ) {
      return new nodes.BytesTypeNode({
        size: { kind: 'fixed', bytes: typeArray.size.size },
      });
    }

    return new nodes.ArrayTypeNode(item, { ...typeArray });
  }

  protected hasRequiredSize(size: nodes.ArrayTypeNode['size']): boolean {
    if (size.kind !== 'fixed') return false;
    return this.sizes === '*' || this.sizes.includes(size.size);
  }
}
