import { pascalCase } from '../../../shared';
import { TypeManifest } from '../TypeManifest';
import { Fragment, fragmentFromTemplate } from './common';

export function getTypeDecoderFragment(
  name: string,
  manifest: Pick<TypeManifest, 'decoder'>,
  docs: string[] = []
): Fragment {
  const strictName = pascalCase(name);
  const looseName = `${strictName}Args`;
  const context = { strictName, looseName, manifest, docs };

  return fragmentFromTemplate('typeDecoder.njk', context)
    .mergeImportsWith(manifest.decoder)
    .addImports('solanaCodecsCore', 'Decoder');
}
