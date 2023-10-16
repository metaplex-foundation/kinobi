/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { ClusterFilter, Context, Program, PublicKey } from 'umi';
import {
  getSplSystemErrorFromCode,
  getSplSystemErrorFromName,
} from '../errors';

export const SPL_SYSTEM_PROGRAM_ID =
  '11111111111111111111111111111111' as PublicKey<'11111111111111111111111111111111'>;

export function createSplSystemProgram(): Program {
  return {
    name: 'splSystem',
    publicKey: SPL_SYSTEM_PROGRAM_ID,
    getErrorFromCode(code: number, cause?: Error) {
      return getSplSystemErrorFromCode(code, this, cause);
    },
    getErrorFromName(name: string, cause?: Error) {
      return getSplSystemErrorFromName(name, this, cause);
    },
    isOnCluster() {
      return true;
    },
  };
}

export function getSplSystemProgram<T extends Program = Program>(
  context: Pick<Context, 'programs'>,
  clusterFilter?: ClusterFilter
): T {
  return context.programs.get<T>('splSystem', clusterFilter);
}

export function getSplSystemProgramId(
  context: Pick<Context, 'programs'>,
  clusterFilter?: ClusterFilter
): PublicKey {
  return context.programs.getPublicKey(
    'splSystem',
    SPL_SYSTEM_PROGRAM_ID,
    clusterFilter
  );
}
