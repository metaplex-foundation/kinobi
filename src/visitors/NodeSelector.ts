import * as nodes from '../nodes';
import { mainCase } from '../utils';
import type { NodeStack } from './NodeStack';

export type NodeSelector =
  | {
      type: nodes.Node['nodeClass'] | '*';
      name?: string;
      stack?: string | string[];
      program?: string;
    }
  | NodeSelectorFunction;

export type NodeSelectorFunction = (
  node: nodes.Node,
  stack: NodeStack,
  program: nodes.ProgramNode | null
) => boolean;

export const toNodeSelectorFunction = (
  selector: NodeSelector
): NodeSelectorFunction => {
  if (typeof selector === 'function') return selector;

  const checkType: NodeSelectorFunction = (node) => {
    if (!selector.type || selector.type === '*') return true;
    return selector.type === node.nodeClass;
  };

  const checkName: NodeSelectorFunction = (node) => {
    if (selector.name === undefined) return true;
    return mainCase(selector.name) === (node as { name?: string }).name;
  };

  const checkStack: NodeSelectorFunction = (node, stack) => {
    if (selector.stack === undefined) return true;
    const selectorStack = Array.isArray(selector.stack)
      ? selector.stack
      : selector.stack.split('.');
    return stack.matchesWithNames(selectorStack);
  };

  const checkProgram: NodeSelectorFunction = (node, stack, program) => {
    if (selector.program === undefined) return true;
    return !!program && mainCase(selector.program) === program.name;
  };

  return (node, stack, program) =>
    checkType(node, stack, program) &&
    checkName(node, stack, program) &&
    checkStack(node, stack, program) &&
    checkProgram(node, stack, program);
};
