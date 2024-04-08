export type StringEncoding = 'utf8' | 'base16' | 'base58' | 'base64';

export interface StringTypeNode {
  readonly kind: 'stringTypeNode';

  // Data.
  readonly encoding: StringEncoding;
}

export function stringTypeNode(encoding?: StringEncoding): StringTypeNode {
  return { kind: 'stringTypeNode', encoding: encoding ?? 'utf8' };
}
