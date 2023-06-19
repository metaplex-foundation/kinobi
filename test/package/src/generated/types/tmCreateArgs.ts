/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Option, OptionOrNullable } from '@metaplex-foundation/umi';
import {
  GetDataEnumKind,
  GetDataEnumKindContent,
  Serializer,
  dataEnum,
  option,
  struct,
  u64,
  u8,
} from '@metaplex-foundation/umi/serializers';
import { AssetData, AssetDataArgs, getAssetDataSerializer } from '.';

export type TmCreateArgs = {
  __kind: 'V1';
  assetData: AssetData;
  decimals: Option<number>;
  maxSupply: Option<bigint>;
};

export type TmCreateArgsArgs = {
  __kind: 'V1';
  assetData: AssetDataArgs;
  decimals: OptionOrNullable<number>;
  maxSupply: OptionOrNullable<number | bigint>;
};

export function getTmCreateArgsSerializer(
  _context: object = {}
): Serializer<TmCreateArgsArgs, TmCreateArgs> {
  return dataEnum<TmCreateArgs>(
    [
      [
        'V1',
        struct<GetDataEnumKindContent<TmCreateArgs, 'V1'>>([
          ['assetData', getAssetDataSerializer()],
          ['decimals', option(u8())],
          ['maxSupply', option(u64())],
        ]),
      ],
    ],
    { description: 'TmCreateArgs' }
  ) as Serializer<TmCreateArgsArgs, TmCreateArgs>;
}

// Data Enum Helpers.
export function tmCreateArgs(
  kind: 'V1',
  data: GetDataEnumKindContent<TmCreateArgsArgs, 'V1'>
): GetDataEnumKind<TmCreateArgsArgs, 'V1'>;
export function tmCreateArgs<K extends TmCreateArgsArgs['__kind']>(
  kind: K,
  data?: any
): Extract<TmCreateArgsArgs, { __kind: K }> {
  return Array.isArray(data)
    ? { __kind: kind, fields: data }
    : { __kind: kind, ...(data ?? {}) };
}
export function isTmCreateArgs<K extends TmCreateArgs['__kind']>(
  kind: K,
  value: TmCreateArgs
): value is TmCreateArgs & { __kind: K } {
  return value.__kind === kind;
}
