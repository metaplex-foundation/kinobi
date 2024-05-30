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

export async function findFrequencyAccountPda(
  config: { programAddress?: Address | undefined } = {}
): Promise<ProgramDerivedAddress> {
  const {
    programAddress = 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg' as Address<'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg'>,
  } = config;
  return await getProgramDerivedAddress({
    programAddress,
    seeds: [
      getUtf8Encoder().encode('frequency_pda'),
      getAddressEncoder().encode(programAddress),
    ],
  });
}
