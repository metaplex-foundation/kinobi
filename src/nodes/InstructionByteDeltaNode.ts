import { isNode } from './Node';
import { ArgumentValueNode, ResolverValueNode } from './contextualValueNodes';
import { AccountLinkNode } from './linkNodes';
import { NumberValueNode } from './valueNodes';
import { BigIntValueNode } from './valueNodes/BigIntValueNode';

export type InstructionByteDeltaNode = {
  readonly kind: 'instructionByteDeltaNode';

  // Children.
  readonly value:
    | NumberValueNode
    | BigIntValueNode
    | AccountLinkNode
    | ArgumentValueNode
    | ResolverValueNode;

  // Data.
  readonly withHeader: boolean;
  readonly subtract?: boolean;
};

export function instructionByteDeltaNode(
  value: InstructionByteDeltaNode['value'],
  options: {
    withHeader?: boolean;
    subtract?: boolean;
  } = {}
): InstructionByteDeltaNode {
  return {
    kind: 'instructionByteDeltaNode',
    value,
    withHeader: options.withHeader ?? !isNode(value, 'resolverValueNode'),
    subtract: options.subtract,
  };
}
