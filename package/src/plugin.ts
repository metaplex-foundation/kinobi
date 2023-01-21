import type { Metaplex, MetaplexPlugin } from '@lorisleiva/js-core';
import {
  getMplCandyMachineCoreProgram,
  getMplTokenAuthRulesProgram,
  getMplTokenMetadataProgram,
} from './generated';

export function plugin(): MetaplexPlugin {
  return {
    install(metaplex: Metaplex) {
      metaplex.programs.add(getMplCandyMachineCoreProgram(), false);
      metaplex.programs.add(getMplTokenAuthRulesProgram(), false);
      metaplex.programs.add(getMplTokenMetadataProgram(), false);
    },
  };
}
