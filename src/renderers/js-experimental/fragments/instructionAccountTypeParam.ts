import * as nodes from '../../../nodes';
import { InstructionAccountDefault, pascalCase } from '../../../shared';
import { Fragment, fragment } from './common';

export function getInstructionAccountTypeParamFragment(
  instructionAccountNode: nodes.InstructionAccountNode,
  programNode: nodes.ProgramNode
): Fragment {
  const pascalCaseName = pascalCase(instructionAccountNode.name);
  const typeParam = `TAccount${pascalCaseName}`;
  const defaultAddress = getDefaultAddress(
    instructionAccountNode.defaultsTo,
    programNode.publicKey
  );

  return fragment(
    `${typeParam} extends string | IAccountMeta<string> = ${defaultAddress}`
  );
}

function getDefaultAddress(
  defaultsTo: InstructionAccountDefault | undefined,
  programId: string
): string {
  switch (defaultsTo?.kind) {
    case 'publicKey':
      return `"${defaultsTo.publicKey}"`;
    case 'program':
      return `"${defaultsTo.program.publicKey}"`;
    case 'programId':
      return `"${programId}"`;
    default:
      return `string`;
  }
}
