import { TypeManifest } from '../TypeManifest';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, mergeFragments } from './common';
import { getTypeFragment } from './type';
import { getTypeCodecFragment } from './typeCodec';

export function getTypeWithCodecFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi'> & {
    name: string;
    manifest: TypeManifest;
    typeDocs?: string[];
    codecDocs?: string[];
    encoderDocs?: string[];
    decoderDocs?: string[];
  }
): Fragment {
  return mergeFragments(
    [
      getTypeFragment({ ...scope, docs: scope.typeDocs }),
      getTypeCodecFragment(scope),
    ],
    (renders) => renders.join('\n\n')
  );
}
