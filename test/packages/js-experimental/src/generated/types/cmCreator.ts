/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  combineCodec,
  getAddressDecoder,
  getAddressEncoder,
  getBooleanDecoder,
  getBooleanEncoder,
  getStructDecoder,
  getStructEncoder,
  getU8Decoder,
  getU8Encoder,
  type Address,
  type Codec,
  type Decoder,
  type Encoder,
} from '@solana/web3.js';

export type CmCreator = {
  /** Pubkey address */
  address: Address;
  /** Whether the creator is verified or not */
  verified: boolean;
  percentageShare: number;
};

export type CmCreatorArgs = CmCreator;

export function getCmCreatorEncoder(): Encoder<CmCreatorArgs> {
  return getStructEncoder([
    ['address', getAddressEncoder()],
    ['verified', getBooleanEncoder()],
    ['percentageShare', getU8Encoder()],
  ]);
}

export function getCmCreatorDecoder(): Decoder<CmCreator> {
  return getStructDecoder([
    ['address', getAddressDecoder()],
    ['verified', getBooleanDecoder()],
    ['percentageShare', getU8Decoder()],
  ]);
}

export function getCmCreatorCodec(): Codec<CmCreatorArgs, CmCreator> {
  return combineCodec(getCmCreatorEncoder(), getCmCreatorDecoder());
}
