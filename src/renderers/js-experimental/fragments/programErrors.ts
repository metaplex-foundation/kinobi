import * as nodes from '../../../nodes';
import { NameApi } from '../nameTransformers';
import { Fragment, fragmentFromTemplate } from './common';

export function getProgramErrorsFragment(scope: {
  programNode: nodes.ProgramNode;
  nameApi: NameApi;
}): Fragment {
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
