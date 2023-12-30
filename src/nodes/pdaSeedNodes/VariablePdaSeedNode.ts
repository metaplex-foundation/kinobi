import { MainCaseString, mainCase } from '../../shared';
import { Node } from '../Node';
import { TypeNode } from '../typeNodes';

export type VariablePdaSeedNode = {
  readonly kind: 'variablePdaSeedNode';
  readonly name: MainCaseString;
  readonly type: TypeNode;
  readonly docs: string[];
};

export function variablePdaSeedNode(
  name: string,
  type: TypeNode,
  docs: string[] = []
): VariablePdaSeedNode {
  return { kind: 'variablePdaSeedNode', name: mainCase(name), type, docs };
}

export function isVariablePdaSeedNode(
  node: Node | null
): node is VariablePdaSeedNode {
  return !!node && node.kind === 'variablePdaSeedNode';
}

export function assertVariablePdaSeedNode(
  node: Node | null
): asserts node is VariablePdaSeedNode {
  if (!isVariablePdaSeedNode(node)) {
    throw new Error(
      `Expected variablePdaSeedNode, got ${node?.kind ?? 'null'}.`
    );
  }
}
