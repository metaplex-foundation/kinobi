import type { IdlType, IdlTypeEnumVariant } from '../../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../../shared';
import { FixedSizeTypeNode } from './FixedSizeTypeNode';
import { SizePrefixTypeNode } from './SizePrefixTypeNode';
import { TupleTypeNode, tupleTypeNodeFromIdl } from './TupleTypeNode';

/**
 * A tuple variant's body. Usually a bare `TupleTypeNode`, but a
 * Codama-standard IDL may wrap it in a `sizePrefixTypeNode`/
 * `fixedSizeTypeNode` (e.g. a TLV-framed tuple body) — that wrapper is
 * kept rather than stripped, since it carries real byte-layout information.
 * (Kept symmetric with `EnumStructVariantTypeNodeBody`, even though no
 * tuple variant is currently wrapped in the real Token-2022 IDL.)
 */
export type EnumTupleVariantTypeNodeBody =
  | TupleTypeNode
  | SizePrefixTypeNode
  | FixedSizeTypeNode;

export type EnumTupleVariantTypeNode = {
  readonly kind: 'enumTupleVariantTypeNode';

  // Children.
  readonly tuple: EnumTupleVariantTypeNodeBody;

  // Data.
  readonly name: MainCaseString;
};

export function enumTupleVariantTypeNode(
  name: string,
  tuple: EnumTupleVariantTypeNodeBody
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
