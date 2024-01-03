import { getNodeKinds } from '../../shared/utils';
import type { ByteDiscriminatorNode } from './ByteDiscriminatorNode';
import type { FieldDiscriminatorNode } from './FieldDiscriminatorNode';
import type { SizeDiscriminatorNode } from './SizeDiscriminatorNode';

// Discriminator Node Registration.

export const REGISTERED_DISCRIMINATOR_NODES = {
  byteDiscriminatorNode: {} as ByteDiscriminatorNode,
  fieldDiscriminatorNode: {} as FieldDiscriminatorNode,
  sizeDiscriminatorNode: {} as SizeDiscriminatorNode,
};

export const REGISTERED_DISCRIMINATOR_NODE_KINDS = getNodeKinds(
  REGISTERED_DISCRIMINATOR_NODES
);
export type RegisteredDiscriminatordNodeKind =
  typeof REGISTERED_DISCRIMINATOR_NODE_KINDS[number];
export type RegisteredDiscriminatordNode =
  typeof REGISTERED_DISCRIMINATOR_NODES[RegisteredDiscriminatordNodeKind];

// Discriminator Node Helpers.

export type DiscriminatordNode = RegisteredDiscriminatordNode;
export const DISCRIMINATOR_NODES = REGISTERED_DISCRIMINATOR_NODE_KINDS;
