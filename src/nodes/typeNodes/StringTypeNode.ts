import { SizeNode, prefixedSizeNode } from '../sizeNodes';
import { numberTypeNode } from './NumberTypeNode';

export type StringEncoding = 'utf8' | 'base16' | 'base58' | 'base64';

export type StringTypeNode = {
  readonly kind: 'stringTypeNode';

  // Children.
  readonly size: SizeNode;

  // Data.
  readonly encoding: StringEncoding;
};

export function stringTypeNode(
  input: {
    readonly encoding?: StringEncoding;
    readonly size?: SizeNode;
  } = {}
): StringTypeNode {
  return {
    kind: 'stringTypeNode',
    encoding: input.encoding ?? 'utf8',
    size: input.size ?? prefixedSizeNode(numberTypeNode('u32')),
  };
}
