import { ProgramNode } from '../../../nodes';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragmentFromTemplate } from './common';

export function getProgramErrorsFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi'> & {
    programNode: ProgramNode;
  }
): Fragment {
  const { programNode, nameApi } = scope;
  return fragmentFromTemplate('programErrors.njk', {
    errors: programNode.errors,
    programErrorUnion: nameApi.programErrorUnion(programNode.name),
    programErrorMessagesMap: nameApi.programErrorMessagesMap(programNode.name),
    programGetErrorMessageFunction: nameApi.programGetErrorMessageFunction(
      programNode.name
    ),
    getProgramErrorConstant: (name: string) =>
      nameApi.programErrorConstantPrefix(programNode.name) +
      nameApi.programErrorConstant(name),
  });
}
