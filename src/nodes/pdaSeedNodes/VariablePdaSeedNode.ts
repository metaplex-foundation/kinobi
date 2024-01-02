import { MainCaseString, mainCase } from '../../shared';
import { TypeNode } from '../typeNodes';

export type VariablePdaSeedNode = {
  readonly kind: 'variablePdaSeedNode';

  // Children.
  readonly type: TypeNode;

  // Data.
  readonly name: MainCaseString;
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
