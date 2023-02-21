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
      this.hasRequiredSize(typeArray.size)
    ) {
      return new nodes.TypeBytesNode();
    }

    return typeArray;
  }

  protected hasRequiredSize(size: nodes.TypeArrayNode['size']): boolean {
    if (size.kind !== 'fixed') return false;
    return this.sizes === '*' || this.sizes.includes(size.size);
  }
}
