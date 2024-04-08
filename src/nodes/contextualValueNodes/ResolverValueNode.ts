import { ImportFrom, MainCaseString, mainCase } from '../../shared';
import { AccountValueNode } from './AccountValueNode';
import { ArgumentValueNode } from './ArgumentValueNode';

export interface ResolverValueNode<
  TDependsOn extends (AccountValueNode | ArgumentValueNode)[] = (
    | AccountValueNode
    | ArgumentValueNode
  )[],
> {
  readonly kind: 'resolverValueNode';

  // Children.
  readonly dependsOn?: TDependsOn;

  // Data.
  readonly name: MainCaseString;
  readonly importFrom?: ImportFrom;
}

export function resolverValueNode<
  const TDependsOn extends (AccountValueNode | ArgumentValueNode)[] = [],
>(
  name: string,
  options: {
    importFrom?: ResolverValueNode['importFrom'];
    dependsOn?: TDependsOn;
  } = {}
): ResolverValueNode<TDependsOn> {
  return {
    kind: 'resolverValueNode',
    name: mainCase(name),
    importFrom: options.importFrom,
    dependsOn: options.dependsOn,
  };
}
