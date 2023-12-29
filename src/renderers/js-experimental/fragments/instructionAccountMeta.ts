import { InstructionAccountNode } from '../../../nodes';
import { pascalCase } from '../../../shared';
import { Fragment, fragment } from './common';

export function getInstructionAccountMetaFragment(
  instructionAccountNode: InstructionAccountNode,
  withSigners: boolean
): Fragment {
  const typeParam = `TAccount${pascalCase(instructionAccountNode.name)}`;

  // Writable, signer.
  if (
    instructionAccountNode.isSigner === true &&
    instructionAccountNode.isWritable
  ) {
    return fragment(
      withSigners
        ? `WritableSignerAccount<${typeParam}> & IAccountSignerMeta<${typeParam}>`
        : `WritableSignerAccount<${typeParam}>`
    )
      .addImports('solanaInstructions', ['WritableSignerAccount'])
      .addImports('solanaSigners', withSigners ? ['IAccountSignerMeta'] : []);
  }

  // Readonly, signer.
  if (instructionAccountNode.isSigner === true) {
    return fragment(
      withSigners
        ? `ReadonlySignerAccount<${typeParam}> & IAccountSignerMeta<${typeParam}>`
        : `ReadonlySignerAccount<${typeParam}>`
    )
      .addImports('solanaInstructions', ['ReadonlySignerAccount'])
      .addImports('solanaSigners', withSigners ? ['IAccountSignerMeta'] : []);
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
