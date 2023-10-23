import {
  Codec,
  Decoder,
  Encoder,
  combineCodec,
  mapEncoder,
} from '@solana/codecs-core';
import {
  getStructDecoder,
  getStructEncoder,
} from '@solana/codecs-data-structures';
import { getU8Decoder, getU8Encoder } from '@solana/codecs-numbers';

export type CreateReservationListInstructionData = { discriminator: number };

export type CreateReservationListInstructionDataArgs = {};

export function getCreateReservationListInstructionDataEncoder(): Encoder<CreateReservationListInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<{ discriminator: number }>(
      [['discriminator', getU8Encoder()]],
      { description: 'CreateReservationListInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 42 })
  ) as Encoder<CreateReservationListInstructionDataArgs>;
}

export function getCreateReservationListInstructionDataDecoder(): Decoder<CreateReservationListInstructionData> {
  return getStructDecoder<CreateReservationListInstructionData>(
    [['discriminator', getU8Decoder()]],
    { description: 'CreateReservationListInstructionData' }
  ) as Decoder<CreateReservationListInstructionData>;
}

export function getCreateReservationListInstructionDataCodec(): Codec<
  CreateReservationListInstructionDataArgs,
  CreateReservationListInstructionData
> {
  return combineCodec(
    getCreateReservationListInstructionDataEncoder(),
    getCreateReservationListInstructionDataDecoder()
  );
}
