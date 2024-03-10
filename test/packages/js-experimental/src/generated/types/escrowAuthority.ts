/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Address,
  getAddressDecoder,
  getAddressEncoder,
} from '@solana/addresses';
import {
  Codec,
  Decoder,
  Encoder,
  GetDataEnumKind,
  GetDataEnumKindContent,
  combineCodec,
  getDataEnumDecoder,
  getDataEnumEncoder,
  getStructDecoder,
  getStructEncoder,
  getTupleDecoder,
  getTupleEncoder,
  getUnitDecoder,
  getUnitEncoder,
} from '@solana/codecs';

export type EscrowAuthority =
  | { __kind: 'TokenOwner' }
  | { __kind: 'Creator'; fields: [Address] };

export type EscrowAuthorityArgs = EscrowAuthority;

export function getEscrowAuthorityEncoder(): Encoder<EscrowAuthorityArgs> {
  return getDataEnumEncoder([
    ['TokenOwner', getUnitEncoder()],
    [
      'Creator',
      getStructEncoder([['fields', getTupleEncoder([getAddressEncoder()])]]),
    ],
  ]);
}

export function getEscrowAuthorityDecoder(): Decoder<EscrowAuthority> {
  return getDataEnumDecoder([
    ['TokenOwner', getUnitDecoder()],
    [
      'Creator',
      getStructDecoder([['fields', getTupleDecoder([getAddressDecoder()])]]),
    ],
  ]);
}

export function getEscrowAuthorityCodec(): Codec<
  EscrowAuthorityArgs,
  EscrowAuthority
> {
  return combineCodec(getEscrowAuthorityEncoder(), getEscrowAuthorityDecoder());
}

// Data Enum Helpers.
export function escrowAuthority(
  kind: 'TokenOwner'
): GetDataEnumKind<EscrowAuthorityArgs, 'TokenOwner'>;
export function escrowAuthority(
  kind: 'Creator',
  data: GetDataEnumKindContent<EscrowAuthorityArgs, 'Creator'>['fields']
): GetDataEnumKind<EscrowAuthorityArgs, 'Creator'>;
export function escrowAuthority<K extends EscrowAuthorityArgs['__kind']>(
  kind: K,
  data?: any
): Extract<EscrowAuthorityArgs, { __kind: K }> {
  return Array.isArray(data)
    ? { __kind: kind, fields: data }
    : { __kind: kind, ...(data ?? {}) };
}

export function isEscrowAuthority<K extends EscrowAuthority['__kind']>(
  kind: K,
  value: EscrowAuthority
): value is EscrowAuthority & { __kind: K } {
  return value.__kind === kind;
}
