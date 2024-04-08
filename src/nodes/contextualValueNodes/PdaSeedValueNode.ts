import { MainCaseString, mainCase } from '../../shared';
import { ValueNode } from '../valueNodes';
import { AccountValueNode } from './AccountValueNode';
import { ArgumentValueNode } from './ArgumentValueNode';

export interface PdaSeedValueNode {
  readonly kind: 'pdaSeedValueNode';

  // Children.
  readonly value: ValueNode | AccountValueNode | ArgumentValueNode;

  // Data.
  readonly name: MainCaseString;
}

export function pdaSeedValueNode(
  name: string,
  value: PdaSeedValueNode['value']
): PdaSeedValueNode {
  return { kind: 'pdaSeedValueNode', name: mainCase(name), value };
}
