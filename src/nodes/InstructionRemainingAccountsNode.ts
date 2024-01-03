import { ArgumentValueNode, ResolverValueNode } from './contextualValueNodes';

export type InstructionRemainingAccountsNode = {
  readonly kind: 'instructionRemainingAccountsNode';

  // Children.
  readonly value: ArgumentValueNode | ResolverValueNode;

  // Data.
  readonly isWritable?: boolean;
  readonly isSigner?: boolean | 'either';
};

export type InstructionRemainingAccountsNodeInput = Omit<
  InstructionRemainingAccountsNode,
  'kind'
>;

export function instructionRemainingAccountsNode(
  value: ArgumentValueNode | ResolverValueNode,
  options: {
    isWritable?: boolean;
    isSigner?: boolean | 'either';
  } = {}
): InstructionRemainingAccountsNode {
  return {
    kind: 'instructionRemainingAccountsNode',
    value,
    isWritable: options.isWritable,
    isSigner: options.isSigner,
  };
}
