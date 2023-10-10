/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Codec, Decoder, Encoder, combineCodec } from '@solana/codecs-core';
import {
  GetDataEnumKind,
  GetDataEnumKindContent,
  getDataEnumDecoder,
  getDataEnumEncoder,
  getStructDecoder,
  getStructEncoder,
} from '@solana/codecs-data-structures';
import { getU64Decoder, getU64Encoder } from '@solana/codecs-numbers';
import {
  Option,
  OptionOrNullable,
  getOptionDecoder,
  getOptionEncoder,
} from '@solana/options';
import {
  AuthorizationData,
  AuthorizationDataArgs,
  getAuthorizationDataDecoder,
  getAuthorizationDataEncoder,
} from '.';

export type MintArgs = {
  __kind: 'V1';
  amount: bigint;
  authorizationData: Option<AuthorizationData>;
};

export type MintArgsArgs = {
  __kind: 'V1';
  amount: number | bigint;
  authorizationData: OptionOrNullable<AuthorizationDataArgs>;
};

export function getMintArgsEncoder(): Encoder<MintArgsArgs> {
  return getDataEnumEncoder<MintArgs>(
    [
      [
        'V1',
        getStructEncoder<GetDataEnumKindContent<MintArgs, 'V1'>>([
          ['amount', getU64Encoder()],
          [
            'authorizationData',
            getOptionEncoder(getAuthorizationDataEncoder()),
          ],
        ]),
      ],
    ],
    { description: 'MintArgs' }
  ) as Encoder<MintArgsArgs>;
}

export function getMintArgsDecoder(): Decoder<MintArgs> {
  return getDataEnumDecoder<MintArgs>(
    [
      [
        'V1',
        getStructDecoder<GetDataEnumKindContent<MintArgs, 'V1'>>([
          ['amount', getU64Decoder()],
          [
            'authorizationData',
            getOptionDecoder(getAuthorizationDataDecoder()),
          ],
        ]),
      ],
    ],
    { description: 'MintArgs' }
  ) as Decoder<MintArgs>;
}

export function getMintArgsCodec(): Codec<MintArgsArgs, MintArgs> {
  return combineCodec(getMintArgsEncoder(), getMintArgsDecoder());
}

// Data Enum Helpers.
export function mintArgs(
  kind: 'V1',
  data: GetDataEnumKindContent<MintArgsArgs, 'V1'>
): GetDataEnumKind<MintArgsArgs, 'V1'>;
export function mintArgs<K extends MintArgsArgs['__kind']>(
  kind: K,
  data?: any
): Extract<MintArgsArgs, { __kind: K }> {
  return Array.isArray(data)
    ? { __kind: kind, fields: data }
    : { __kind: kind, ...(data ?? {}) };
}
export function isMintArgs<K extends MintArgs['__kind']>(
  kind: K,
  value: MintArgs
): value is MintArgs & { __kind: K } {
  return value.__kind === kind;
}
