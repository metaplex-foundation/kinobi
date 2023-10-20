/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Base58EncodedAddress } from '@solana/addresses';
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
import {
  AccountRole,
  IAccountMeta,
  IInstruction,
  IInstructionWithAccounts,
  IInstructionWithData,
  ReadonlyAccount,
  WritableAccount,
  WritableSignerAccount,
} from '@solana/instructions';
import {
  Context,
  CustomGeneratedInstruction,
  ResolvedAccount,
  Signer,
  WrappedInstruction,
  accountMetaWithDefault,
  getAccountMetasAndSigners,
} from '../shared';

// Output.
export type SetTokenStandardInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountUpdateAuthority extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountEdition extends string | IAccountMeta<string> = string
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountMetadata extends string
        ? WritableAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountUpdateAuthority extends string
        ? WritableSignerAccount<TAccountUpdateAuthority>
        : TAccountUpdateAuthority,
      TAccountMint extends string
        ? ReadonlyAccount<TAccountMint>
        : TAccountMint,
      TAccountEdition extends string
        ? ReadonlyAccount<TAccountEdition>
        : TAccountEdition
    ]
  >;

export type SetTokenStandardInstructionData = { discriminator: number };

export type SetTokenStandardInstructionDataArgs = {};

export function getSetTokenStandardInstructionDataEncoder(): Encoder<SetTokenStandardInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<{ discriminator: number }>(
      [['discriminator', getU8Encoder()]],
      { description: 'SetTokenStandardInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 35 })
  ) as Encoder<SetTokenStandardInstructionDataArgs>;
}

export function getSetTokenStandardInstructionDataDecoder(): Decoder<SetTokenStandardInstructionData> {
  return getStructDecoder<SetTokenStandardInstructionData>(
    [['discriminator', getU8Decoder()]],
    { description: 'SetTokenStandardInstructionData' }
  ) as Decoder<SetTokenStandardInstructionData>;
}

export function getSetTokenStandardInstructionDataCodec(): Codec<
  SetTokenStandardInstructionDataArgs,
  SetTokenStandardInstructionData
> {
  return combineCodec(
    getSetTokenStandardInstructionDataEncoder(),
    getSetTokenStandardInstructionDataDecoder()
  );
}

export function setTokenStandardInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountUpdateAuthority extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountEdition extends string | IAccountMeta<string> = string
>(
  accounts: {
    metadata: TAccountMetadata extends string
      ? Base58EncodedAddress<TAccountMetadata>
      : TAccountMetadata;
    updateAuthority: TAccountUpdateAuthority extends string
      ? Base58EncodedAddress<TAccountUpdateAuthority>
      : TAccountUpdateAuthority;
    mint: TAccountMint extends string
      ? Base58EncodedAddress<TAccountMint>
      : TAccountMint;
    edition?: TAccountEdition extends string
      ? Base58EncodedAddress<TAccountEdition>
      : TAccountEdition;
  },
  programAddress: Base58EncodedAddress<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.metadata, AccountRole.WRITABLE),
      accountMetaWithDefault(
        accounts.updateAuthority,
        AccountRole.WRITABLE_SIGNER
      ),
      accountMetaWithDefault(accounts.mint, AccountRole.READONLY),
      accountMetaWithDefault(
        accounts.edition ?? {
          address:
            'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
    ],
    data: getSetTokenStandardInstructionDataEncoder().encode({}),
    programAddress,
  } as SetTokenStandardInstruction<
    TProgram,
    TAccountMetadata,
    TAccountUpdateAuthority,
    TAccountMint,
    TAccountEdition
  >;
}

// Input.
export type SetTokenStandardInput<
  TAccountMetadata extends string,
  TAccountUpdateAuthority extends string,
  TAccountMint extends string,
  TAccountEdition extends string
