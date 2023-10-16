import * as nodes from '../../../nodes';
import { pascalCase } from '../../../shared';
import { Fragment, fragment } from './common';

export function getInstructionAccountTypeParamFragment(
  instructionAccountNode: nodes.InstructionAccountNode,
  programNode: nodes.ProgramNode
): Fragment {
  const typeParam = `TAccount${pascalCase(instructionAccountNode.name)}`;

  if (instructionAccountNode.defaultsTo?.kind === 'publicKey') {
    return fragment(
      `${typeParam} extends string = "${instructionAccountNode.defaultsTo.publicKey}"`
    );
  }

  if (instructionAccountNode.defaultsTo?.kind === 'program') {
    return fragment(
      `${typeParam} extends string = "${instructionAccountNode.defaultsTo.program.publicKey}"`
    );
  }

  if (instructionAccountNode.defaultsTo?.kind === 'programId') {
    return fragment(`${typeParam} extends string = "${programNode.publicKey}"`);
  }

  return fragment(`${typeParam} extends string = string`);
}
