import type { Umi, UmiPlugin } from '@metaplex-foundation/umi';
import {
  getMplCandyMachineCoreProgram,
  getMplTokenAuthRulesProgram,
  getMplTokenMetadataProgram,
} from './generated';

export function plugin(): UmiPlugin {
  return {
    install(umi: Umi) {
      umi.programs.add(getMplCandyMachineCoreProgram(), false);
      umi.programs.add(getMplTokenAuthRulesProgram(), false);
      umi.programs.add(getMplTokenMetadataProgram(), false);
    },
  };
}
