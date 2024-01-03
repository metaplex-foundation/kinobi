import {
  InstructionNode,
  InstructionRemainingAccountsNode,
  isNode,
} from '../../../nodes';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import {
  Fragment,
  fragment,
  fragmentFromTemplate,
  mergeFragments,
} from './common';

export function getInstructionRemainingAccountsFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi' | 'asyncResolvers'> & {
    instructionNode: InstructionNode;
    useAsync: boolean;
  }
): Fragment {
  const { remainingAccounts } = scope.instructionNode;
  const fragments = (remainingAccounts ?? []).flatMap((r) =>
    getSingleFragment(r, scope)
  );
  if (fragments.length === 0) return fragment('');
  return mergeFragments(
    fragments,
    (r) =>
      `// Remaining accounts.\n` +
      `const remainingAccounts: IAccountMeta[] = [...${r.join(', ...')}]`
  );
}

function getSingleFragment(
  remainingAccounts: InstructionRemainingAccountsNode,
  scope: Pick<GlobalFragmentScope, 'nameApi' | 'asyncResolvers'> & {
    instructionNode: InstructionNode;
    useAsync: boolean;
  }
): Fragment[] {
  const isAsync =
    isNode(remainingAccounts.value, 'resolverValueNode') &&
    scope.asyncResolvers.includes(remainingAccounts.value.name);
  if (!scope.useAsync && isAsync) return [];

  const remainingAccountsFragment = fragmentFromTemplate(
    'instructionRemainingAccounts.njk',
    {
      remainingAccounts,
      awaitKeyword: scope.useAsync && isAsync ? 'await ' : '',
      nameApi: scope.nameApi,
    }
  ).addImports('solanaInstructions', ['IAccountMeta']);

  if (isNode(remainingAccounts.value, 'argumentValueNode')) {
    remainingAccountsFragment.addImports('solanaInstructions', ['AccountRole']);
  } else {
    const functionName = scope.nameApi.resolverFunction(
      remainingAccounts.value.name
    );
    remainingAccountsFragment
      .addImports(remainingAccounts.value.importFrom ?? 'hooked', functionName)
      .addFeatures(['instruction:resolverScopeVariable']);
  }

  return [remainingAccountsFragment];
}
