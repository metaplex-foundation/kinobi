import type { ResolveNestedTypeNode } from './TypeNode';
import type { IdlTypeEnumField, IdlTypeEnumVariant } from '../../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../../shared';
import { StructTypeNode, structTypeNodeFromIdl } from './StructTypeNode';

export interface EnumStructVariantTypeNode<
  TStruct extends
    ResolveNestedTypeNode<StructTypeNode> = ResolveNestedTypeNode<StructTypeNode>,
> {
  readonly kind: 'enumStructVariantTypeNode';

  // Children.
  readonly struct: TStruct;

  // Data.
  readonly name: MainCaseString;
}

export function enumStructVariantTypeNode<
  TStruct extends ResolveNestedTypeNode<StructTypeNode>,
>(name: string, struct: TStruct): EnumStructVariantTypeNode<TStruct> {
  if (!name) {
    throw new InvalidKinobiTreeError(
      'EnumStructVariantTypeNode must have a name.'
    );
  }
  return { kind: 'enumStructVariantTypeNode', name: mainCase(name), struct };
}

export function enumStructVariantTypeNodeFromIdl(
  idl: IdlTypeEnumVariant
): EnumStructVariantTypeNode<StructTypeNode> {
  const name = idl.name ?? '';
  return enumStructVariantTypeNode(
    name,
    structTypeNodeFromIdl({
      kind: 'struct',
      fields: idl.fields as IdlTypeEnumField[],
    })
  );
}
