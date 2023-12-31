import { ImportFrom, MainCaseString, mainCase } from '../../shared';

export type ProgramLinkNode = {
  readonly kind: 'programLinkNode';
  readonly name: MainCaseString;
  readonly importFrom?: ImportFrom;
};

export function programLinkNode(
  name: string,
  importFrom?: ImportFrom
): ProgramLinkNode {
  return {
    kind: 'programLinkNode',
    name: mainCase(name),
    importFrom,
  };
}
