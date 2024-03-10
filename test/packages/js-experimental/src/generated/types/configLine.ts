/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Codec,
  Decoder,
  Encoder,
  combineCodec,
  getStringDecoder,
  getStringEncoder,
  getStructDecoder,
  getStructEncoder,
} from '@solana/codecs';

/** Config line struct for storing asset (NFT) data pre-mint. */
export type ConfigLine = {
  /** Name of the asset. */
  name: string;
  /** URI to JSON metadata. */
  uri: string;
};

export type ConfigLineArgs = ConfigLine;

export function getConfigLineEncoder(): Encoder<ConfigLineArgs> {
  return getStructEncoder([
    ['name', getStringEncoder()],
    ['uri', getStringEncoder()],
  ]);
}

export function getConfigLineDecoder(): Decoder<ConfigLine> {
  return getStructDecoder([
    ['name', getStringDecoder()],
    ['uri', getStringDecoder()],
  ]);
}

export function getConfigLineCodec(): Codec<ConfigLineArgs, ConfigLine> {
  return combineCodec(getConfigLineEncoder(), getConfigLineDecoder());
}
