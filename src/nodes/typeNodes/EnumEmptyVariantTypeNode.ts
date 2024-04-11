import type { IdlTypeEnumVariant } from '../../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../../shared';

export interface EnumEmptyVariantTypeNode {
  readonly kind: 'enumEmptyVariantTypeNode';

  // Data.
  readonly name: MainCaseString;
  readonly discriminator?: number;
}

export function enumEmptyVariantTypeNode(
  name: string,
  discriminator?: number
): EnumEmptyVariantTypeNode {
  if (!name) {
    throw new InvalidKinobiTreeError(
      'EnumEmptyVariantTypeNode must have a name.'
    );
  }
  return {
    kind: 'enumEmptyVariantTypeNode',
    name: mainCase(name),
    discriminator,
  };
}

export function enumEmptyVariantTypeNodeFromIdl(
  idl: IdlTypeEnumVariant
): EnumEmptyVariantTypeNode {
  return enumEmptyVariantTypeNode(idl.name ?? '');
}
