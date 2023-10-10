/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  GetDataEnumKind,
  GetDataEnumKindContent,
  Serializer,
  dataEnum,
  struct,
  u64,
} from 'umiSerializers';

export type UseAssetArgs = { __kind: 'V1'; useCount: bigint };

export type UseAssetArgsArgs = { __kind: 'V1'; useCount: number | bigint };

export function getUseAssetArgsSerializer(): Serializer<
  UseAssetArgsArgs,
  UseAssetArgs
> {
  return dataEnum<UseAssetArgs>(
    [
      [
        'V1',
        struct<GetDataEnumKindContent<UseAssetArgs, 'V1'>>([
          ['useCount', u64()],
        ]),
      ],
    ],
    { description: 'UseAssetArgs' }
  ) as Serializer<UseAssetArgsArgs, UseAssetArgs>;
}

// Data Enum Helpers.
export function useAssetArgs(
  kind: 'V1',
  data: GetDataEnumKindContent<UseAssetArgsArgs, 'V1'>
): GetDataEnumKind<UseAssetArgsArgs, 'V1'>;
export function useAssetArgs<K extends UseAssetArgsArgs['__kind']>(
  kind: K,
  data?: any
): Extract<UseAssetArgsArgs, { __kind: K }> {
  return Array.isArray(data)
    ? { __kind: kind, fields: data }
    : { __kind: kind, ...(data ?? {}) };
}
export function isUseAssetArgs<K extends UseAssetArgs['__kind']>(
  kind: K,
  value: UseAssetArgs
): value is UseAssetArgs & { __kind: K } {
  return value.__kind === kind;
}
