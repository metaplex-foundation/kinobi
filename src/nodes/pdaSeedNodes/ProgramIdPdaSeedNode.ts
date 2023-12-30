import { Node } from '../Node';

export type ProgramIdPdaSeedNode = {
  readonly kind: 'programIdPdaSeedNode';
};

export function programIdPdaSeedNode(): ProgramIdPdaSeedNode {
  return { kind: 'programIdPdaSeedNode' };
}

export function isProgramIdPdaSeedNode(
  node: Node | null
): node is ProgramIdPdaSeedNode {
  return !!node && node.kind === 'programIdPdaSeedNode';
}

export function assertProgramIdPdaSeedNode(
  node: Node | null
): asserts node is ProgramIdPdaSeedNode {
  if (!isProgramIdPdaSeedNode(node)) {
    throw new Error(
      `Expected programIdPdaSeedNode, got ${node?.kind ?? 'null'}.`
    );
  }
}
