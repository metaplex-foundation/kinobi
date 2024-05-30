import { TypeManifest } from '../TypeManifest';
import { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragmentFromTemplate, mergeFragments } from './common';
import { getTypeDecoderFragment } from './typeDecoder';
import { getTypeEncoderFragment } from './typeEncoder';

export function getTypeCodecFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi'> & {
    name: string;
    manifest: Pick<TypeManifest, 'encoder' | 'decoder'>;
    codecDocs?: string[];
    encoderDocs?: string[];
    decoderDocs?: string[];
  }
): Fragment {
  const { name, manifest, nameApi } = scope;
  return mergeFragments(
    [
      getTypeEncoderFragment({ ...scope, docs: scope.encoderDocs }),
      getTypeDecoderFragment({ ...scope, docs: scope.decoderDocs }),
      fragmentFromTemplate('typeCodec.njk', {
        strictName: nameApi.dataType(name),
        looseName: nameApi.dataArgsType(name),
        codecFunction: nameApi.codecFunction(name),
        encoderFunction: nameApi.encoderFunction(name),
        decoderFunction: nameApi.decoderFunction(name),
        manifest,
        docs: scope.codecDocs,
      }).addImports('solanaCodecsCore', ['type Codec', 'combineCodec']),
    ],
    (renders) => renders.join('\n\n')
  );
}
