import { pascalCase } from '../../../shared';
import { TypeManifest } from '../TypeManifest';
import { Fragment, fragmentFromTemplate } from './common';

export function getTypeFragment(
  name: string,
  manifest: TypeManifest,
  docs: string[] = []
): Fragment {
  const strictName = pascalCase(name);
  const looseName = `${strictName}Args`;
  const typeFragment = fragmentFromTemplate('type.njk', {
    strictName,
    looseName,
    manifest,
    docs,
  });

  if (!manifest.isEnum) {
    typeFragment.mergeImportsWith(manifest.strictType, manifest.looseType);
  }

  return typeFragment;
}
