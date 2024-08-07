import { TypeManifest } from '../TypeManifest';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragmentFromTemplate } from './common';

export function getTypeDecoderFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi'> & {
    name: string;
    manifest: Pick<TypeManifest, 'decoder'>;
    docs?: string[];
  }
): Fragment {
  const { name, manifest, nameApi, docs = [] } = scope;
  return fragmentFromTemplate('typeDecoder.njk', {
    strictName: nameApi.dataType(name),
    looseName: nameApi.dataArgsType(name),
    decoderFunction: nameApi.decoderFunction(name),
    manifest,
    docs,
  })
    .mergeImportsWith(manifest.decoder)
    .addImports('solanaCodecsCore', 'type Decoder');
}
