import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../shared';
import { PdaSeedNode } from './pdaSeedNodes';

export type PdaNode = {
  readonly kind: 'pdaNode';
  readonly name: MainCaseString;
  readonly seeds: PdaSeedNode[];
};

export function pdaNode(name: string, seeds: PdaSeedNode[]): PdaNode {
  if (!name) {
    throw new InvalidKinobiTreeError('PdaNode must have a name.');
  }
  return { kind: 'pdaNode', name: mainCase(name), seeds };
}
