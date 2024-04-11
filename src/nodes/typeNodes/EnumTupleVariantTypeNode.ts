import type { NestedTypeNode } from './NestedTypeNode';
import type { IdlType, IdlTypeEnumVariant } from '../../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../../shared';
import { TupleTypeNode, tupleTypeNodeFromIdl } from './TupleTypeNode';

export interface EnumTupleVariantTypeNode<
  TTuple extends NestedTypeNode<TupleTypeNode> = NestedTypeNode<TupleTypeNode>,
> {
  readonly kind: 'enumTupleVariantTypeNode';

  // Children.
  readonly tuple: TTuple;

  // Data.
  readonly name: MainCaseString;
  readonly discriminator?: number;
}

export function enumTupleVariantTypeNode<
  TTuple extends NestedTypeNode<TupleTypeNode>,
>(
  name: string,
  tuple: TTuple,
  discriminator?: number
): EnumTupleVariantTypeNode<TTuple> {
  if (!name) {
    throw new InvalidKinobiTreeError(
      'EnumTupleVariantTypeNode must have a name.'
    );
  }
  return {
    kind: 'enumTupleVariantTypeNode',
    name: mainCase(name),
    tuple,
    discriminator,
  };
}

export function enumTupleVariantTypeNodeFromIdl(
  idl: IdlTypeEnumVariant
): EnumTupleVariantTypeNode<TupleTypeNode> {
  const name = idl.name ?? '';
  return enumTupleVariantTypeNode(
    name,
    tupleTypeNodeFromIdl({ tuple: idl.fields as IdlType[] })
  );
}
