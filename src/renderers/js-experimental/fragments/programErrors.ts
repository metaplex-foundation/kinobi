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
    programErrorClass: nameApi.programErrorClass(programNode.name),
    programErrorCodeEnum: nameApi.programErrorCodeEnum(programNode.name),
    programErrorCodeMap: nameApi.programErrorCodeMap(programNode.name),
    programGetErrorFromCodeFunction: nameApi.programGetErrorFromCodeFunction(
      programNode.name
    ),
  });
}
