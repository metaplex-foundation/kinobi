import { SizeNode, prefixedSizeNode } from '../sizeNodes';
import { numberTypeNode } from './NumberTypeNode';

export type StringEncoding = 'utf8' | 'base16' | 'base58' | 'base64';

export type StringTypeNode = {
  readonly kind: 'stringTypeNode';
  readonly encoding: StringEncoding;
  readonly size: SizeNode;
};

export function stringTypeNode(
  options: {
    readonly encoding?: StringEncoding;
    readonly size?: SizeNode;
  } = {}
): StringTypeNode {
  return {
    kind: 'stringTypeNode',
    encoding: options.encoding ?? 'utf8',
    size: options.size ?? prefixedSizeNode(numberTypeNode('u32')),
  };
}
