import { TypeManifest } from '../TypeManifest';
import { Fragment, mergeFragments } from './common';
import { getTypeFragment } from './type';
import { getTypeCodecFragment } from './typeCodec';

export function getTypeWithCodecFragment(
  name: string,
  manifest: TypeManifest,
  docs: string[] = [],
  options: {
    codecDocs?: string[];
    encoderDocs?: string[];
    decoderDocs?: string[];
  } = {}
): Fragment {
  return mergeFragments(
    [
      getTypeFragment(name, manifest, docs),
      getTypeCodecFragment(name, manifest, options),
    ],
    (renders) => renders.join('\n\n')
  );
}
