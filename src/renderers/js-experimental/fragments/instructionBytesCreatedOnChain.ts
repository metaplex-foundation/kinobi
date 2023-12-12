import * as nodes from '../../../nodes';
import { camelCase, pascalCase } from '../../../shared';
import { ContextMap } from '../ContextMap';
import { ImportMap } from '../ImportMap';
import { Fragment, fragmentFromTemplate } from './common';

export function getInstructionBytesCreatedOnChainFragment(scope: {
  instructionNode: nodes.InstructionNode;
  argObject?: string;
}): Fragment & { interfaces: ContextMap } {
  const bytes = scope.instructionNode.bytesCreatedOnChain;
  const imports = new ImportMap();
  const interfaces = new ContextMap();

  if (bytes && 'includeHeader' in bytes && bytes.includeHeader) {
    imports.add('solanaAccounts', 'BASE_ACCOUNT_SIZE');
  }

  if (bytes?.kind === 'account') {
    const importFrom =
      bytes.importFrom === 'generated' ? 'generatedAccounts' : bytes.importFrom;
    imports.add(importFrom, `get${pascalCase(bytes.name)}Size`);
  } else if (bytes?.kind === 'resolver') {
    imports.add(bytes.importFrom, camelCase(bytes.name));
    interfaces.add(['getProgramAddress', 'getProgramDerivedAddress']);
  }

  const bytesFragment = fragmentFromTemplate(
    'instructionBytesCreatedOnChain.njk',
    { bytes, argObject: scope.argObject ?? 'args' }
  ).mergeImportsWith(imports) as Fragment & { interfaces: ContextMap };
  bytesFragment.interfaces = interfaces;
  return bytesFragment;
}
