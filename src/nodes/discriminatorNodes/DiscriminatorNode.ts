import type { ConstantDiscriminatorNode } from './ConstantDiscriminatorNode';
import type { FieldDiscriminatorNode } from './FieldDiscriminatorNode';
import type { SizeDiscriminatorNode } from './SizeDiscriminatorNode';

// Discriminator Node Registration.
export type RegisteredDiscriminatorNode =
  | ConstantDiscriminatorNode
  | FieldDiscriminatorNode
  | SizeDiscriminatorNode;
export const REGISTERED_DISCRIMINATOR_NODE_KINDS = [
  'constantDiscriminatorNode',
  'fieldDiscriminatorNode',
  'sizeDiscriminatorNode',
] satisfies readonly RegisteredDiscriminatorNode['kind'][];
null as unknown as RegisteredDiscriminatorNode['kind'] satisfies (typeof REGISTERED_DISCRIMINATOR_NODE_KINDS)[number];

// Discriminator Node Helpers.
export type DiscriminatorNode = RegisteredDiscriminatorNode;
export const DISCRIMINATOR_NODES = REGISTERED_DISCRIMINATOR_NODE_KINDS;
