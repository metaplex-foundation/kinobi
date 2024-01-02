import { ValueNode } from '../valueNodes';
import { AccountValueNode } from './AccountValueNode';
import { ArgumentValueNode } from './ArgumentValueNode';
import {
  INSTRUCTION_INPUT_VALUE_NODE,
  InstructionInputValueNode,
} from './ContextualValueNode';
import { ResolverValueNode } from './ResolverValueNode';

export type ConditionalValueBranch = InstructionInputValueNode;

export const CONDITIONAL_VALUE_BRANCH_NODES = INSTRUCTION_INPUT_VALUE_NODE;

export type ConditionalValueNode = {
  readonly kind: 'conditionalValueNode';

  // Children.
  readonly condition: ResolverValueNode | AccountValueNode | ArgumentValueNode;
  readonly value?: ValueNode;
  readonly ifTrue?: ConditionalValueBranch;
  readonly ifFalse?: ConditionalValueBranch;
};

export function conditionalValueNode(input: {
  condition: ConditionalValueNode['condition'];
  value?: ConditionalValueNode['value'];
  ifTrue?: ConditionalValueNode['ifTrue'];
  ifFalse?: ConditionalValueNode['ifFalse'];
}): ConditionalValueNode {
  return {
    kind: 'conditionalValueNode',
    condition: input.condition,
    value: input.value,
    ifTrue: input.ifTrue,
    ifFalse: input.ifFalse,
  };
}
