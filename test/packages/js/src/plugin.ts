import type { Umi, UmiPlugin } from '@metaplex-foundation/umi';
import {
  createMplCandyMachineCoreProgram,
  createMplTokenAuthRulesProgram,
  createMplTokenMetadataProgram,
} from './generated';

export function plugin(): UmiPlugin {
  return {
    install(umi: Umi) {
      umi.programs.add(createMplCandyMachineCoreProgram(), false);
      umi.programs.add(createMplTokenAuthRulesProgram(), false);
      umi.programs.add(createMplTokenMetadataProgram(), false);
    },
  };
}
