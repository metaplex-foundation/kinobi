import { MainCaseString, mainCase } from '../../shared';
import { TypeNode } from '../typeNodes';

export interface VariablePdaSeedNode<TType extends TypeNode = TypeNode> {
  readonly kind: 'variablePdaSeedNode';

  // Children.
  readonly type: TType;

  // Data.
  readonly name: MainCaseString;
  readonly docs: string[];
}

export function variablePdaSeedNode<TType extends TypeNode>(
  name: string,
  type: TType,
  docs: string | string[] = []
): VariablePdaSeedNode<TType> {
  return {
    kind: 'variablePdaSeedNode',
    name: mainCase(name),
    type,
    docs: Array.isArray(docs) ? docs : [docs],
  };
}
