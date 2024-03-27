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
  GetDiscriminatedUnionVariant,
  GetDiscriminatedUnionVariantContent,
  Option,
  OptionOrNullable,
  combineCodec,
  getDiscriminatedUnionDecoder,
  getDiscriminatedUnionEncoder,
  getOptionDecoder,
  getOptionEncoder,
  getStructDecoder,
  getStructEncoder,
  getU64Decoder,
  getU64Encoder,
} from '@solana/codecs';
import {
  AuthorizationData,
  AuthorizationDataArgs,
  getAuthorizationDataDecoder,
  getAuthorizationDataEncoder,
} from '.';

export type TransferArgs = {
  __kind: 'V1';
  authorizationData: Option<AuthorizationData>;
  amount: bigint;
};

export type TransferArgsArgs = {
  __kind: 'V1';
  authorizationData: OptionOrNullable<AuthorizationDataArgs>;
  amount: number | bigint;
};

export function getTransferArgsEncoder(): Encoder<TransferArgsArgs> {
  return getDiscriminatedUnionEncoder([
    [
      'V1',
      getStructEncoder([
        ['authorizationData', getOptionEncoder(getAuthorizationDataEncoder())],
        ['amount', getU64Encoder()],
      ]),
    ],
  ]);
}

export function getTransferArgsDecoder(): Decoder<TransferArgs> {
  return getDiscriminatedUnionDecoder([
    [
      'V1',
      getStructDecoder([
        ['authorizationData', getOptionDecoder(getAuthorizationDataDecoder())],
        ['amount', getU64Decoder()],
      ]),
    ],
  ]);
}

export function getTransferArgsCodec(): Codec<TransferArgsArgs, TransferArgs> {
  return combineCodec(getTransferArgsEncoder(), getTransferArgsDecoder());
}

// Data Enum Helpers.
export function transferArgs(
  kind: 'V1',
  data: GetDiscriminatedUnionVariantContent<TransferArgsArgs, '__kind', 'V1'>
): GetDiscriminatedUnionVariant<TransferArgsArgs, '__kind', 'V1'>;
export function transferArgs<K extends TransferArgsArgs['__kind'], Data>(
  kind: K,
  data?: Data
) {
  return Array.isArray(data)
    ? { __kind: kind, fields: data }
    : { __kind: kind, ...(data ?? {}) };
}

export function isTransferArgs<K extends TransferArgs['__kind']>(
  kind: K,
  value: TransferArgs
): value is TransferArgs & { __kind: K } {
  return value.__kind === kind;
}
