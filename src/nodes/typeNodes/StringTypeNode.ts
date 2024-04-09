export type StringEncoding = 'utf8' | 'base16' | 'base58' | 'base64';

export interface StringTypeNode<
  TEncoding extends StringEncoding = StringEncoding,
> {
  readonly kind: 'stringTypeNode';

  // Data.
  readonly encoding: TEncoding;
}

export function stringTypeNode<TEncoding extends StringEncoding>(
  encoding: TEncoding
): StringTypeNode<TEncoding> {
  return { kind: 'stringTypeNode', encoding };
}
