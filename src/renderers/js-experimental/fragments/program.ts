import { ProgramNode } from '../../../nodes';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragmentFromTemplate } from './common';

export function getProgramFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi'> & {
    programNode: ProgramNode;
  }
): Fragment {
  const { programNode, nameApi } = scope;
  const programErrorCode = nameApi.programErrorCodeEnum(programNode.name);

  return fragmentFromTemplate('program.njk', {
    program: programNode,
    programAddressConstant: nameApi.programAddressConstant(programNode.name),
    programErrorCode,
  }).addImports('solanaAddresses', ['Address']);
}
