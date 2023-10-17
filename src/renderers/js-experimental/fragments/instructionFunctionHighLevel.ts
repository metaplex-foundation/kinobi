import * as nodes from '../../../nodes';
import { Fragment, fragmentFromTemplate, mergeFragments } from './common';
import { getInstructionAccountTypeParamFragment } from './instructionAccountTypeParam';

export function getInstructionFunctionHighLevelFragment(
  instructionNode: nodes.InstructionNode,
  programNode: nodes.ProgramNode
): Fragment {
  const hasAccounts = instructionNode.accounts.length > 0;
  const accountTypeParamsFragment = mergeFragments(
    instructionNode.accounts.map((account) =>
      getInstructionAccountTypeParamFragment(
        instructionNode,
        account,
        programNode,
        false
      )
    ),
    (renders) => renders.join(', ')
  );
  const programTypeParam = `TProgram extends string = "${programNode.publicKey}"`;
  const typeParams = [programTypeParam, accountTypeParamsFragment.render]
    .filter((x) => !!x)
    .join(', ');

  const fragment = fragmentFromTemplate('instructionFunctionHighLevel.njk', {
    instruction: instructionNode,
    program: programNode,
    typeParams,
  })
    .mergeImportsWith(accountTypeParamsFragment)
    .addImports('solanaAddresses', ['Base58EncodedAddress']);

  if (hasAccounts) {
    //
  }

  return fragment;
}
