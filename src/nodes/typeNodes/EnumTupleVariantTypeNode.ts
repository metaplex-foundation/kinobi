import type { IdlType, IdlTypeEnumVariant } from '../../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../../shared';
import { TupleTypeNode, tupleTypeNodeFromIdl } from './TupleTypeNode';

export type EnumTupleVariantTypeNode = {
  readonly kind: 'enumTupleVariantTypeNode';
  readonly name: MainCaseString;
  readonly tuple: TupleTypeNode;
};

export function enumTupleVariantTypeNode(
  name: string,
  tuple: TupleTypeNode
): EnumTupleVariantTypeNode {
  if (!name) {
    throw new InvalidKinobiTreeError(
      'EnumTupleVariantTypeNode must have a name.'
    );
  }
  return { kind: 'enumTupleVariantTypeNode', name: mainCase(name), tuple };
}

export function enumTupleVariantTypeNodeFromIdl(
  idl: IdlTypeEnumVariant
): EnumTupleVariantTypeNode {
  const name = idl.name ?? '';
  return enumTupleVariantTypeNode(
    name,
    tupleTypeNodeFromIdl({ tuple: idl.fields as IdlType[] })
  );
}
