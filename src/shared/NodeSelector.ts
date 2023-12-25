import * as nodes from '../nodes';
import { mainCase } from './utils';
import type { NodeStack } from './NodeStack';

export type NodeSelector = NodeSelectorPath | NodeSelectorFunction;

/**
 * A string that can be used to select a node in a Kinobi tree.
 * - `someText` matches the name of a node, if any.
 * - `[someNode]` matches a node of the given kind.
 * - `[someNode]someText` matches both the kind and the name of a node.
 * - `a.b.c` matches a node `c` such that its parent stack contains `a` and `b` in order (but not necessarily subsequent).
 * - `a.b.c.*` matches any node such that its parent stack contains `a`, `b` and `c` in order (but not necessarily subsequent).
 */
export type NodeSelectorPath = string;

export type NodeSelectorFunction = (
  node: nodes.Node,
  stack: NodeStack
) => boolean;

export const getNodeSelectorFunction = (
  selector: NodeSelector
): NodeSelectorFunction => {
  if (typeof selector === 'function') return selector;

  const checkNode = (node: nodes.Node, nodeSelector: string): boolean => {
    if (nodeSelector === '*') return true;
    const matches = nodeSelector.match(/^(?:\[([^\]]+)\])?(.*)?$/);
    if (!matches) return false;
    const [, kind, name] = matches;
    if (kind && mainCase(kind) !== node.kind) return false;
    if (name && (!('name' in node) || mainCase(name) !== node.name))
      return false;
    return true;
  };

  const checkStack = (
    nodeStack: nodes.Node[],
    nodeSelectors: string[]
  ): boolean => {
    if (nodeSelectors.length === 0) return true;
    if (nodeStack.length === 0) return false;
    const lastNode = nodeStack.pop() as nodes.Node;
    const lastNodeSelector = nodeSelectors.pop() as string;
    return checkNode(lastNode, lastNodeSelector)
      ? checkStack(nodeStack, nodeSelectors)
      : checkStack(nodeStack, [...nodeSelectors, lastNodeSelector]);
  };

  const nodeSelectors = selector.split('.');
  const lastNodeSelector = nodeSelectors.pop() as string;

  return (node, stack) =>
    checkNode(node, lastNodeSelector) &&
    checkStack(stack.all(), [...nodeSelectors]);
};
