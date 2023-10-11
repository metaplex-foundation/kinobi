import { pascalCase } from '../../../shared';
import { TypeManifest } from '../TypeManifest';
import { Fragment, fragmentFromTemplate } from './common';

export function getTypeEncoderFragment(
  name: string,
  manifest: Pick<TypeManifest, 'encoder'>,
  docs: string[] = []
): Fragment {
  const strictName = pascalCase(name);
  const looseName = `${strictName}Args`;
  const context = { strictName, looseName, manifest, docs };

  return fragmentFromTemplate('typeEncoder.njk', context)
    .mergeImportsWith(manifest.encoder)
    .addImports('solanaCodecsCore', 'Encoder');
}
