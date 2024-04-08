import { PdaLinkNode, pdaLinkNode } from '../linkNodes';
import { PdaSeedValueNode } from './PdaSeedValueNode';

export interface PdaValueNode {
  readonly kind: 'pdaValueNode';

  // Children.
  readonly pda: PdaLinkNode;
  readonly seeds: PdaSeedValueNode[];
}

export function pdaValueNode(
  pda: PdaLinkNode | string,
  seeds: PdaSeedValueNode[] = []
): PdaValueNode {
  return {
    kind: 'pdaValueNode',
    pda: typeof pda === 'string' ? pdaLinkNode(pda) : pda,
    seeds,
  };
}
