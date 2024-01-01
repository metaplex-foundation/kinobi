import { Mutable } from '../../shared';
import { ProgramLinkNode } from '../linkNodes';
import { VALUE_NODES, ValueNode } from '../valueNodes';
import { AccountValueNode } from './AccountValueNode';
import { ArgumentValueNode } from './ArgumentValueNode';
import {
  CONTEXTUAL_VALUE_NODES,
  ContextualValueNode,
} from './ContextualValueNode';
import { ResolverValueNode } from './ResolverValueNode';

export type ConditionalValueBranch =
  | ValueNode
  | ContextualValueNode
  | ProgramLinkNode;

const CONDITIONAL_VALUE_BRANCH_NODES_INTERNAL = [
  ...VALUE_NODES,
  ...CONTEXTUAL_VALUE_NODES,
  'programLinkNode',
] as const;

export const CONDITIONAL_VALUE_BRANCH_NODES =
  CONDITIONAL_VALUE_BRANCH_NODES_INTERNAL as Mutable<
    typeof CONDITIONAL_VALUE_BRANCH_NODES_INTERNAL
  >;

export type ConditionalValueNode = {
  readonly kind: 'conditionalValueNode';
  readonly condition: ResolverValueNode | AccountValueNode | ArgumentValueNode;
  readonly ifTrue?: ConditionalValueBranch;
  readonly ifFalse?: ConditionalValueBranch;
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
