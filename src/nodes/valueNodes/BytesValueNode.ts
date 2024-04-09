import {
  getBase16Encoder,
  getBase58Encoder,
  getBase64Encoder,
  getUtf8Encoder,
} from '@solana/codecs-strings';

export type BytesEncoding = 'utf8' | 'base16' | 'base58' | 'base64';

export interface BytesValueNode {
  readonly kind: 'bytesValueNode';

  // Data.
  readonly data: string;
  readonly encoding: BytesEncoding;
}

export function bytesValueNode(
  encoding: BytesEncoding,
  data: string
): BytesValueNode {
  return { kind: 'bytesValueNode', data, encoding };
}

export function getBytesFromBytesValueNode(node: BytesValueNode): Uint8Array {
  switch (node.encoding) {
    case 'utf8':
      return getUtf8Encoder().encode(node.data);
    case 'base16':
      return getBase16Encoder().encode(node.data);
    case 'base58':
      return getBase58Encoder().encode(node.data);
    case 'base64':
    default:
      return getBase64Encoder().encode(node.data);
  }
}
