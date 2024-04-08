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

export interface ConditionalValueNode<
  TCondition extends ResolverValueNode | AccountValueNode | ArgumentValueNode =
    | ResolverValueNode
    | AccountValueNode
    | ArgumentValueNode,
  TValue extends ValueNode | undefined = ValueNode | undefined,
  TIfTrue extends ConditionalValueBranch | undefined =
    | ConditionalValueBranch
    | undefined,
  TIfFalse extends ConditionalValueBranch | undefined =
    | ConditionalValueBranch
    | undefined,
> {
  readonly kind: 'conditionalValueNode';

  // Children.
  readonly condition: TCondition;
  readonly value?: TValue;
  readonly ifTrue?: TIfTrue;
  readonly ifFalse?: TIfFalse;
}

export function conditionalValueNode<
  TCondition extends ResolverValueNode | AccountValueNode | ArgumentValueNode,
  TValue extends ValueNode | undefined = undefined,
  TIfTrue extends ConditionalValueBranch | undefined = undefined,
  TIfFalse extends ConditionalValueBranch | undefined = undefined,
>(input: {
  condition: TCondition;
  value?: TValue;
  ifTrue?: TIfTrue;
  ifFalse?: TIfFalse;
}): ConditionalValueNode<TCondition, TValue, TIfTrue, TIfFalse> {
  return {
    kind: 'conditionalValueNode',
    condition: input.condition,
    value: input.value,
    ifTrue: input.ifTrue,
    ifFalse: input.ifFalse,
  };
}
