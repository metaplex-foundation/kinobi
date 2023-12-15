import { TypeManifest } from '../TypeManifest';
import { NameApi } from '../nameTransformers';
import { Fragment, fragmentFromTemplate } from './common';

export function getTypeDecoderFragment(scope: {
  name: string;
  manifest: Pick<TypeManifest, 'decoder'>;
  nameApi: NameApi;
  docs?: string[];
}): Fragment {
  const { name, manifest, nameApi, docs = [] } = scope;
  return fragmentFromTemplate('typeDecoder.njk', {
    strictName: nameApi.dataType(name),
    looseName: nameApi.dataArgsType(name),
    decoderFunction: nameApi.decoderFunction(name),
    manifest,
    docs,
  })
    .mergeImportsWith(manifest.decoder)
    .addImports('solanaCodecsCore', 'Decoder');
}
