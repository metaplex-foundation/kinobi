/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Context,
  GetDataEnumKind,
  GetDataEnumKindContent,
  PublicKey,
  Serializer,
} from '@metaplex-foundation/umi-core';
import {
  LeafInfo,
  SeedsVec,
  getLeafInfoSerializer,
  getSeedsVecSerializer,
} from '.';

/** This is a union of all the possible payload types. */
export type PayloadType =
  | { __kind: 'Pubkey'; fields: [PublicKey] }
  | { __kind: 'Seeds'; fields: [SeedsVec] }
  | { __kind: 'MerkleProof'; fields: [LeafInfo] }
  | { __kind: 'Number'; fields: [bigint] };

export type PayloadTypeArgs =
  | { __kind: 'Pubkey'; fields: [PublicKey] }
  | { __kind: 'Seeds'; fields: [SeedsVec] }
  | { __kind: 'MerkleProof'; fields: [LeafInfo] }
  | { __kind: 'Number'; fields: [number | bigint] };

export function getPayloadTypeSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<PayloadTypeArgs, PayloadType> {
  const s = context.serializer;
  return s.dataEnum<PayloadType>(
    [
      [
        'Pubkey',
        s.struct<GetDataEnumKindContent<PayloadType, 'Pubkey'>>(
          [['fields', s.tuple([s.publicKey])]],
          'Pubkey'
        ),
      ],
      [
        'Seeds',
        s.struct<GetDataEnumKindContent<PayloadType, 'Seeds'>>(
          [['fields', s.tuple([getSeedsVecSerializer(context)])]],
          'Seeds'
        ),
      ],
      [
        'MerkleProof',
        s.struct<GetDataEnumKindContent<PayloadType, 'MerkleProof'>>(
          [['fields', s.tuple([getLeafInfoSerializer(context)])]],
          'MerkleProof'
        ),
      ],
      [
        'Number',
        s.struct<GetDataEnumKindContent<PayloadType, 'Number'>>(
          [['fields', s.tuple([s.u64])]],
          'Number'
        ),
      ],
    ],
    undefined,
    'PayloadType'
  ) as Serializer<PayloadTypeArgs, PayloadType>;
}

// Data Enum Helpers.
export function payloadType(
  kind: 'Pubkey',
  data: GetDataEnumKindContent<PayloadTypeArgs, 'Pubkey'>['fields']
): GetDataEnumKind<PayloadTypeArgs, 'Pubkey'>;
export function payloadType(
  kind: 'Seeds',
  data: GetDataEnumKindContent<PayloadTypeArgs, 'Seeds'>['fields']
): GetDataEnumKind<PayloadTypeArgs, 'Seeds'>;
export function payloadType(
  kind: 'MerkleProof',
  data: GetDataEnumKindContent<PayloadTypeArgs, 'MerkleProof'>['fields']
): GetDataEnumKind<PayloadTypeArgs, 'MerkleProof'>;
export function payloadType(
  kind: 'Number',
  data: GetDataEnumKindContent<PayloadTypeArgs, 'Number'>['fields']
): GetDataEnumKind<PayloadTypeArgs, 'Number'>;
export function payloadType<K extends PayloadTypeArgs['__kind']>(
  kind: K,
  data?: any
): Extract<PayloadTypeArgs, { __kind: K }> {
  return Array.isArray(data)
    ? { __kind: kind, fields: data }
    : { __kind: kind, ...(data ?? {}) };
}
export function isPayloadType<K extends PayloadType['__kind']>(
  kind: K,
  value: PayloadType
): value is PayloadType & { __kind: K } {
  return value.__kind === kind;
}
