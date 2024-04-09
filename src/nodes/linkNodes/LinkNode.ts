import type { AccountLinkNode } from './AccountLinkNode';
import type { DefinedTypeLinkNode } from './DefinedTypeLinkNode';
import type { PdaLinkNode } from './PdaLinkNode';
import type { ProgramLinkNode } from './ProgramLinkNode';

// Link Node Registration.
export type RegisteredLinkNode =
  | ProgramLinkNode
  | PdaLinkNode
  | AccountLinkNode
  | DefinedTypeLinkNode;
export const REGISTERED_LINK_NODE_KINDS = [
  'programLinkNode',
  'pdaLinkNode',
  'accountLinkNode',
  'definedTypeLinkNode',
] satisfies readonly RegisteredLinkNode['kind'][];
null as unknown as RegisteredLinkNode['kind'] satisfies (typeof REGISTERED_LINK_NODE_KINDS)[number];

// Link Node Helpers.
export type LinkNode = RegisteredLinkNode;
export const LINK_NODES = REGISTERED_LINK_NODE_KINDS;
