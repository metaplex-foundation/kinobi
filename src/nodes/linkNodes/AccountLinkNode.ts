import { ImportFrom, MainCaseString, mainCase } from '../../shared';

export interface AccountLinkNode {
  readonly kind: 'accountLinkNode';

  // Data.
  readonly name: MainCaseString;
  readonly importFrom?: ImportFrom;
}

export function accountLinkNode(
  name: string,
  importFrom?: ImportFrom
): AccountLinkNode {
  return {
    kind: 'accountLinkNode',
    name: mainCase(name),
    importFrom,
  };
}
