import type { Metaplex, MetaplexPlugin } from '@lorisleiva/js-core';
import {
  getMplCandyMachineCoreProgram,
  getMplTokenAuthRulesProgram,
  getMplTokenMetadataProgram,
} from './generated';

export function plugin(): MetaplexPlugin {
  return {
    install(metaplex: Metaplex) {
      metaplex.programs.add(getMplCandyMachineCoreProgram());
      metaplex.programs.add(getMplTokenAuthRulesProgram());
      metaplex.programs.add(getMplTokenMetadataProgram());
    },
  };
}
