import * as nodes from '../../../nodes';
import { TypeManifest } from '../TypeManifest';
import { NameApi } from '../nameTransformers';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getInstructionParseFunctionFragment(scope: {
  instructionNode: nodes.InstructionNode;
  programNode: nodes.ProgramNode;
  dataArgsManifest: TypeManifest;
  nameApi: NameApi;
}): Fragment {
  const { instructionNode, programNode, dataArgsManifest, nameApi } = scope;
  const hasAccounts = instructionNode.accounts.length > 0;
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
    hasData,
  })
    .mergeImportsWith(dataTypeFragment)
    .addImports('solanaInstructions', ['IInstruction'])
    .addImports('solanaInstructions', hasData ? ['IInstructionWithData'] : []);
}
