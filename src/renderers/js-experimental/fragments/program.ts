import * as nodes from '../../../nodes';
import { pascalCase, snakeCase } from '../../../shared';
import { Fragment, fragmentFromTemplate } from './common';

export function getProgramFragment(programNode: nodes.ProgramNode): Fragment {
  const programAddressConstant = `${snakeCase(
    programNode.name
  ).toUpperCase()}_PROGRAM_ADDRESS`;
  const programErrorName = `${pascalCase(programNode.name)}ProgramError`;

  const programFragment = fragmentFromTemplate('program.njk', {
    program: programNode,
    programAddressConstant,
    programErrorName,
  })
    .addImports('solanaAddresses', ['Address'])
    .addImports('shared', ['Program', 'getProgramAddress', 'Context']);

  if (programNode.errors.length > 0) {
    programFragment
      .addImports('shared', ['ProgramWithErrors'])
      .addImports('generatedErrors', [
        programErrorName,
        `${programErrorName}Code`,
        `get${programErrorName}FromCode`,
      ]);
  }

  return programFragment;
}
