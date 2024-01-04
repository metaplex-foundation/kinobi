import { ProgramNode } from '../../../nodes';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragment } from './common';

export function getProgramAccountsFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi'> & {
    programNode: ProgramNode;
  }
): Fragment {
  const { programNode, nameApi } = scope;
  const programAccountsEnum = nameApi.programAccountsEnum(programNode.name);
  const programAccountsEnumVariants = programNode.accounts.map((account) =>
    nameApi.programAccountsEnumVariant(account.name)
  );
  const programAccountsEnumFragment = fragment(
    `export enum ${programAccountsEnum} { ` +
      `${programAccountsEnumVariants.join(', ')}` +
      ` }`
  );
  // const programAccountsIdentifierFunction =
  //   nameApi.programAccountsIdentifierFunction(programNode.name);

  return programAccountsEnumFragment;
}
