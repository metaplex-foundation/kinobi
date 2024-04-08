import { ArgumentValueNode, ResolverValueNode } from './contextualValueNodes';

export interface InstructionRemainingAccountsNode<
  TValue extends ArgumentValueNode | ResolverValueNode =
    | ArgumentValueNode
    | ResolverValueNode,
> {
  readonly kind: 'instructionRemainingAccountsNode';

  // Children.
  readonly value: TValue;

  // Data.
  readonly isOptional?: boolean;
  readonly isSigner?: boolean | 'either';
  readonly isWritable?: boolean;
}

export function instructionRemainingAccountsNode<
  TValue extends ArgumentValueNode | ResolverValueNode,
>(
  value: TValue,
  options: {
    isOptional?: boolean;
    isSigner?: boolean | 'either';
    isWritable?: boolean;
  } = {}
): InstructionRemainingAccountsNode<TValue> {
  return {
    kind: 'instructionRemainingAccountsNode',
    value,
    isOptional: options.isOptional,
    isSigner: options.isSigner,
    isWritable: options.isWritable,
  };
}
