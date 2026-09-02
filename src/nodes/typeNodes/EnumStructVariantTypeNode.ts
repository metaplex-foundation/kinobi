import type { IdlTypeEnumField, IdlTypeEnumVariant } from '../../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../../shared';
import { FixedSizeTypeNode } from './FixedSizeTypeNode';
import { SizePrefixTypeNode } from './SizePrefixTypeNode';
import { StructTypeNode, structTypeNodeFromIdl } from './StructTypeNode';

/**
 * A struct variant's body. Usually a bare `StructTypeNode`, but a
 * Codama-standard IDL may wrap it in a `sizePrefixTypeNode`/
 * `fixedSizeTypeNode` (e.g. a TLV-framed struct body) — that wrapper is
 * kept rather than stripped, since it carries real byte-layout information.
 */
export type EnumStructVariantTypeNodeBody =
  | StructTypeNode
  | SizePrefixTypeNode
  | FixedSizeTypeNode;

export type EnumStructVariantTypeNode = {
  readonly kind: 'enumStructVariantTypeNode';

  // Children.
  readonly struct: EnumStructVariantTypeNodeBody;

  // Data.
  readonly name: MainCaseString;
};

export function enumStructVariantTypeNode(
  name: string,
  struct: EnumStructVariantTypeNodeBody
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
