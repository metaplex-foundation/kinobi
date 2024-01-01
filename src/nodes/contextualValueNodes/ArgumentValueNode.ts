import { MainCaseString, mainCase } from '../../shared';

export type ArgumentValueNode = {
  readonly kind: 'argumentValueNode';
  readonly name: MainCaseString;
};

export function argumentValueNode(name: string): ArgumentValueNode {
  return { kind: 'argumentValueNode', name: mainCase(name) };
}
