import { Fragment, fragment, mergeFragments } from './fragments';

export type TypeManifest = {
  isEnum: boolean;
  strictType: Fragment;
  looseType: Fragment;
  encoder: Fragment;
  decoder: Fragment;
  value: Fragment;
};

export function typeManifest(): TypeManifest {
  return {
    isEnum: false,
    strictType: fragment(''),
    looseType: fragment(''),
    encoder: fragment(''),
    decoder: fragment(''),
    value: fragment(''),
  };
}

export function mergeManifests(
  manifests: TypeManifest[],
  options: {
    mergeTypes?: (renders: string[]) => string;
    mergeCodecs?: (renders: string[]) => string;
    mergeValues?: (renders: string[]) => string;
  } = {}
): TypeManifest {
  const { mergeTypes, mergeCodecs, mergeValues } = options;
  const merge = (
    fragmentFn: (m: TypeManifest) => Fragment,
    mergeFn?: (r: string[]) => string
  ) =>
    mergeFn ? mergeFragments(manifests.map(fragmentFn), mergeFn) : fragment('');
  return {
    isEnum: false,
    strictType: merge((m) => m.strictType, mergeTypes),
    looseType: merge((m) => m.looseType, mergeTypes),
    encoder: merge((m) => m.encoder, mergeCodecs),
    decoder: merge((m) => m.decoder, mergeCodecs),
    value: merge((m) => m.value, mergeValues),
  };
}
