import * as nodes from '../nodes';

export type NodeSelector =
  | { program: string }
  | { instruction: string; program?: string }
  | { account: string; program?: string }
  | { type: string; program?: string }
  | { typeLink: string; program?: string }
  | { error: string; program?: string }
  | NodeSelectorFunction;

export type NodeSelectorFunction = (
  node: nodes.Node,
  stack: nodes.Node[],
  program: nodes.ProgramNode | null
) => boolean;

export const toNodeSelectorFunction = (
  selector: NodeSelector
): NodeSelectorFunction => {
  if (typeof selector === 'function') return selector;

  const checkProgram: NodeSelectorFunction = (node, stack, program) =>
    'program' in selector
      ? !!(program && selector.program === program.metadata.name)
      : true;

  if ('instruction' in selector) {
    return (node, stack, program) =>
      nodes.isInstructionNode(node) &&
      node.name === selector.instruction &&
      checkProgram(node, stack, program);
  }

  if ('account' in selector) {
    return (node, stack, program) =>
      nodes.isAccountNode(node) &&
      node.name === selector.account &&
      checkProgram(node, stack, program);
  }

  if ('type' in selector) {
    return (node, stack, program) =>
      nodes.isDefinedTypeNode(node) &&
      node.name === selector.type &&
      checkProgram(node, stack, program);
  }

  if ('typeLink' in selector) {
    return (node, stack, program) =>
      nodes.isTypeDefinedLinkNode(node) &&
      node.definedType === selector.typeLink &&
      checkProgram(node, stack, program);
  }

  if ('error' in selector) {
    return (node, stack, program) =>
      nodes.isErrorNode(node) &&
      node.name === selector.error &&
      checkProgram(node, stack, program);
  }

  return (node) =>
    nodes.isProgramNode(node) && node.metadata.name === selector.program;
};
