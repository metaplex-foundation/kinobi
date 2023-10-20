import * as nodes from '../../../nodes';
import { pascalCase, snakeCase } from '../../../shared';
import { Fragment, fragmentFromTemplate } from './common';

export function getProgramFragment(programNode: nodes.ProgramNode): Fragment {
  const programAddressConstant = `${snakeCase(
    programNode.name
  ).toUpperCase()}_PROGRAM_ADDRESS`;
  const programErrorName = `${pascalCase(programNode.name)}ProgramError`;

  return fragmentFromTemplate('program.njk', {
    program: programNode,
    programAddressConstant,
    programErrorName,
  })
    .addImports('solanaAddresses', ['Base58EncodedAddress'])
    .addImports('shared', ['Program', 'getProgramAddress']);

  // TODO: import {{ programErrorName }}Code and {{ programErrorName }} when program has errors.
}
