/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  PayloadKey,
  PayloadKeyArgs,
  PayloadType,
  PayloadTypeArgs,
  getPayloadKeySerializer,
  getPayloadTypeSerializer,
} from '.';
import { Context, Serializer } from '@lorisleiva/js-core';

export type Payload = { map: Map<PayloadKey, PayloadType> };
export type PayloadArgs = { map: Map<PayloadKeyArgs, PayloadTypeArgs> };

export function getPayloadSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<PayloadArgs, Payload> {
  const s = context.serializer;
  return s.struct<Payload>(
    [
      [
        'map',
        s.map(
          getPayloadKeySerializer(context),
          getPayloadTypeSerializer(context)
        ),
      ],
    ],
    'Payload'
  ) as Serializer<PayloadArgs, Payload>;
}
