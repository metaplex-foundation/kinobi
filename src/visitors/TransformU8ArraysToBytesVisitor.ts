import * as nodes from '../nodes';
import { BaseNodeVisitor } from './BaseNodeVisitor';

export class TransformU8ArraysToBytesVisitor extends BaseNodeVisitor {
  visitTypeArray(typeArray: nodes.TypeArrayNode): nodes.Node {
    const type = typeArray.itemType.accept(this);
    nodes.assertTypeNode(type);

    if (
      nodes.isTypeLeafNode(type) &&
      type.type === 'u8' &&
      typeArray.size === 32
    ) {
      return new nodes.TypeLeafNode('bytes');
    }

    return new nodes.TypeArrayNode(type, typeArray.size);
  }
}