> = {
  /** Metadata account */
  metadata: Base58EncodedAddress<TAccountMetadata>;
  /** Metadata update authority */
  updateAuthority: Signer<TAccountUpdateAuthority>;
  /** Mint account */
  mint: Base58EncodedAddress<TAccountMint>;
  /** Edition account */
  edition?: Base58EncodedAddress<TAccountEdition>;
};

export async function setTokenStandard<
  TReturn,
  TAccountMetadata extends string,
  TAccountUpdateAuthority extends string,
  TAccountMint extends string,
  TAccountEdition extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      SetTokenStandardInstruction<
        TProgram,
        TAccountMetadata,
        TAccountUpdateAuthority,
        TAccountMint,
        TAccountEdition
      >,
      TReturn
    >,
  input: SetTokenStandardInput<
    TAccountMetadata,
    TAccountUpdateAuthority,
    TAccountMint,
    TAccountEdition
  >
): Promise<TReturn>;
export async function setTokenStandard<
  TAccountMetadata extends string,
  TAccountUpdateAuthority extends string,
  TAccountMint extends string,
  TAccountEdition extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: SetTokenStandardInput<
    TAccountMetadata,
    TAccountUpdateAuthority,
    TAccountMint,
    TAccountEdition
  >
): Promise<
  WrappedInstruction<
    SetTokenStandardInstruction<
      TProgram,
      TAccountMetadata,
      TAccountUpdateAuthority,
      TAccountMint,
      TAccountEdition
    >
  >
>;
export async function setTokenStandard<
  TAccountMetadata extends string,
  TAccountUpdateAuthority extends string,
  TAccountMint extends string,
  TAccountEdition extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  input: SetTokenStandardInput<
    TAccountMetadata,
    TAccountUpdateAuthority,
    TAccountMint,
    TAccountEdition
  >
): Promise<
  WrappedInstruction<
    SetTokenStandardInstruction<
      TProgram,
      TAccountMetadata,
      TAccountUpdateAuthority,
      TAccountMint,
      TAccountEdition
    >
  >
>;
export async function setTokenStandard<
  TReturn,
  TAccountMetadata extends string,
  TAccountUpdateAuthority extends string,
  TAccountMint extends string,
  TAccountEdition extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>)
    | SetTokenStandardInput<
        TAccountMetadata,
        TAccountUpdateAuthority,
        TAccountMint,
        TAccountEdition
      >,
  rawInput?: SetTokenStandardInput<
    TAccountMetadata,
    TAccountUpdateAuthority,
    TAccountMint,
    TAccountEdition
  >
): Promise<TReturn | WrappedInstruction<IInstruction>> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as SetTokenStandardInput<
    TAccountMetadata,
    TAccountUpdateAuthority,
    TAccountMint,
    TAccountEdition
  >;

  // Program address.
  const defaultProgramAddress =
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>;
  const programAddress = (
    context.getProgramAddress
      ? await context.getProgramAddress({
          name: 'mplTokenMetadata',
          address: defaultProgramAddress,
        })
      : defaultProgramAddress
  ) as Base58EncodedAddress<TProgram>;

  // Original accounts.
  type AccountMetas = Parameters<
    typeof setTokenStandardInstruction<
      TProgram,
      TAccountMetadata,
      TAccountUpdateAuthority,
      TAccountMint,
      TAccountEdition
    >
  >[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    metadata: { value: input.metadata ?? null, isWritable: true },
    updateAuthority: { value: input.updateAuthority ?? null, isWritable: true },
    mint: { value: input.mint ?? null, isWritable: false },
    edition: { value: input.edition ?? null, isWritable: false },
  };

  // Get account metas and signers.
  const [accountMetas, signers] = getAccountMetasAndSigners(
    accounts,
    'programId',
    programAddress
  );

  // Remaining accounts.
  // TODO

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return {
    instruction: setTokenStandardInstruction(
      accountMetas as Record<keyof AccountMetas, IAccountMeta>,
      programAddress
    ),
    signers,
    bytesCreatedOnChain,
  };
}
