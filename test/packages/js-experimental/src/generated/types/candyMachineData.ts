/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Codec, Decoder, Encoder, combineCodec } from '@solana/codecs-core';
import {
  getArrayDecoder,
  getArrayEncoder,
  getBooleanDecoder,
  getBooleanEncoder,
  getStructDecoder,
  getStructEncoder,
} from '@solana/codecs-data-structures';
import {
  getU16Decoder,
  getU16Encoder,
  getU64Decoder,
  getU64Encoder,
} from '@solana/codecs-numbers';
import { getStringDecoder, getStringEncoder } from '@solana/codecs-strings';
import {
  Option,
  OptionOrNullable,
  getOptionDecoder,
  getOptionEncoder,
} from '@solana/options';
import {
  CmCreator,
  CmCreatorArgs,
  ConfigLineSettings,
  ConfigLineSettingsArgs,
  HiddenSettings,
  HiddenSettingsArgs,
  getCmCreatorDecoder,
  getCmCreatorEncoder,
  getConfigLineSettingsDecoder,
  getConfigLineSettingsEncoder,
  getHiddenSettingsDecoder,
  getHiddenSettingsEncoder,
} from '.';

/** Candy machine configuration data. */
export type CandyMachineData = {
  /** Number of assets available */
  itemsAvailable: bigint;
  /** Symbol for the asset */
  symbol: string;
  /** Secondary sales royalty basis points (0-10000) */
  sellerFeeBasisPoints: number;
  /** Max supply of each individual asset (default 0) */
  maxSupply: bigint;
  /** Indicates if the asset is mutable or not (default yes) */
  isMutable: boolean;
  /** List of creators */
  creators: Array<CmCreator>;
  /** Config line settings */
  configLineSettings: Option<ConfigLineSettings>;
  /** Hidden setttings */
  hiddenSettings: Option<HiddenSettings>;
};

export type CandyMachineDataArgs = {
  /** Number of assets available */
  itemsAvailable: number | bigint;
  /** Symbol for the asset */
  symbol: string;
  /** Secondary sales royalty basis points (0-10000) */
  sellerFeeBasisPoints: number;
  /** Max supply of each individual asset (default 0) */
  maxSupply: number | bigint;
  /** Indicates if the asset is mutable or not (default yes) */
  isMutable: boolean;
  /** List of creators */
  creators: Array<CmCreatorArgs>;
  /** Config line settings */
  configLineSettings: OptionOrNullable<ConfigLineSettingsArgs>;
  /** Hidden setttings */
  hiddenSettings: OptionOrNullable<HiddenSettingsArgs>;
};

export function getCandyMachineDataEncoder(): Encoder<CandyMachineDataArgs> {
  return getStructEncoder<CandyMachineData>(
    [
      ['itemsAvailable', getU64Encoder()],
      ['symbol', getStringEncoder()],
      ['sellerFeeBasisPoints', getU16Encoder()],
      ['maxSupply', getU64Encoder()],
      ['isMutable', getBooleanEncoder()],
      ['creators', getArrayEncoder(getCmCreatorEncoder())],
      ['configLineSettings', getOptionEncoder(getConfigLineSettingsEncoder())],
      ['hiddenSettings', getOptionEncoder(getHiddenSettingsEncoder())],
    ],
    { description: 'CandyMachineData' }
  ) as Encoder<CandyMachineDataArgs>;
}

export function getCandyMachineDataDecoder(): Decoder<CandyMachineData> {
  return getStructDecoder<CandyMachineData>(
    [
      ['itemsAvailable', getU64Decoder()],
      ['symbol', getStringDecoder()],
      ['sellerFeeBasisPoints', getU16Decoder()],
      ['maxSupply', getU64Decoder()],
      ['isMutable', getBooleanDecoder()],
      ['creators', getArrayDecoder(getCmCreatorDecoder())],
      ['configLineSettings', getOptionDecoder(getConfigLineSettingsDecoder())],
      ['hiddenSettings', getOptionDecoder(getHiddenSettingsDecoder())],
    ],
    { description: 'CandyMachineData' }
  ) as Decoder<CandyMachineData>;
}

export function getCandyMachineDataCodec(): Codec<
  CandyMachineDataArgs,
  CandyMachineData
> {
  return combineCodec(
    getCandyMachineDataEncoder(),
    getCandyMachineDataDecoder()
  );
}
