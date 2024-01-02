import { ImportFrom, MainCaseString, mainCase } from '../../shared';

export type PdaLinkNode = {
  readonly kind: 'pdaLinkNode';

  // Data.
  readonly name: MainCaseString;
  readonly importFrom?: ImportFrom;
};

export function pdaLinkNode(
  name: string,
  importFrom?: ImportFrom
): PdaLinkNode {
  return {
    kind: 'pdaLinkNode',
    name: mainCase(name),
    importFrom,
  };
}
