/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Serializer,
  bytes,
  string,
  struct,
  u32,
} from '@metaplex-foundation/umi/serializers';

export type TaCreateArgs = {
  ruleSetName: string;
  serializedRuleSet: Uint8Array;
};

export type TaCreateArgsArgs = TaCreateArgs;

export function getTaCreateArgsSerializer(): Serializer<
  TaCreateArgsArgs,
  TaCreateArgs
> {
  return struct<TaCreateArgs>(
    [
      ['ruleSetName', string()],
      ['serializedRuleSet', bytes({ size: u32() })],
    ],
    { description: 'TaCreateArgs' }
  ) as Serializer<TaCreateArgsArgs, TaCreateArgs>;
}
