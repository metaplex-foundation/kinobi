import { MainCaseString, mainCase } from '../../shared';

export type AccountValueNode = {
  readonly kind: 'accountValueNode';
  readonly name: MainCaseString;
};

export function accountValueNode(name: string): AccountValueNode {
  return { kind: 'accountValueNode', name: mainCase(name) };
}
