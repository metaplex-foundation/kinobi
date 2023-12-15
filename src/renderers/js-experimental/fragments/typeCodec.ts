import { TypeManifest } from '../TypeManifest';
import { NameApi } from '../nameTransformers';
import { Fragment, fragmentFromTemplate, mergeFragments } from './common';
import { getTypeDecoderFragment } from './typeDecoder';
import { getTypeEncoderFragment } from './typeEncoder';

export function getTypeCodecFragment(scope: {
  name: string;
  manifest: Pick<TypeManifest, 'encoder' | 'decoder'>;
  nameApi: NameApi;
  codecDocs?: string[];
  encoderDocs?: string[];
  decoderDocs?: string[];
}): Fragment {
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
      }).addImports('solanaCodecsCore', ['Codec', 'combineCodec']),
    ],
    (renders) => renders.join('\n\n')
  );
}
