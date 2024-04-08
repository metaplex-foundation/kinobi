import { MainCaseString, mainCase } from '../../shared';
import { DefinedTypeLinkNode, definedTypeLinkNode } from '../linkNodes';
import { StructValueNode } from './StructValueNode';
import { TupleValueNode } from './TupleValueNode';

export interface EnumValueNode<
  TEnum extends DefinedTypeLinkNode = DefinedTypeLinkNode,
  TValue extends StructValueNode | TupleValueNode | undefined =
    | StructValueNode
    | TupleValueNode
    | undefined,
> {
  readonly kind: 'enumValueNode';

  // Children.
  readonly enum: TEnum;
  readonly value?: TValue;

  // Data.
  readonly variant: MainCaseString;
}

export function enumValueNode<
  TEnum extends DefinedTypeLinkNode = DefinedTypeLinkNode,
  TValue extends StructValueNode | TupleValueNode | undefined = undefined,
>(
  enumLink: TEnum | string,
  variant: string,
  value?: TValue
): EnumValueNode<TEnum, TValue> {
  return {
    kind: 'enumValueNode',
    enum: (typeof enumLink === 'string'
      ? definedTypeLinkNode(enumLink)
      : enumLink) as TEnum,
    variant: mainCase(variant),
    value,
  };
}
