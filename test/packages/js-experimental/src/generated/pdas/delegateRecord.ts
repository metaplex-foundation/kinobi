/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  getAddressEncoder,
  getProgramDerivedAddress,
  getUtf8Encoder,
  type Address,
  type ProgramDerivedAddress,
} from '@solana/web3.js';
import { getDelegateRoleEncoder, type DelegateRoleArgs } from '../types';

export type DelegateRecordSeeds = {
  /** The delegate role */
  role: DelegateRoleArgs;
};

export async function findDelegateRecordPda(
  seeds: DelegateRecordSeeds,
  config: { programAddress?: Address | undefined } = {}
): Promise<ProgramDerivedAddress> {
  const {
    programAddress = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>,
  } = config;
  return await getProgramDerivedAddress({
    programAddress,
    seeds: [
      getUtf8Encoder().encode('delegate_record'),
      getAddressEncoder().encode(programAddress),
      getDelegateRoleEncoder().encode(seeds.role),
    ],
  });
}
