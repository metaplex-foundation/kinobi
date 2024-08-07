/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  addDecoderSizePrefix,
  addEncoderSizePrefix,
  combineCodec,
  getBooleanDecoder,
  getBooleanEncoder,
  getStructDecoder,
  getStructEncoder,
  getU32Decoder,
  getU32Encoder,
  getUtf8Decoder,
  getUtf8Encoder,
  type Codec,
  type Decoder,
  type Encoder,
} from '@solana/web3.js';

/** Config line settings to allocate space for individual name + URI. */
export type ConfigLineSettings = {
  /** Common name prefix */
  prefixName: string;
  /** Length of the remaining part of the name */
  nameLength: number;
  /** Common URI prefix */
  prefixUri: string;
  /** Length of the remaining part of the URI */
  uriLength: number;
  /** Indicates whether to use a senquential index generator or not */
  isSequential: boolean;
};

export type ConfigLineSettingsArgs = ConfigLineSettings;

export function getConfigLineSettingsEncoder(): Encoder<ConfigLineSettingsArgs> {
  return getStructEncoder([
    ['prefixName', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
    ['nameLength', getU32Encoder()],
    ['prefixUri', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
    ['uriLength', getU32Encoder()],
    ['isSequential', getBooleanEncoder()],
  ]);
}

export function getConfigLineSettingsDecoder(): Decoder<ConfigLineSettings> {
  return getStructDecoder([
    ['prefixName', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
    ['nameLength', getU32Decoder()],
    ['prefixUri', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
    ['uriLength', getU32Decoder()],
    ['isSequential', getBooleanDecoder()],
  ]);
}

export function getConfigLineSettingsCodec(): Codec<
  ConfigLineSettingsArgs,
  ConfigLineSettings
> {
  return combineCodec(
    getConfigLineSettingsEncoder(),
    getConfigLineSettingsDecoder()
  );
}
