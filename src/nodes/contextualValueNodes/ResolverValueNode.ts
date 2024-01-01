import { ImportFrom, MainCaseString, mainCase } from '../../shared';
import { AccountValueNode } from './AccountValueNode';
import { ArgumentValueNode } from './ArgumentValueNode';

export type ResolverValueNode = {
  readonly kind: 'resolverValueNode';
  readonly name: MainCaseString;
  readonly importFrom?: ImportFrom;
  readonly dependsOn?: (AccountValueNode | ArgumentValueNode)[];
};

export function resolverValueNode(
  name: string,
  options: {
    importFrom?: ResolverValueNode['importFrom'];
    dependsOn?: ResolverValueNode['dependsOn'];
  } = {}
): ResolverValueNode {
  return { kind: 'resolverValueNode', name: mainCase(name), ...options };
}
