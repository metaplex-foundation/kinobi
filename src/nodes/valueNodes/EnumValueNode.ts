import { MainCaseString, mainCase } from '../../shared';
import { DefinedTypeLinkNode, definedTypeLinkNode } from '../linkNodes';
import { StructValueNode } from './StructValueNode';
import { TupleValueNode } from './TupleValueNode';

export interface EnumValueNode {
  readonly kind: 'enumValueNode';

  // Children.
  readonly enum: DefinedTypeLinkNode;
  readonly value?: StructValueNode | TupleValueNode;

  // Data.
  readonly variant: MainCaseString;
}

export function enumValueNode(
  enumLink: DefinedTypeLinkNode | string,
  variant: string,
  value?: StructValueNode | TupleValueNode
): EnumValueNode {
  return {
    kind: 'enumValueNode',
    enum:
      typeof enumLink === 'string' ? definedTypeLinkNode(enumLink) : enumLink,
    variant: mainCase(variant),
    value,
  };
}
