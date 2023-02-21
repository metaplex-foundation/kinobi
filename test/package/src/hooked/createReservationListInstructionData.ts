import {
  Context,
  mapSerializer,
  Serializer,
} from '@metaplex-foundation/umi-core';

export type CreateReservationListInstructionData = { discriminator: number };

export type CreateReservationListInstructionDataArgs = {};

export function getCreateReservationListInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  CreateReservationListInstructionDataArgs,
  CreateReservationListInstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    CreateReservationListInstructionDataArgs,
    CreateReservationListInstructionData,
    CreateReservationListInstructionData
  >(
    s.struct<CreateReservationListInstructionData>(
      [['discriminator', s.u8()]],
      { description: 'CreateReservationListInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 6 } as CreateReservationListInstructionData)
  ) as Serializer<
    CreateReservationListInstructionDataArgs,
    CreateReservationListInstructionData
  >;
}
