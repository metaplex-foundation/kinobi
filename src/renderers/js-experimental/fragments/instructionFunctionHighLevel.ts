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
  const functionName = camelCase(instructionNode.name);
  const typeParamsFragment = getTypeParams(instructionNode, programNode);
  const instructionTypeFragment = getInstructionType(instructionNode);
  const inputTypeFragment = getInputType(instructionNode);
  const context = `Pick<Context, 'getProgramAddress'>`; // TODO: use context map.
  const customGeneratedInstruction = `CustomGeneratedInstruction<${instructionTypeFragment.render}, TReturn>`;

  const functionFragment = fragmentFromTemplate(
    'instructionFunctionHighLevel.njk',
    {
      instruction: instructionNode,
      program: programNode,
      functionName,
      typeParams: typeParamsFragment.render,
      instructionType: instructionTypeFragment.render,
      inputType: inputTypeFragment.render,
      context,
      customGeneratedInstruction,
    }
  )
    .mergeImportsWith(
      typeParamsFragment,
      instructionTypeFragment,
      inputTypeFragment
    )
    .addImports('solanaAddresses', ['Base58EncodedAddress'])
    .addImports('shared', [
      'WrappedInstruction',
      'CustomGeneratedInstruction',
      'Context',
    ]);

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

function getInputType(instructionNode: nodes.InstructionNode): Fragment {
  const inputTypeName = pascalCase(`${instructionNode.name}Input`);
  if (instructionNode.accounts.length === 0) return fragment(inputTypeName);
  const accountTypeParams = instructionNode.accounts
    .map((account) => `TAccount${pascalCase(account.name)}`)
    .join(', ');

  return fragment(`${inputTypeName}<${accountTypeParams}>`);
}
