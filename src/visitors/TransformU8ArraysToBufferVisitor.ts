import * as nodes from '../nodes';
import { BaseNodeVisitor } from './BaseNodeVisitor';

export class TransformU8ArraysToBufferVisitor extends BaseNodeVisitor {
  visitTypeArray(typeArray: nodes.TypeArrayNode): nodes.Node {
    const type = typeArray.itemType.accept(this);
    nodes.assertTypeNode(type);
    return new nodes.TypeArrayNode(type, typeArray.size);
  }
}
