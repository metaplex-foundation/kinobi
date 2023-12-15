import { TypeManifest } from '../TypeManifest';
import { NameApi } from '../nameTransformers';
import { Fragment, mergeFragments } from './common';
import { getTypeFragment } from './type';
import { getTypeCodecFragment } from './typeCodec';

export function getTypeWithCodecFragment(scope: {
  name: string;
  manifest: TypeManifest;
  nameApi: NameApi;
  typeDocs?: string[];
  codecDocs?: string[];
  encoderDocs?: string[];
  decoderDocs?: string[];
}): Fragment {
  return mergeFragments(
    [
      getTypeFragment({ ...scope, docs: scope.typeDocs }),
      getTypeCodecFragment(scope),
    ],
    (renders) => renders.join('\n\n')
  );
}
