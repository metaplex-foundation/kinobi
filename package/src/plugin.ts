import type { Metaplex, MetaplexPlugin } from '@lorisleiva/js-core';
import { getMplDigitalAssetProgram } from './generated';

export function plugin(): MetaplexPlugin {
  return {
    install(metaplex: Metaplex) {
      metaplex.programs.add(getMplDigitalAssetProgram(metaplex));
    },
  };
}
