import { ImportFrom, MainCaseString, mainCase } from '../../shared';
import { AccountValueNode } from './AccountValueNode';
import { ArgumentValueNode } from './ArgumentValueNode';

export type ResolverValueNode = {
  readonly kind: 'resolverValueNode';

  // Children.
  readonly dependsOn?: (AccountValueNode | ArgumentValueNode)[];

  // Data.
  readonly name: MainCaseString;
  readonly importFrom?: ImportFrom;
};

export function resolverValueNode(
  name: string,
  options: {
    importFrom?: ResolverValueNode['importFrom'];
    dependsOn?: ResolverValueNode['dependsOn'];
  } = {}
): ResolverValueNode {
  return {
    kind: 'resolverValueNode',
    name: mainCase(name),
    importFrom: options.importFrom,
    dependsOn: options.dependsOn,
  };
}
