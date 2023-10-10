import { Fragment, mergeFragments } from './Fragment';

export type TypeManifest = {
  isEnum: boolean;
  strictType: Fragment;
  looseType: Fragment;
  encoder: Fragment;
  decoder: Fragment;
};

export function mergeManifests(
  manifests: TypeManifest[],
  mergeTypes: (renders: string[]) => string,
  mergeCodecs: (renders: string[]) => string
): TypeManifest {
  return {
    isEnum: false,
    strictType: mergeFragments(
      manifests.map((m) => m.strictType),
      mergeTypes
    ),
    looseType: mergeFragments(
      manifests.map((m) => m.looseType),
      mergeTypes
    ),
    encoder: mergeFragments(
      manifests.map((m) => m.encoder),
      mergeCodecs
    ),
    decoder: mergeFragments(
      manifests.map((m) => m.decoder),
      mergeCodecs
    ),
  };
}
