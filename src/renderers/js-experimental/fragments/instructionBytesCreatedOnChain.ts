import * as nodes from '../../../nodes';
import { camelCase, pascalCase } from '../../../shared';
import { ImportMap } from '../ImportMap';
import { Fragment, fragmentFromTemplate } from './common';

export function getInstructionBytesCreatedOnChainFragment(
  instructionNode: nodes.InstructionNode
): Fragment {
  const bytes = instructionNode.bytesCreatedOnChain;
  const imports = new ImportMap();

  if (bytes && 'includeHeader' in bytes && bytes.includeHeader) {
    imports.add('shared', 'ACCOUNT_HEADER_SIZE');
  }

  if (bytes?.kind === 'account') {
    const importFrom =
      bytes.importFrom === 'generated' ? 'generatedAccounts' : bytes.importFrom;
    imports.add(importFrom, `get${pascalCase(bytes.name)}Size`);
  } else if (bytes?.kind === 'resolver') {
    imports.add(bytes.importFrom, camelCase(bytes.name));
  }

  return fragmentFromTemplate('instructionBytesCreatedOnChain.njk', {
    bytes,
  }).mergeImportsWith(imports);
}
