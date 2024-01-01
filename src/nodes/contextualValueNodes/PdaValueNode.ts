import { MainCaseString } from '../../shared';
import { PdaLinkNode } from '../linkNodes';
import { ValueNode } from '../valueNodes';
import { AccountValueNode } from './AccountValueNode';
import { ArgumentValueNode } from './ArgumentValueNode';

export type PdaValueNode = {
  readonly kind: 'pdaValueNode';
  readonly pda: PdaLinkNode;
  readonly seeds: Record<
    MainCaseString,
    ValueNode | AccountValueNode | ArgumentValueNode
  >;
};

export function pdaValueNode(
  pda: PdaLinkNode,
  seeds: PdaValueNode['seeds'] = {}
): PdaValueNode {
  return { kind: 'pdaValueNode', pda, seeds };
}
