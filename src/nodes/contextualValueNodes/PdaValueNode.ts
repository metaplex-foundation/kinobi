import { MainCaseString, mainCase } from '../../shared';
import { isNode } from '../Node';
import { PdaNode } from '../PdaNode';
import { PdaLinkNode, pdaLinkNode } from '../linkNodes';
import { ValueNode } from '../valueNodes';
import { AccountValueNode, accountValueNode } from './AccountValueNode';
import { ArgumentValueNode, argumentValueNode } from './ArgumentValueNode';

export type PdaValueNode = {
  readonly kind: 'pdaValueNode';

  // Children.
  readonly pda: PdaLinkNode;
  readonly seeds: Record<
    MainCaseString,
    ValueNode | AccountValueNode | ArgumentValueNode
  >;
};

export function pdaValueNode(
  pda: PdaLinkNode | string,
  seeds: Record<string, ValueNode | AccountValueNode | ArgumentValueNode> = {}
): PdaValueNode {
  return {
    kind: 'pdaValueNode',
    pda: typeof pda === 'string' ? pdaLinkNode(pda) : pda,
    seeds: Object.entries(seeds).reduce((acc, [name, seedValue]) => {
      acc[mainCase(name)] = seedValue;
      return acc;
    }, {} as PdaValueNode['seeds']),
  };
}

export function getDefaultSeedValuesFromPda(
  node: PdaNode
): PdaValueNode['seeds'] {
  return node.seeds.reduce((acc, seed) => {
    if (!isNode(seed, 'variablePdaSeedNode')) return acc;
    if (isNode(seed.type, 'publicKeyTypeNode')) {
      acc[seed.name] = accountValueNode(seed.name);
    } else {
      acc[seed.name] = argumentValueNode(seed.name);
    }
    return acc;
  }, {} as PdaValueNode['seeds']);
}
