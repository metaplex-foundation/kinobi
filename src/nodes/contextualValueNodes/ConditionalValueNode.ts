import { ProgramLinkNode } from '../linkNodes';
import { ValueNode } from '../valueNodes';
import { AccountValueNode } from './AccountValueNode';
import { ArgumentValueNode } from './ArgumentValueNode';
import { ContextualValueNode } from './ContextualValueNode';
import { ResolverValueNode } from './ResolverValueNode';

type ConditionalStatement = ValueNode | ContextualValueNode | ProgramLinkNode;

export type ConditionalValueNode = {
  readonly kind: 'conditionalValueNode';
  readonly condition: ResolverValueNode | AccountValueNode | ArgumentValueNode;
  readonly ifTrue?: ConditionalStatement;
  readonly ifFalse?: ConditionalStatement;
};

export function conditionalValueNode(input: {
  condition: ConditionalValueNode['condition'];
  ifTrue?: ConditionalValueNode['ifTrue'];
  ifFalse?: ConditionalValueNode['ifFalse'];
}): ConditionalValueNode {
  return {
    kind: 'conditionalValueNode',
    condition: input.condition,
    ifTrue: input.ifTrue,
    ifFalse: input.ifFalse,
  };
}
