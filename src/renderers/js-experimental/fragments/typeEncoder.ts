import { TypeManifest } from '../TypeManifest';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragmentFromTemplate } from './common';

export function getTypeEncoderFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi'> & {
    name: string;
    manifest: Pick<TypeManifest, 'encoder'>;
    docs?: string[];
  }
): Fragment {
  const { name, manifest, nameApi, docs = [] } = scope;
  return fragmentFromTemplate('typeEncoder.njk', {
    strictName: nameApi.dataType(name),
    looseName: nameApi.dataArgsType(name),
    encoderFunction: nameApi.encoderFunction(name),
    manifest,
    docs,
  })
    .mergeImportsWith(manifest.encoder)
    .addImports('solanaCodecsCore', 'type Encoder');
}
