import * as nodes from '../../../nodes';
import { pascalCase } from '../../../shared';
import { Fragment, fragmentFromTemplate } from './common';

export function getProgramErrorsFragment(
  programNode: nodes.ProgramNode
): Fragment {
  const programErrorName = `${pascalCase(programNode.name)}ProgramError`;

  return fragmentFromTemplate('programErrors.njk', {
    errors: programNode.errors,
    programErrorName,
  });
}
