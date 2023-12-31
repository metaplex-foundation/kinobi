import { ImportFrom, MainCaseString, mainCase } from '../../shared';

export type DefinedTypeLinkNode = {
  readonly kind: 'definedTypeLinkNode';
  readonly name: MainCaseString;
  readonly importFrom?: ImportFrom;
  readonly size?: number;
};

export function definedTypeLinkNode(
  name: string,
  importFrom?: ImportFrom,
  size?: number
): DefinedTypeLinkNode {
  return {
    kind: 'definedTypeLinkNode',
    name: mainCase(name),
    importFrom,
    size,
  };
}
