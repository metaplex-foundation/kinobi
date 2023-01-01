import type { Metaplex, MetaplexPlugin } from '@lorisleiva/js-core';
import {
  getMplCandyMachineCoreProgram,
  getMplTokenAuthRulesProgram,
  getMplTokenMetadataProgram,
} from './generated';

export function plugin(): MetaplexPlugin {
  return {
    install(metaplex: Metaplex) {
      metaplex.programs.add(getMplCandyMachineCoreProgram(metaplex));
      metaplex.programs.add(getMplTokenAuthRulesProgram(metaplex));
      metaplex.programs.add(getMplTokenMetadataProgram(metaplex));
    },
  };
}
