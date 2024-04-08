import { isNode } from './Node';
import { ArgumentValueNode, ResolverValueNode } from './contextualValueNodes';
import { AccountLinkNode } from './linkNodes';
import { NumberValueNode } from './valueNodes';

type InstructionByteDeltaNodeValue =
  | NumberValueNode
  | AccountLinkNode
  | ArgumentValueNode
  | ResolverValueNode;

export interface InstructionByteDeltaNode<
  TValue extends InstructionByteDeltaNodeValue = InstructionByteDeltaNodeValue,
> {
  readonly kind: 'instructionByteDeltaNode';

  // Children.
  readonly value: TValue;

  // Data.
  readonly withHeader: boolean;
  readonly subtract?: boolean;
}

export function instructionByteDeltaNode<
  TValue extends InstructionByteDeltaNodeValue,
>(
  value: TValue,
  options: {
    withHeader?: boolean;
    subtract?: boolean;
  } = {}
): InstructionByteDeltaNode<TValue> {
  return {
    kind: 'instructionByteDeltaNode',
    value,
    withHeader: options.withHeader ?? !isNode(value, 'resolverValueNode'),
    subtract: options.subtract,
  };
}
