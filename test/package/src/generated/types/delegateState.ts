/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { PublicKey } from '@metaplex-foundation/umi';
import {
  Serializer,
  bool,
  publicKey as publicKeySerializer,
  struct,
  u8,
} from '@metaplex-foundation/umi/serializers';
import { DelegateRole, DelegateRoleArgs, getDelegateRoleSerializer } from '.';

export type DelegateState = {
  role: DelegateRole;
  delegate: PublicKey;
  hasData: boolean;
};

export type DelegateStateArgs = {
  role: DelegateRoleArgs;
  delegate: PublicKey;
  hasData: boolean;
};

export function getDelegateStateSerializer(
  _context: object = {}
): Serializer<DelegateStateArgs, DelegateState> {
  return struct<DelegateState>(
    [
      ['role', getDelegateRoleSerializer()],
      ['delegate', publicKeySerializer()],
      ['hasData', bool()],
    ],
    { description: 'DelegateState' }
  ) as Serializer<DelegateStateArgs, DelegateState>;
}
