import { MainCaseString, mainCase } from '../../shared';

export type FieldDiscriminatorNode = {
  readonly kind: 'fieldDiscriminatorNode';

  // Data.
  readonly name: MainCaseString;
  readonly offset: number;
};

export function fieldDiscriminatorNode(
  name: string,
  offset: number = 0
): FieldDiscriminatorNode {
  return { kind: 'fieldDiscriminatorNode', name: mainCase(name), offset };
}
