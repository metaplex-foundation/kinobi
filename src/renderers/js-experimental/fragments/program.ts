import * as nodes from '../../../nodes';
import { NameApi } from '../nameTransformers';
import { Fragment, fragmentFromTemplate } from './common';

export function getProgramFragment(scope: {
  programNode: nodes.ProgramNode;
  nameApi: NameApi;
}): Fragment {
  const { programNode, nameApi } = scope;
  const programErrorClass = nameApi.programErrorClass(programNode.name);
  const programErrorCode = nameApi.programErrorCodeEnum(programNode.name);
  const programGetErrorFromCodeFunction =
    nameApi.programGetErrorFromCodeFunction(programNode.name);

  const programFragment = fragmentFromTemplate('program.njk', {
    program: programNode,
    programType: nameApi.programType(programNode.name),
    programAddressConstant: nameApi.programAddressConstant(programNode.name),
    programCreateFunction: nameApi.programCreateFunction(programNode.name),
    programErrorClass,
    programErrorCode,
    programGetErrorFromCodeFunction,
  })
    .addImports('solanaAddresses', ['Address'])
    .addImports('shared', ['Program']);

  if (programNode.errors.length > 0) {
    programFragment
      .addImports('shared', ['ProgramWithErrors'])
      .addImports('generatedErrors', [
        programErrorClass,
        programErrorCode,
        programGetErrorFromCodeFunction,
      ]);
  }

  return programFragment;
}
