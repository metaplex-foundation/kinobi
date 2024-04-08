import { PdaLinkNode, pdaLinkNode } from '../linkNodes';
import { PdaSeedValueNode } from './PdaSeedValueNode';

export interface PdaValueNode<
  TSeeds extends PdaSeedValueNode[] = PdaSeedValueNode[],
> {
  readonly kind: 'pdaValueNode';

  // Children.
  readonly pda: PdaLinkNode;
  readonly seeds: TSeeds;
}

export function pdaValueNode<const TSeeds extends PdaSeedValueNode[] = []>(
  pda: PdaLinkNode | string,
  seeds: TSeeds = [] as PdaSeedValueNode[] as TSeeds
): PdaValueNode<TSeeds> {
  return {
    kind: 'pdaValueNode',
    pda: typeof pda === 'string' ? pdaLinkNode(pda) : pda,
    seeds,
  };
}
