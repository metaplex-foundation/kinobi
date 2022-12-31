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
} from '@lorisleiva/js-core';
import {
  LeafInfo,
  SeedsVec,
  getLeafInfoSerializer,
  getSeedsVecSerializer,
} from '.';

export type PayloadType =
  | { __kind: 'Pubkey'; fields: { fields: [PublicKey] } }
  | { __kind: 'Seeds'; fields: { fields: [SeedsVec] } }
  | { __kind: 'MerkleProof'; fields: { fields: [LeafInfo] } }
  | { __kind: 'Number'; fields: { fields: [bigint] } };

export function getPayloadTypeSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<PayloadType> {
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
    'PayloadType'
  );
}

// Data Enum Helpers.
export function payloadType(
  kind: 'Pubkey',
  data: GetDataEnumKindContent<PayloadType, 'Pubkey'>['fields']
): GetDataEnumKind<PayloadType, 'Pubkey'>;
export function payloadType(
  kind: 'Seeds',
  data: GetDataEnumKindContent<PayloadType, 'Seeds'>['fields']
): GetDataEnumKind<PayloadType, 'Seeds'>;
export function payloadType(
  kind: 'MerkleProof',
  data: GetDataEnumKindContent<PayloadType, 'MerkleProof'>['fields']
): GetDataEnumKind<PayloadType, 'MerkleProof'>;
export function payloadType(
  kind: 'Number',
  data: GetDataEnumKindContent<PayloadType, 'Number'>['fields']
): GetDataEnumKind<PayloadType, 'Number'>;
export function payloadType<K extends PayloadType['__kind']>(
  kind: K,
  data?: any
): PayloadType & { __kind: K } {
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
