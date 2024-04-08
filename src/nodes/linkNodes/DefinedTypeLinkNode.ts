import { ImportFrom, MainCaseString, mainCase } from '../../shared';

export interface DefinedTypeLinkNode {
  readonly kind: 'definedTypeLinkNode';

  // Data.
  readonly name: MainCaseString;
  readonly importFrom?: ImportFrom;
}

export function definedTypeLinkNode(
  name: string,
  importFrom?: ImportFrom
): DefinedTypeLinkNode {
  return {
    kind: 'definedTypeLinkNode',
    name: mainCase(name),
    importFrom,
  };
}
