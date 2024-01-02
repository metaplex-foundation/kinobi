import { getNodeKinds } from '../../shared/utils';
import type { AccountLinkNode } from './AccountLinkNode';
import type { DefinedTypeLinkNode } from './DefinedTypeLinkNode';
import type { PdaLinkNode } from './PdaLinkNode';
import type { ProgramLinkNode } from './ProgramLinkNode';

// Link Node Registration.

export const REGISTERED_LINK_NODES = {
  programLinkNode: {} as ProgramLinkNode,
  pdaLinkNode: {} as PdaLinkNode,
  accountLinkNode: {} as AccountLinkNode,
  definedTypeLinkNode: {} as DefinedTypeLinkNode,
};

export const REGISTERED_LINK_NODE_KINDS = getNodeKinds(REGISTERED_LINK_NODES);
export type RegisteredLinkNodeKind = typeof REGISTERED_LINK_NODE_KINDS[number];
export type RegisteredLinkNode =
  typeof REGISTERED_LINK_NODES[RegisteredLinkNodeKind];

// Link Node Helpers.

export type LinkNode = RegisteredLinkNode;
export const LINK_NODES = REGISTERED_LINK_NODE_KINDS;
