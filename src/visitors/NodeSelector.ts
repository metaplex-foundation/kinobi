import * as nodes from '../nodes';
import type { NodeStack } from './NodeStack';

export type NodeSelectorType =
  | 'program'
  | 'instruction'
  | 'account'
  | 'definedType'
  | 'error'
  | 'typeDefinedLink'
  | 'typeLeaf';

export type NodeSelector =
  | {
      type: NodeSelectorType | '*';
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
    switch (selector.type) {
      case 'program':
        return nodes.isProgramNode(node);
      case 'instruction':
        return nodes.isInstructionNode(node);
      case 'account':
        return nodes.isAccountNode(node);
      case 'definedType':
        return nodes.isDefinedTypeNode(node);
      case 'error':
        return nodes.isErrorNode(node);
      case 'typeDefinedLink':
        return nodes.isTypeDefinedLinkNode(node);
      case 'typeLeaf':
        return nodes.isTypeLeafNode(node);
      case '*':
      default:
        return true;
    }
  };

  const checkName: NodeSelectorFunction = (node) => {
    if (selector.name === undefined) return true;
    return selector.name === (node as { name?: string }).name;
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
    return !!program && selector.program === program.name;
  };

  return (node, stack, program) =>
    checkType(node, stack, program) &&
    checkName(node, stack, program) &&
    checkStack(node, stack, program) &&
    checkProgram(node, stack, program);
};
