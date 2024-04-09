import type { ResolveNestedTypeNode } from './NestedTypeNode';
import type { IdlType, IdlTypeEnumVariant } from '../../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../../shared';
import { TupleTypeNode, tupleTypeNodeFromIdl } from './TupleTypeNode';

export interface EnumTupleVariantTypeNode<
  TTuple extends
    ResolveNestedTypeNode<TupleTypeNode> = ResolveNestedTypeNode<TupleTypeNode>,
> {
  readonly kind: 'enumTupleVariantTypeNode';

  // Children.
  readonly tuple: TTuple;

  // Data.
  readonly name: MainCaseString;
}

export function enumTupleVariantTypeNode<
  TTuple extends ResolveNestedTypeNode<TupleTypeNode>,
>(name: string, tuple: TTuple): EnumTupleVariantTypeNode<TTuple> {
  if (!name) {
    throw new InvalidKinobiTreeError(
      'EnumTupleVariantTypeNode must have a name.'
    );
  }
  return { kind: 'enumTupleVariantTypeNode', name: mainCase(name), tuple };
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
