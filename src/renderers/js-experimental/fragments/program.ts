import { ProgramNode } from '../../../nodes';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragmentFromTemplate } from './common';

export function getProgramFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi'> & {
    programNode: ProgramNode;
  }
): Fragment {
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
    .addImports('solanaPrograms', ['Program']);

  if (programNode.errors.length > 0) {
    programFragment
      .addImports('solanaPrograms', ['ProgramWithErrors'])
      .addImports('generatedErrors', [
        programErrorClass,
        programErrorCode,
        programGetErrorFromCodeFunction,
      ]);
  }

  return programFragment;
}
