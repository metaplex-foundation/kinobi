import { ArgumentValueNode, ResolverValueNode } from './contextualValueNodes';

export type InstructionRemainingAccountsNode = {
  readonly kind: 'instructionRemainingAccountsNode';

  // Children.
  readonly value: ArgumentValueNode | ResolverValueNode;

  // Data.
  readonly isOptional?: boolean;
  readonly isSigner?: boolean | 'either';
  readonly isWritable?: boolean;
};

export type InstructionRemainingAccountsNodeInput = Omit<
  InstructionRemainingAccountsNode,
  'kind'
>;

export function instructionRemainingAccountsNode(
  value: ArgumentValueNode | ResolverValueNode,
  options: {
    isOptional?: boolean;
    isSigner?: boolean | 'either';
    isWritable?: boolean;
  } = {}
): InstructionRemainingAccountsNode {
  return {
    kind: 'instructionRemainingAccountsNode',
    value,
    isOptional: options.isOptional,
    isSigner: options.isSigner,
    isWritable: options.isWritable,
  };
}
