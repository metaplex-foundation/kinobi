import {
  InstructionAccountNode,
  InstructionNode,
  ProgramNode,
} from '../../../nodes';
import { InstructionAccountDefault, pascalCase } from '../../../shared';
import { ImportMap } from '../ImportMap';
import { Fragment, fragment } from './common';

export function getInstructionAccountTypeParamFragment(scope: {
  instructionNode: InstructionNode;
  instructionAccountNode: InstructionAccountNode;
  programNode: ProgramNode;
  allowAccountMeta: boolean;
}): Fragment {
  const {
    instructionNode,
    instructionAccountNode,
    programNode,
    allowAccountMeta,
  } = scope;
  const typeParam = `TAccount${pascalCase(instructionAccountNode.name)}`;
  const accountMeta = allowAccountMeta ? ' | IAccountMeta<string>' : '';
  const imports = new ImportMap();
  if (allowAccountMeta) {
    imports.add('solanaInstructions', 'IAccountMeta');
  }

  if (
    instructionNode.optionalAccountStrategy === 'omitted' &&
    instructionAccountNode.isOptional
  ) {
    return fragment(
      `${typeParam} extends string${accountMeta} | undefined = undefined`,
      imports
    );
  }

  const defaultAddress = getDefaultAddress(
    instructionAccountNode.defaultsTo,
    programNode.publicKey
  );

  return fragment(
    `${typeParam} extends string${accountMeta} = ${defaultAddress}`,
    imports
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
