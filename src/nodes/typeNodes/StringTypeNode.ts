import {
  SizeStrategy,
  displaySizeStrategy,
  prefixedSize,
} from '../../shared/SizeStrategy';
import type { Node } from '../Node';

export type StringEncoding = 'utf8' | 'base16' | 'base58' | 'base64';

export type StringTypeNode = {
  readonly __stringTypeNode: unique symbol;
  readonly kind: 'stringTypeNode';
  readonly encoding: StringEncoding;
  readonly size: SizeStrategy;
};

export function stringTypeNode(
  options: {
    readonly encoding?: StringEncoding;
    readonly size?: SizeStrategy;
  } = {}
): StringTypeNode {
  return {
    kind: 'stringTypeNode',
    encoding: options.encoding ?? 'utf8',
    size: options.size ?? prefixedSize(),
  } as StringTypeNode;
}

export function displayStringTypeNode(node: StringTypeNode): string {
  return `string(${node.encoding};${displaySizeStrategy(node.size)})`;
}

export function isStringTypeNode(node: Node | null): node is StringTypeNode {
  return !!node && node.kind === 'stringTypeNode';
}

export function assertStringTypeNode(
  node: Node | null
): asserts node is StringTypeNode {
  if (!isStringTypeNode(node)) {
    throw new Error(`Expected stringTypeNode, got ${node?.kind ?? 'null'}.`);
  }
}
