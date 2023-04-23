import { fixedSize } from '../../shared';
import * as nodes from '../../nodes';
import { BaseNodeVisitor } from '../BaseNodeVisitor';
import { visit } from '../Visitor';

export class TransformU8ArraysToBytesVisitor extends BaseNodeVisitor {
  constructor(readonly sizes: number[] | '*' = [32, 64]) {
    super();
  }

  visitArrayType(arrayType: nodes.ArrayTypeNode): nodes.Node {
    const child = visit(arrayType.child, this);
    nodes.assertTypeNode(child);

    if (
      nodes.isNumberTypeNode(child) &&
      child.format === 'u8' &&
      arrayType.size.kind === 'fixed' &&
      this.hasRequiredSize(arrayType.size)
    ) {
      return nodes.bytesTypeNode(fixedSize(arrayType.size.value));
    }

    return nodes.arrayTypeNode(child, { ...arrayType });
  }

  protected hasRequiredSize(size: nodes.ArrayTypeNode['size']): boolean {
    if (size.kind !== 'fixed') return false;
    return this.sizes === '*' || this.sizes.includes(size.value);
  }
}
