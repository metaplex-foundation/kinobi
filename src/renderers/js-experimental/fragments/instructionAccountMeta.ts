import * as nodes from '../../../nodes';
import { pascalCase } from '../../../shared';
import { Fragment, fragment } from './common';

export function getInstructionAccountMetaFragment(
  instructionAccountNode: nodes.InstructionAccountNode
): Fragment {
  const typeParam = `TAccount${pascalCase(instructionAccountNode.name)}`;

  // Writable, optional signer.
  if (
    instructionAccountNode.isSigner === 'either' &&
    instructionAccountNode.isWritable
  ) {
    return fragment(
      `WritableSignerAccount<${typeParam}> | WritableAccount<${typeParam}>`
    ).addImports('solanaInstructions', [
      'WritableSignerAccount',
      'WritableAccount',
    ]);
  }

  // Readonly, optional signer.
  if (instructionAccountNode.isSigner === 'either') {
    return fragment(
      `ReadonlySignerAccount<${typeParam}> | ReadonlyAccount<${typeParam}>`
    ).addImports('solanaInstructions', [
      'ReadonlySignerAccount',
      'ReadonlyAccount',
    ]);
  }

  // Writable, signer.
  if (instructionAccountNode.isSigner && instructionAccountNode.isWritable) {
    return fragment(`WritableSignerAccount<${typeParam}>`).addImports(
      'solanaInstructions',
      'WritableSignerAccount'
    );
  }

  // Readonly, signer.
  if (instructionAccountNode.isSigner) {
    return fragment(`ReadonlySignerAccount<${typeParam}>`).addImports(
      'solanaInstructions',
      'ReadonlySignerAccount'
    );
  }

  // Writable, non-signer.
  if (instructionAccountNode.isWritable) {
    return fragment(`WritableAccount<${typeParam}>`).addImports(
      'solanaInstructions',
      'WritableAccount'
    );
  }

  // Readonly, non-signer.
  return fragment(`ReadonlyAccount<${typeParam}>`).addImports(
    'solanaInstructions',
    'ReadonlyAccount'
  );
}
