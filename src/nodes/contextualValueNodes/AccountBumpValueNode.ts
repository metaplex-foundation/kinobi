import { MainCaseString, mainCase } from '../../shared';

export type AccountBumpValueNode = {
  readonly kind: 'accountBumpValueNode';

  // Data.
  readonly name: MainCaseString;
};

export function accountBumpValueNode(name: string): AccountBumpValueNode {
  return { kind: 'accountBumpValueNode', name: mainCase(name) };
}
