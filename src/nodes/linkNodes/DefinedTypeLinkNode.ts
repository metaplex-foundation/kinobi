import { ImportFrom, MainCaseString, mainCase } from '../../shared';

export type DefinedTypeLinkNode = {
  readonly kind: 'definedTypeLinkNode';
  readonly name: MainCaseString;
  readonly importFrom?: ImportFrom;
};

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
