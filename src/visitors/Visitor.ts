import { KinobiError, pascalCase } from '../shared';
import * as nodes from '../nodes';

export type Visitor<T = void> = {
  [K in keyof nodes.RegisteredNodes as K extends `${infer KWithoutNode}Node`
    ? `visit${Capitalize<KWithoutNode>}`
    : `visit${Capitalize<K>}`]: (node: nodes.RegisteredNodes[K]) => T;
};

export function visit<T>(node: nodes.Node, visitor: Visitor<T>): T {
  return visitor[getVisitFunctionName(node.kind)](node as any);
}

export function getVisitFunctionName(node: nodes.Node['kind']) {
  if (!nodes.REGISTERED_NODES_KEYS.includes(node)) {
    throw new KinobiError(`Unrecognized node [${node}]`);
  }

  return `visit${pascalCase(
    node.slice(0, -4)
  )}` as typeof node extends `${infer KWithoutNode}Node`
    ? `visit${Capitalize<KWithoutNode>}`
    : `visit${Capitalize<typeof node>}`;
}
