import { pascalCase } from '../../../shared';
import { TypeManifest } from '../TypeManifest';
import { Fragment, fragmentFromTemplate, mergeFragments } from './common';
import { getTypeDecoderFragment } from './typeDecoder';
import { getTypeEncoderFragment } from './typeEncoder';

export function getTypeCodecFragment(
  name: string,
  manifest: Pick<TypeManifest, 'encoder' | 'decoder'>,
  options: {
    codecDocs?: string[];
    encoderDocs?: string[];
    decoderDocs?: string[];
  } = {}
): Fragment {
  const strictName = pascalCase(name);
  const looseName = `${strictName}Args`;
  const context = {
    strictName,
    looseName,
    manifest,
    docs: options.codecDocs ?? [],
  };

  return mergeFragments(
    [
      getTypeEncoderFragment(name, manifest, options.encoderDocs ?? []),
      getTypeDecoderFragment(name, manifest, options.decoderDocs ?? []),
      fragmentFromTemplate('typeCodec.njk', context).addImports(
        'solanaCodecsCore',
        ['Codec', 'combineCodec']
      ),
    ],
    (renders) => renders.join('\n\n')
  );
}
