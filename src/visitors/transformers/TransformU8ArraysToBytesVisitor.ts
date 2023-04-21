import * as nodes from '../../nodes';
import { BaseNodeVisitor } from '../BaseNodeVisitor';

export class TransformU8ArraysToBytesVisitor extends BaseNodeVisitor {
  constructor(readonly sizes: number[] | '*' = [32, 64]) {
    super();
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): nodes.Node {
    const item = typeArray.item.accept(this);
    nodes.assertTypeNode(item);

    if (
      nodes.isTypeNumberNode(item) &&
      item.format === 'u8' &&
      typeArray.size.kind === 'fixed' &&
      this.hasRequiredSize(typeArray.size)
    ) {
      return new nodes.TypeBytesNode({
        size: { kind: 'fixed', bytes: typeArray.size.size },
      });
    }

    return typeArray;
  }

  protected hasRequiredSize(size: nodes.TypeArrayNode['size']): boolean {
    if (size.kind !== 'fixed') return false;
    return this.sizes === '*' || this.sizes.includes(size.size);
  }
}
