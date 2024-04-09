import { MainCaseString, mainCase } from '../../shared';

export interface AccountValueNode {
  readonly kind: 'accountValueNode';

  // Data.
  readonly name: MainCaseString;
}

export function accountValueNode(name: string): AccountValueNode {
  return { kind: 'accountValueNode', name: mainCase(name) };
}
