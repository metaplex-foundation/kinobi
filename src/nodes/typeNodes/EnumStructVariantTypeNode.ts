import type { IdlTypeEnumField, IdlTypeEnumVariant } from '../../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../../shared';
import { StructTypeNode, structTypeNodeFromIdl } from './StructTypeNode';

export type EnumStructVariantTypeNode = {
  readonly kind: 'enumStructVariantTypeNode';

  // Children.
  readonly struct: StructTypeNode;

  // Data.
  readonly name: MainCaseString;
};

export function enumStructVariantTypeNode(
  name: string,
  struct: StructTypeNode
): EnumStructVariantTypeNode {
  if (!name) {
    throw new InvalidKinobiTreeError(
      'EnumStructVariantTypeNode must have a name.'
    );
  }
  return { kind: 'enumStructVariantTypeNode', name: mainCase(name), struct };
}

export function enumStructVariantTypeNodeFromIdl(
  idl: IdlTypeEnumVariant
): EnumStructVariantTypeNode {
  const name = idl.name ?? '';
  return enumStructVariantTypeNode(
    name,
    structTypeNodeFromIdl({
      kind: 'struct',
      fields: idl.fields as IdlTypeEnumField[],
    })
  );
}
