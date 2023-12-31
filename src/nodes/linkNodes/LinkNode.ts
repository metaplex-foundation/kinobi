import type { ProgramLinkNode } from './ProgramLinkNode';
import type { PdaLinkNode } from './PdaLinkNode';
import type { AccountLinkNode } from './AccountLinkNode';
import type { DefinedTypeLinkNode } from './DefinedTypeLinkNode';

// Node Group Registration.

export const REGISTERED_LINK_NODES = {
  programLinkNode: {} as ProgramLinkNode,
  pdaLinkNode: {} as PdaLinkNode,
  accountLinkNode: {} as AccountLinkNode,
  definedTypeLinkNode: {} as DefinedTypeLinkNode,
};

export const REGISTERED_LINK_NODE_KEYS = Object.keys(
  REGISTERED_LINK_NODES
) as (keyof typeof REGISTERED_LINK_NODES)[];

export type RegisteredLinkNodes = typeof REGISTERED_LINK_NODES;

// Node Group Helpers.

export type LinkNode = RegisteredLinkNodes[keyof RegisteredLinkNodes];

export const LINK_NODES = REGISTERED_LINK_NODE_KEYS;
