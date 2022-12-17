import { TypeArrayNode } from 'src/nodes';
import { BaseVisitor } from './BaseVisitor';

export class TransformU8ArraysToBufferVisitor extends BaseVisitor {
  visitTypeArray(typeArray: TypeArrayNode): void {
    typeArray.visitChildren(this);
  }
}
