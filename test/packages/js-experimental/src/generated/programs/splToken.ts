/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { ClusterFilter, Context, Program, PublicKey } from 'umi';
import { getSplTokenErrorFromCode, getSplTokenErrorFromName } from '../errors';

export const SPL_TOKEN_PROGRAM_ID =
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as PublicKey<'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'>;

export function createSplTokenProgram(): Program {
  return {
    name: 'splToken',
    publicKey: SPL_TOKEN_PROGRAM_ID,
    getErrorFromCode(code: number, cause?: Error) {
      return getSplTokenErrorFromCode(code, this, cause);
    },
    getErrorFromName(name: string, cause?: Error) {
      return getSplTokenErrorFromName(name, this, cause);
    },
    isOnCluster() {
      return true;
    },
  };
}

export function getSplTokenProgram<T extends Program = Program>(
  context: Pick<Context, 'programs'>,
  clusterFilter?: ClusterFilter
): T {
  return context.programs.get<T>('splToken', clusterFilter);
}

export function getSplTokenProgramId(
  context: Pick<Context, 'programs'>,
  clusterFilter?: ClusterFilter
): PublicKey {
  return context.programs.getPublicKey(
    'splToken',
    SPL_TOKEN_PROGRAM_ID,
    clusterFilter
  );
}
