import { camelCase } from '../../../shared';
import {
  InstructionNode,
  InstructionRemainingAccountsNode,
  assertIsNode,
  isNode,
} from '../../../nodes';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragment, mergeFragments } from './common';

export function getInstructionRemainingAccountsFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi' | 'asyncResolvers'> & {
    instructionNode: InstructionNode;
    useAsync: boolean;
  }
): Fragment {
  const { remainingAccounts } = scope.instructionNode;
  const fragments = (remainingAccounts ?? []).flatMap((r) =>
    getRemainingAccountsFragment(r, scope)
  );
  if (fragments.length === 0) return fragment('');
  return mergeFragments(
    fragments,
    (r) =>
      `// Remaining accounts.\n` +
      `const remainingAccounts: IAccountMeta[] = [...${r.join(', ...')}]`
  ).addImports('solanaInstructions', ['IAccountMeta']);
}

function getRemainingAccountsFragment(
  remainingAccounts: InstructionRemainingAccountsNode,
  scope: Pick<GlobalFragmentScope, 'nameApi' | 'asyncResolvers'> & {
    instructionNode: InstructionNode;
    useAsync: boolean;
  }
): Fragment[] {
  const remainingAccountsFragment = ((): Fragment | null => {
    if (isNode(remainingAccounts.value, 'argumentValueNode')) {
      return getArgumentValueNodeFragment(remainingAccounts);
    }
    if (isNode(remainingAccounts.value, 'resolverValueNode')) {
      return getResolverValueNodeFragment(remainingAccounts, scope);
    }
    return null;
  })();

  if (remainingAccountsFragment === null) return [];
  return [remainingAccountsFragment];
}

function getArgumentValueNodeFragment(
  remainingAccounts: InstructionRemainingAccountsNode
): Fragment {
  assertIsNode(remainingAccounts.value, 'argumentValueNode');
  const argumentName = camelCase(remainingAccounts.value.name);
  const isWritable = remainingAccounts.isWritable ?? false;
  const nonSignerRole = isWritable
    ? 'AccountRole.WRITABLE'
    : 'AccountRole.READONLY';
  const signerRole = isWritable
    ? 'AccountRole.WRITABLE_SIGNER'
    : 'AccountRole.READONLY_SIGNER';
  const role = remainingAccounts.isSigner === true ? signerRole : nonSignerRole;
  return fragment(
    `args.${argumentName}.map((address) => ({ address, role: ${role} }))`
  ).addImports('solanaInstructions', ['AccountRole']);
}

function getResolverValueNodeFragment(
  remainingAccounts: InstructionRemainingAccountsNode,
  scope: Pick<GlobalFragmentScope, 'nameApi' | 'asyncResolvers'> & {
    useAsync: boolean;
  }
): Fragment | null {
  assertIsNode(remainingAccounts.value, 'resolverValueNode');
  const isAsync = scope.asyncResolvers.includes(remainingAccounts.value.name);
  if (!scope.useAsync && isAsync) return null;

  const awaitKeyword = scope.useAsync && isAsync ? 'await ' : '';
  const functionName = scope.nameApi.resolverFunction(
    remainingAccounts.value.name
  );
  return fragment(`${awaitKeyword}${functionName}(resolverScope)`)
    .addImports(remainingAccounts.value.importFrom ?? 'hooked', functionName)
    .addFeatures(['instruction:resolverScopeVariable']);
}
