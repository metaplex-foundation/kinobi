import { isNode } from '../Node';
import { PdaNode } from '../PdaNode';
import { PdaLinkNode, pdaLinkNode } from '../linkNodes';
import { accountValueNode } from './AccountValueNode';
import { argumentValueNode } from './ArgumentValueNode';
import { PdaSeedValueNode, pdaSeedValueNode } from './PdaSeedValueNode';

export type PdaValueNode = {
  readonly kind: 'pdaValueNode';

  // Children.
  readonly pda: PdaLinkNode;
  readonly seeds: PdaSeedValueNode[];
};

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

export function addDefaultSeedValuesFromPdaWhenMissing(
  node: PdaNode,
  existingSeeds: PdaSeedValueNode[]
): PdaSeedValueNode[] {
  const existingSeedNames = new Set(existingSeeds.map((seed) => seed.name));
  const defaultSeeds = getDefaultSeedValuesFromPda(node).filter(
    (seed) => !existingSeedNames.has(seed.name)
  );
  return [...existingSeeds, ...defaultSeeds];
}

export function getDefaultSeedValuesFromPda(node: PdaNode): PdaSeedValueNode[] {
  return node.seeds.flatMap((seed): PdaSeedValueNode[] => {
    if (!isNode(seed, 'variablePdaSeedNode')) return [];
    if (isNode(seed.type, 'publicKeyTypeNode')) {
      return [pdaSeedValueNode(seed.name, accountValueNode(seed.name))];
    }
    return [pdaSeedValueNode(seed.name, argumentValueNode(seed.name))];
  });
}
