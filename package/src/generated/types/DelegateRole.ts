/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Context, Serializer } from '@lorisleiva/js-core';

export enum DelegateRole {
  Authority,
  Collection,
  Transfer,
  Use,
  Utility,
  Sale,
  Update,
}

export function getDelegateRoleSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<DelegateRole> {
  const s = context.serializer;
  return s.enum<DelegateRole>(DelegateRole, 'DelegateRole');
}
