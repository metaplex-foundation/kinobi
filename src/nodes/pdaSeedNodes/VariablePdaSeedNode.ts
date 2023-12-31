import { MainCaseString, mainCase } from '../../shared';
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
  docs: string | string[] = []
): VariablePdaSeedNode {
  return {
    kind: 'variablePdaSeedNode',
    name: mainCase(name),
    type,
    docs: Array.isArray(docs) ? docs : [docs],
  };
}
