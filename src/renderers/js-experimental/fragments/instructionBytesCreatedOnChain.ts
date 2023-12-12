import * as nodes from '../../../nodes';
import { camelCase, pascalCase } from '../../../shared';
import { Fragment, fragmentFromTemplate } from './common';

export function getInstructionBytesCreatedOnChainFragment(scope: {
  instructionNode: nodes.InstructionNode;
  argObject?: string;
}): Fragment {
  const bytes = scope.instructionNode.bytesCreatedOnChain;
  const bytesFragment = fragmentFromTemplate(
    'instructionBytesCreatedOnChain.njk',
    { bytes, argObject: scope.argObject ?? 'args' }
  );

  if (bytes && 'includeHeader' in bytes && bytes.includeHeader) {
    bytesFragment.addImports('solanaAccounts', 'BASE_ACCOUNT_SIZE');
  }

  if (bytes?.kind === 'account') {
    const importFrom =
      bytes.importFrom === 'generated' ? 'generatedAccounts' : bytes.importFrom;
    bytesFragment.addImports(importFrom, `get${pascalCase(bytes.name)}Size`);
  } else if (bytes?.kind === 'resolver') {
    bytesFragment.addImports(bytes.importFrom, camelCase(bytes.name));
    bytesFragment.addFeatures([
      'context:getProgramAddress',
      'context:getProgramDerivedAddress',
    ]);
  }

  return bytesFragment;
}
