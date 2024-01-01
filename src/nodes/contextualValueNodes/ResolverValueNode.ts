import { ImportFrom, MainCaseString, mainCase } from '../../shared';

export type ResolverValueNode = {
  readonly kind: 'resolverValueNode';
  readonly name: MainCaseString;
  readonly importFrom?: ImportFrom;
};

export function resolverValueNode(
  name: string,
  importFrom?: ImportFrom
): ResolverValueNode {
  return { kind: 'resolverValueNode', name: mainCase(name), importFrom };
}
