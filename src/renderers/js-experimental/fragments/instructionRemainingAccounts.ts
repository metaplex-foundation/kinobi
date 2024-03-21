import { camelCase } from '../../../shared';
import {
  InstructionNode,
  InstructionRemainingAccountsNode,
  assertIsNode,
  getAllInstructionArguments,
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
      `const remainingAccounts: IAccountMeta[] = ${
        r.length === 1 ? r[0] : `[...${r.join(', ...')}]`
      }`
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
      return getArgumentValueNodeFragment(remainingAccounts, scope);
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
  remainingAccounts: InstructionRemainingAccountsNode,
  scope: { instructionNode: InstructionNode }
): Fragment {
  const { instructionNode } = scope;
  assertIsNode(remainingAccounts.value, 'argumentValueNode');
  const argumentName = camelCase(remainingAccounts.value.name);
  const isWritable = remainingAccounts.isWritable ?? false;
  const nonSignerRole = isWritable
    ? 'AccountRole.WRITABLE'
    : 'AccountRole.READONLY';
  const signerRole = isWritable
    ? 'AccountRole.WRITABLE_SIGNER'
    : 'AccountRole.READONLY_SIGNER';

  // If the argument already exists, it should be of type `Address[]`.
  const allArguments = getAllInstructionArguments(instructionNode);
  if (allArguments.some((arg) => arg.name === remainingAccounts.value.name)) {
    const role =
      remainingAccounts.isSigner === true ? signerRole : nonSignerRole;
    return fragment(
      `args.${argumentName}.map((address) => ({ address, role: ${role} }))`
    ).addImports('solanaInstructions', ['AccountRole']);
  }

  // Otherwise, it may be of type `TransactionSigner[]`.
  throw new Error('Not implemented');
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
