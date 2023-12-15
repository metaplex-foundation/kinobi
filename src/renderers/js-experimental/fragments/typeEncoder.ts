import { TypeManifest } from '../TypeManifest';
import { NameApi } from '../nameTransformers';
import { Fragment, fragmentFromTemplate } from './common';

export function getTypeEncoderFragment(scope: {
  name: string;
  manifest: Pick<TypeManifest, 'encoder'>;
  nameApi: NameApi;
  docs?: string[];
}): Fragment {
  const { name, manifest, nameApi, docs = [] } = scope;
  return fragmentFromTemplate('typeEncoder.njk', {
    strictName: nameApi.dataType(name),
    looseName: nameApi.dataArgsType(name),
    encoderFunction: nameApi.encoderFunction(name),
    manifest,
    docs,
  })
    .mergeImportsWith(manifest.encoder)
    .addImports('solanaCodecsCore', 'Encoder');
}
