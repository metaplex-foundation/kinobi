import { MainCaseString, mainCase } from '../../shared';
import { ValueNode } from '../valueNodes';
import { AccountValueNode } from './AccountValueNode';
import { ArgumentValueNode } from './ArgumentValueNode';

export interface PdaSeedValueNode<
  TValue extends ValueNode | AccountValueNode | ArgumentValueNode =
    | ValueNode
    | AccountValueNode
    | ArgumentValueNode,
> {
  readonly kind: 'pdaSeedValueNode';

  // Children.
  readonly value: TValue;

  // Data.
  readonly name: MainCaseString;
}

export function pdaSeedValueNode<
  TValue extends ValueNode | AccountValueNode | ArgumentValueNode =
    | ValueNode
    | AccountValueNode
    | ArgumentValueNode,
>(name: string, value: TValue): PdaSeedValueNode<TValue> {
  return { kind: 'pdaSeedValueNode', name: mainCase(name), value };
}
