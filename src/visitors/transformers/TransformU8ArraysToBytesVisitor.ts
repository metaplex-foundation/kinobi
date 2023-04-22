import * as nodes from '../../nodes';
import { BaseNodeVisitor } from '../BaseNodeVisitor';

export class TransformU8ArraysToBytesVisitor extends BaseNodeVisitor {
  constructor(readonly sizes: number[] | '*' = [32, 64]) {
    super();
  }

  visitArrayType(arrayType: nodes.ArrayTypeNode): nodes.Node {
    const item = visit(typeArray.item, this);
    nodes.assertTypeNode(item);

    if (
      nodes.isNumberTypeNode(item) &&
      item.format === 'u8' &&
      typeArray.size.kind === 'fixed' &&
      this.hasRequiredSize(typeArray.size)
    ) {
      return nodes.bytesTypeNode({
        size: { kind: 'fixed', bytes: typeArray.size.size },
      });
    }

    return nodes.arrayTypeNode(item, { ...typeArray });
  }

  protected hasRequiredSize(size: nodes.ArrayTypeNode['size']): boolean {
    if (size.kind !== 'fixed') return false;
    return this.sizes === '*' || this.sizes.includes(size.size);
  }
}
