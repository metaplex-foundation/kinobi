import type { IdlTypeEnumVariant } from '../../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../../shared';

export type EnumEmptyVariantTypeNode = {
  readonly kind: 'enumEmptyVariantTypeNode';

  // Data.
  readonly name: MainCaseString;
};

export function enumEmptyVariantTypeNode(
  name: string
): EnumEmptyVariantTypeNode {
  if (!name) {
    throw new InvalidKinobiTreeError(
      'EnumEmptyVariantTypeNode must have a name.'
    );
  }
  return { kind: 'enumEmptyVariantTypeNode', name: mainCase(name) };
}

export function enumEmptyVariantTypeNodeFromIdl(
  idl: IdlTypeEnumVariant
): EnumEmptyVariantTypeNode {
  return enumEmptyVariantTypeNode(idl.name ?? '');
}
