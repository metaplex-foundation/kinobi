import { KinobiError, pascalCase } from '../shared';
import * as nodes from '../nodes';

export type Visitor<T = void> = {
  [K in keyof nodes.RegisteredNodes as K extends `${infer KWithoutNode}Node`
    ? `visit${Capitalize<KWithoutNode>}`
    : `visit${Capitalize<K>}`]: (node: nodes.RegisteredNodes[K]) => T;
};

export function visit<T>(node: nodes.Node, visitor: Visitor<T>): T {
  if (!nodes.REGISTERED_NODES_KEYS.includes(node.kind)) {
    throw new KinobiError(`Unrecognized node [${node.kind}]`);
  }

  const key = `visit${pascalCase(
    node.kind.slice(0, -4)
  )}` as typeof node.kind extends `${infer KWithoutNode}Node`
    ? `visit${Capitalize<KWithoutNode>}`
    : `visit${Capitalize<typeof node.kind>}`;

  return visitor[key](node as any);
}
