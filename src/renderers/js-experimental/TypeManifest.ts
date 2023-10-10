import { pascalCase } from '../../shared';
import { Fragment, fragment, mergeFragments } from './Fragment';

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

export function getTypeWithCodecFragmentFromManifest(
  name: string,
  manifest: TypeManifest
): Fragment {
  return mergeFragments(
    [
      getTypeFragmentFromManifest(name, manifest),
      getCodecFragmentFromManifest(name, manifest),
    ],
    (renders) => renders.join('\n\n')
  );
}

export function getTypeFragmentFromManifest(
  name: string,
  manifest: TypeManifest
): Fragment {
  const strictName = pascalCase(name);
  const looseName = `${strictName}Args`;

  if (manifest.isEnum) {
    return fragment(
      `export enum ${strictName} ${manifest.strictType.render};\n\n` +
        `export type ${looseName} = ${strictName}`
    );
  }

  const looseRender =
    manifest.strictType.render !== manifest.looseType.render
      ? manifest.looseType.render
      : strictName;

  return fragment(
    `export type ${strictName} = ${manifest.strictType.render};\n\n` +
      `export type ${looseName} = ${looseRender}`
  ).mergeImportsWith(manifest.strictType, manifest.looseType);
}

export function getCodecFragmentFromManifest(
  name: string,
  manifest: TypeManifest
): Fragment {
  const strictName = pascalCase(name);
  const looseName = `${strictName}Args`;
  return mergeFragments(
    [
      getEncoderFragmentFromManifest(name, manifest),
      getDecoderFragmentFromManifest(name, manifest),
      fragment(
        `export function get${strictName}Codec(): Codec<${looseName}, ${strictName}> {\n` +
          `return combineCodec(get${strictName}Encoder(), get${strictName}Decoder());\n` +
          `}`
      ).addImports('solanaCodecsCore', ['Codec', 'combineCodec']),
    ],
    (renders) => renders.join('\n\n')
  );
}

export function getEncoderFragmentFromManifest(
  name: string,
  manifest: TypeManifest
): Fragment {
  const strictName = pascalCase(name);
  const looseName = `${strictName}Args`;

  return fragment(
    `export function get${strictName}Encoder(): Encoder<${looseName}> {\n` +
      `return ${manifest.encoder.render} as Encoder<${looseName}>;\n` +
      `}`
  )
    .mergeImportsWith(manifest.encoder)
    .addImports('solanaCodecsCore', 'Encoder');
}

export function getDecoderFragmentFromManifest(
  name: string,
  manifest: TypeManifest
): Fragment {
  const strictName = pascalCase(name);

  return fragment(
    `export function get${strictName}Decoder(): Decoder<${strictName}> {\n` +
      `return ${manifest.decoder.render} as Decoder<${strictName}>;\n` +
      `}`
  )
    .mergeImportsWith(manifest.decoder)
    .addImports('solanaCodecsCore', 'Decoder');
}
