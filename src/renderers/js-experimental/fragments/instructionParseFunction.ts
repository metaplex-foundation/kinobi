import { InstructionNode, ProgramNode } from '../../../nodes';
import { TypeManifest } from '../TypeManifest';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getInstructionParseFunctionFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi'> & {
    instructionNode: InstructionNode;
    programNode: ProgramNode;
    dataArgsManifest: TypeManifest;
  }
): Fragment {
  const { instructionNode, programNode, dataArgsManifest, nameApi } = scope;
  const hasAccounts = instructionNode.accounts.length > 0;
  const hasOptionalAccounts = instructionNode.accounts.some(
    (account) => account.isOptional
  );
  const minimumNumberOfAccounts =
    instructionNode.optionalAccountStrategy === 'omitted'
      ? instructionNode.accounts.filter((account) => !account.isOptional).length
      : instructionNode.accounts.length;
  const hasData =
    !!instructionNode.dataArgs.link ||
    instructionNode.dataArgs.struct.fields.length > 0;

  if (!hasAccounts && !hasData) {
    return fragment('');
  }

  const dataTypeFragment = fragment(
    instructionNode.dataArgs.link
      ? dataArgsManifest.strictType.render
      : nameApi.dataType(instructionNode.dataArgs.name)
  );
  const decoderFunction = instructionNode.dataArgs.link
    ? dataArgsManifest.decoder.render
    : `${nameApi.decoderFunction(instructionNode.dataArgs.name)}()`;
  if (instructionNode.dataArgs.link) {
    dataTypeFragment.mergeImportsWith(
      dataArgsManifest.strictType,
      dataArgsManifest.decoder
    );
  }

  return fragmentFromTemplate('instructionParseFunction.njk', {
    instruction: instructionNode,
    programAddress: programNode.publicKey,
    instructionParsedType: nameApi.instructionParsedType(instructionNode.name),
    instructionParseFunction: nameApi.instructionParseFunction(
      instructionNode.name
    ),
    dataTypeFragment,
    decoderFunction,
    hasAccounts,
    hasOptionalAccounts,
    minimumNumberOfAccounts,
    hasData,
  })
    .mergeImportsWith(dataTypeFragment)
    .addImports('solanaInstructions', ['IInstruction'])
    .addImports(
      'solanaInstructions',
      hasAccounts ? ['IInstructionWithAccounts', 'IAccountMeta'] : []
    )
    .addImports('solanaInstructions', hasData ? ['IInstructionWithData'] : []);
}
