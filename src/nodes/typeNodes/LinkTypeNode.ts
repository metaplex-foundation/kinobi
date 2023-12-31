import { ImportFrom, MainCaseString, mainCase } from '../../shared';

export type LinkTypeNode = {
  readonly kind: 'linkTypeNode';
  readonly name: MainCaseString;
  readonly importFrom: ImportFrom;
  readonly size?: number;
};

export function linkTypeNode(
  name: string,
  options: {
    readonly importFrom?: ImportFrom;
    readonly size?: number;
  } = {}
): LinkTypeNode {
  return {
    kind: 'linkTypeNode',
    name: mainCase(name),
    importFrom: options.importFrom ?? 'generated',
    size: options.size,
  };
}
