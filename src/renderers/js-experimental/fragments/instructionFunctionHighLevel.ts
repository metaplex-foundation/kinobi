import * as nodes from '../../../nodes';
import { camelCase, pascalCase } from '../../../shared';
import {
  Fragment,
  fragment,
  fragmentFromTemplate,
  mergeFragments,
} from './common';
import { getInstructionAccountTypeParamFragment } from './instructionAccountTypeParam';

export function getInstructionFunctionHighLevelFragment(
  instructionNode: nodes.InstructionNode,
  programNode: nodes.ProgramNode
): Fragment {
  const hasAccounts = instructionNode.accounts.length > 0;
  const typeParamsFragment = getTypeParams(instructionNode, programNode);
  const instructionTypeFragment = getInstructionType(instructionNode);

  const functionFragment = fragmentFromTemplate(
    'instructionFunctionHighLevel.njk',
    {
      instruction: instructionNode,
      program: programNode,
      typeParams: typeParamsFragment.render,
      instructionType: instructionTypeFragment.render,
    }
  )
    .mergeImportsWith(typeParamsFragment, instructionTypeFragment)
    .addImports('shared', ['WrappedInstruction']);

  if (hasAccounts) {
    //
  }

  return functionFragment;
}

function getTypeParams(
  instructionNode: nodes.InstructionNode,
  programNode: nodes.ProgramNode
): Fragment {
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
  return accountTypeParamsFragment.mapRender((r) =>
    [programTypeParam, r].filter((x) => !!x).join(', ')
  );
}

function getInstructionType(instructionNode: nodes.InstructionNode): Fragment {
  const instructionTypeName = pascalCase(`${instructionNode.name}Instruction`);
  const accountTypeParamsFragments = instructionNode.accounts.map((account) => {
    const typeParam = `TAccount${pascalCase(account.name)}`;
    const camelName = camelCase(account.name);
    if (account.isSigner === 'either') {
      const role = account.isWritable
        ? 'WritableSignerAccount'
        : 'ReadonlySignerAccount';
      return fragment(
        `typeof input["${camelName}"] extends Signer<${typeParam}> ? ${role}<${typeParam}> : ${typeParam}`
      ).addImports('solanaInstructions', [role]);
    }

    return fragment(typeParam);
  });

  return mergeFragments(
    [fragment('TProgram'), ...accountTypeParamsFragments],
    (renders) => renders.join(', ')
  ).mapRender((r) => `${instructionTypeName}<${r}>`);
}
