import * as nodes from '../../../nodes';
import { pascalCase } from '../../../shared';
import { Fragment, fragment } from './common';

export function getInstructionAccountMetaFragment(
  instructionAccountNode: nodes.InstructionAccountNode
): Fragment {
  const typeParam = `TAccount${pascalCase(instructionAccountNode.name)}`;

  // Writable, signer.
  if (
    instructionAccountNode.isSigner === true &&
    instructionAccountNode.isWritable
  ) {
    return fragment(`WritableSignerAccount<${typeParam}>`).addImports(
      'solanaInstructions',
      'WritableSignerAccount'
    );
  }

  // Readonly, signer.
  if (instructionAccountNode.isSigner === true) {
    return fragment(`ReadonlySignerAccount<${typeParam}>`).addImports(
      'solanaInstructions',
      'ReadonlySignerAccount'
    );
  }

  // Writable, non-signer or optional signer.
  if (instructionAccountNode.isWritable) {
    return fragment(`WritableAccount<${typeParam}>`).addImports(
      'solanaInstructions',
      'WritableAccount'
    );
  }

  // Readonly, non-signer or optional signer.
  return fragment(`ReadonlyAccount<${typeParam}>`).addImports(
    'solanaInstructions',
    'ReadonlyAccount'
  );
}
