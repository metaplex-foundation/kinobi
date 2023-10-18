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
  getArrayDecoder,
  getArrayEncoder,
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
  ReadonlySignerAccount,
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
export type DummyInstruction<
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  TAccountEdition extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountUpdateAuthority extends string | IAccountMeta<string> = string,
  TAccountMintAuthority extends string | IAccountMeta<string> = string,
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountFoo extends string | IAccountMeta<string> = string,
  TAccountBar extends
    | string
    | IAccountMeta<string> = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  TAccountDelegate extends string | IAccountMeta<string> = string,
  TAccountDelegateRecord extends string | IAccountMeta<string> = string,
  TAccountTokenOrAtaProgram extends string | IAccountMeta<string> = string
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountEdition extends string
        ? WritableSignerAccount<TAccountEdition>
        : TAccountEdition,
      TAccountMint extends string
        ? WritableAccount<TAccountMint>
        : TAccountMint,
      TAccountUpdateAuthority extends string
        ? ReadonlySignerAccount<TAccountUpdateAuthority>
        : TAccountUpdateAuthority,
      TAccountMintAuthority extends string
        ? WritableSignerAccount<TAccountMintAuthority>
        : TAccountMintAuthority,
      TAccountPayer extends string
        ? WritableSignerAccount<TAccountPayer>
        : TAccountPayer,
      TAccountFoo extends string ? WritableAccount<TAccountFoo> : TAccountFoo,
      TAccountBar extends string
        ? ReadonlySignerAccount<TAccountBar>
        : TAccountBar,
      TAccountDelegate extends string
        ? ReadonlySignerAccount<TAccountDelegate>
        : TAccountDelegate,
      TAccountDelegateRecord extends string
        ? WritableAccount<TAccountDelegateRecord>
        : TAccountDelegateRecord,
      TAccountTokenOrAtaProgram extends string
        ? ReadonlyAccount<TAccountTokenOrAtaProgram>
        : TAccountTokenOrAtaProgram
    ]
  >;

export type DummyInstructionData = { discriminator: Array<number> };

export type DummyInstructionDataArgs = {};

export function getDummyInstructionDataEncoder(): Encoder<DummyInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<DummyInstructionData>(
      [['discriminator', getArrayEncoder(getU8Encoder(), { size: 8 })]],
      { description: 'DummyInstructionData' }
    ),
    (value) =>
      ({
        ...value,
        discriminator: [167, 117, 211, 79, 251, 254, 47, 135],
      } as DummyInstructionData)
  ) as Encoder<DummyInstructionDataArgs>;
}

export function getDummyInstructionDataDecoder(): Decoder<DummyInstructionData> {
  return getStructDecoder<DummyInstructionData>(
    [['discriminator', getArrayDecoder(getU8Decoder(), { size: 8 })]],
    { description: 'DummyInstructionData' }
  ) as Decoder<DummyInstructionData>;
}

export function getDummyInstructionDataCodec(): Codec<
  DummyInstructionDataArgs,
  DummyInstructionData
> {
  return combineCodec(
    getDummyInstructionDataEncoder(),
    getDummyInstructionDataDecoder()
  );
}

export type DummyInstructionExtraArgs = {
  identityArg: Base58EncodedAddress;
  proof: Array<Base58EncodedAddress>;
};

export function dummyInstruction<
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  TAccountEdition extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountUpdateAuthority extends string | IAccountMeta<string> = string,
  TAccountMintAuthority extends string | IAccountMeta<string> = string,
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountFoo extends string | IAccountMeta<string> = string,
  TAccountBar extends
    | string
    | IAccountMeta<string> = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  TAccountDelegate extends string | IAccountMeta<string> = string,
  TAccountDelegateRecord extends string | IAccountMeta<string> = string,
  TAccountTokenOrAtaProgram extends string | IAccountMeta<string> = string
>(
  accounts: {
    edition: TAccountEdition extends string
      ? Base58EncodedAddress<TAccountEdition>
      : TAccountEdition;
    mint?: TAccountMint extends string
      ? Base58EncodedAddress<TAccountMint>
      : TAccountMint;
    updateAuthority: TAccountUpdateAuthority extends string
      ? Base58EncodedAddress<TAccountUpdateAuthority>
      : TAccountUpdateAuthority;
    mintAuthority: TAccountMintAuthority extends string
      ? Base58EncodedAddress<TAccountMintAuthority>
      : TAccountMintAuthority;
    payer: TAccountPayer extends string
      ? Base58EncodedAddress<TAccountPayer>
      : TAccountPayer;
    foo: TAccountFoo extends string
      ? Base58EncodedAddress<TAccountFoo>
      : TAccountFoo;
    bar?: TAccountBar extends string
      ? Base58EncodedAddress<TAccountBar>
      : TAccountBar;
    delegate?: TAccountDelegate extends string
      ? Base58EncodedAddress<TAccountDelegate>
      : TAccountDelegate;
    delegateRecord?: TAccountDelegateRecord extends string
      ? Base58EncodedAddress<TAccountDelegateRecord>
      : TAccountDelegateRecord;
    tokenOrAtaProgram: TAccountTokenOrAtaProgram extends string
      ? Base58EncodedAddress<TAccountTokenOrAtaProgram>
      : TAccountTokenOrAtaProgram;
  },
  programAddress: Base58EncodedAddress<TProgram> = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.edition, AccountRole.WRITABLE_SIGNER),
      accountMetaWithDefault(
        accounts.mint ?? {
          address:
            'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR' as Base58EncodedAddress<'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'>,
          role: AccountRole.READONLY,
        },
        AccountRole.WRITABLE
      ),
      accountMetaWithDefault(
        accounts.updateAuthority,
        AccountRole.READONLY_SIGNER
      ),
      accountMetaWithDefault(
        accounts.mintAuthority,
        AccountRole.WRITABLE_SIGNER
      ),
      accountMetaWithDefault(accounts.payer, AccountRole.WRITABLE_SIGNER),
      accountMetaWithDefault(accounts.foo, AccountRole.WRITABLE),
      accountMetaWithDefault(
        accounts.bar ?? {
          address:
            'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR' as Base58EncodedAddress<'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY_SIGNER
      ),
      accountMetaWithDefault(
        accounts.delegate ?? {
          address:
            'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR' as Base58EncodedAddress<'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY_SIGNER
      ),
      accountMetaWithDefault(
        accounts.delegateRecord ?? {
          address:
            'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR' as Base58EncodedAddress<'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'>,
          role: AccountRole.READONLY,
        },
        AccountRole.WRITABLE
      ),
      accountMetaWithDefault(accounts.tokenOrAtaProgram, AccountRole.READONLY),
    ],
    data: getDummyInstructionDataEncoder().encode({}),
    programAddress,
  } as DummyInstruction<
    TProgram,
    TAccountEdition,
    TAccountMint,
    TAccountUpdateAuthority,
    TAccountMintAuthority,
    TAccountPayer,
    TAccountFoo,
    TAccountBar,
    TAccountDelegate,
    TAccountDelegateRecord,
    TAccountTokenOrAtaProgram
  >;
}

// Input.
export type DummyInput<
  TAccountEdition extends string,
  TAccountMint extends string,
  TAccountUpdateAuthority extends string,
  TAccountMintAuthority extends string,
  TAccountPayer extends string,
  TAccountFoo extends string,
  TAccountBar extends string,
  TAccountDelegate extends string,
  TAccountDelegateRecord extends string,
  TAccountTokenOrAtaProgram extends string
> = {
  edition?: Signer<TAccountEdition>;
  mint?: Base58EncodedAddress<TAccountMint>;
  updateAuthority: Signer<TAccountUpdateAuthority>;
  mintAuthority?: Signer<TAccountMintAuthority>;
  payer?: Signer<TAccountPayer>;
  foo?: Base58EncodedAddress<TAccountFoo>;
  bar?: Signer<TAccountBar>;
  delegate?: Signer<TAccountDelegate>;
  delegateRecord?: Base58EncodedAddress<TAccountDelegateRecord>;
  tokenOrAtaProgram?: Base58EncodedAddress<TAccountTokenOrAtaProgram>;
  identityArg?: DummyInstructionExtraArgs['identityArg'];
  proof?: DummyInstructionExtraArgs['proof'];
};

export async function dummy<
  TReturn,
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  TAccountEdition extends string = string,
  TAccountMint extends string = string,
  TAccountUpdateAuthority extends string = string,
  TAccountMintAuthority extends string = string,
  TAccountPayer extends string = string,
  TAccountFoo extends string = string,
  TAccountBar extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  TAccountDelegate extends string = string,
  TAccountDelegateRecord extends string = string,
  TAccountTokenOrAtaProgram extends string = string
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      DummyInstruction<
        TProgram,
        TAccountEdition,
        TAccountMint,
        TAccountUpdateAuthority,
        TAccountMintAuthority,
        TAccountPayer,
        TAccountFoo,
        TAccountBar,
        TAccountDelegate,
        TAccountDelegateRecord,
        TAccountTokenOrAtaProgram
      >,
      TReturn
    >,
  input: DummyInput<
    TAccountEdition,
    TAccountMint,
    TAccountUpdateAuthority,
    TAccountMintAuthority,
    TAccountPayer,
    TAccountFoo,
    TAccountBar,
    TAccountDelegate,
    TAccountDelegateRecord,
    TAccountTokenOrAtaProgram
  >
): Promise<TReturn>;
export async function dummy<
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  TAccountEdition extends string = string,
  TAccountMint extends string = string,
  TAccountUpdateAuthority extends string = string,
  TAccountMintAuthority extends string = string,
  TAccountPayer extends string = string,
  TAccountFoo extends string = string,
  TAccountBar extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  TAccountDelegate extends string = string,
  TAccountDelegateRecord extends string = string,
  TAccountTokenOrAtaProgram extends string = string
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: DummyInput<
    TAccountEdition,
    TAccountMint,
    TAccountUpdateAuthority,
    TAccountMintAuthority,
    TAccountPayer,
    TAccountFoo,
    TAccountBar,
    TAccountDelegate,
    TAccountDelegateRecord,
    TAccountTokenOrAtaProgram
  >
): Promise<
  WrappedInstruction<
    DummyInstruction<
      TProgram,
      TAccountEdition,
      TAccountMint,
      TAccountUpdateAuthority,
      TAccountMintAuthority,
      TAccountPayer,
      TAccountFoo,
      TAccountBar,
      TAccountDelegate,
      TAccountDelegateRecord,
      TAccountTokenOrAtaProgram
    >
  >
>;
export async function dummy<
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  TAccountEdition extends string = string,
  TAccountMint extends string = string,
  TAccountUpdateAuthority extends string = string,
  TAccountMintAuthority extends string = string,
  TAccountPayer extends string = string,
  TAccountFoo extends string = string,
  TAccountBar extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  TAccountDelegate extends string = string,
  TAccountDelegateRecord extends string = string,
  TAccountTokenOrAtaProgram extends string = string
>(
  input: DummyInput<
    TAccountEdition,
    TAccountMint,
    TAccountUpdateAuthority,
    TAccountMintAuthority,
    TAccountPayer,
    TAccountFoo,
    TAccountBar,
    TAccountDelegate,
    TAccountDelegateRecord,
    TAccountTokenOrAtaProgram
  >
): Promise<
  WrappedInstruction<
    DummyInstruction<
      TProgram,
      TAccountEdition,
      TAccountMint,
      TAccountUpdateAuthority,
      TAccountMintAuthority,
      TAccountPayer,
      TAccountFoo,
      TAccountBar,
      TAccountDelegate,
      TAccountDelegateRecord,
      TAccountTokenOrAtaProgram
    >
  >
>;
export async function dummy<
  TReturn,
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  TAccountEdition extends string = string,
  TAccountMint extends string = string,
  TAccountUpdateAuthority extends string = string,
  TAccountMintAuthority extends string = string,
  TAccountPayer extends string = string,
  TAccountFoo extends string = string,
  TAccountBar extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  TAccountDelegate extends string = string,
  TAccountDelegateRecord extends string = string,
  TAccountTokenOrAtaProgram extends string = string
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          DummyInstruction<
            TProgram,
            TAccountEdition,
            TAccountMint,
            TAccountUpdateAuthority,
            TAccountMintAuthority,
            TAccountPayer,
            TAccountFoo,
            TAccountBar,
            TAccountDelegate,
            TAccountDelegateRecord,
            TAccountTokenOrAtaProgram
          >,
          TReturn
        >)
    | DummyInput<
        TAccountEdition,
        TAccountMint,
        TAccountUpdateAuthority,
        TAccountMintAuthority,
        TAccountPayer,
        TAccountFoo,
        TAccountBar,
        TAccountDelegate,
        TAccountDelegateRecord,
        TAccountTokenOrAtaProgram
      >,
  rawInput?: DummyInput<
    TAccountEdition,
    TAccountMint,
    TAccountUpdateAuthority,
    TAccountMintAuthority,
    TAccountPayer,
    TAccountFoo,
    TAccountBar,
    TAccountDelegate,
    TAccountDelegateRecord,
    TAccountTokenOrAtaProgram
  >
): Promise<
  | TReturn
  | WrappedInstruction<
      DummyInstruction<
        TProgram,
        TAccountEdition,
        TAccountMint,
        TAccountUpdateAuthority,
        TAccountMintAuthority,
        TAccountPayer,
        TAccountFoo,
        TAccountBar,
        TAccountDelegate,
        TAccountDelegateRecord,
        TAccountTokenOrAtaProgram
      >
    >
> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          DummyInstruction<
            TProgram,
            TAccountEdition,
            TAccountMint,
            TAccountUpdateAuthority,
            TAccountMintAuthority,
            TAccountPayer,
            TAccountFoo,
            TAccountBar,
            TAccountDelegate,
            TAccountDelegateRecord,
            TAccountTokenOrAtaProgram
          >,
          TReturn
        >);
  const input = (rawInput === undefined ? rawContext : rawInput) as DummyInput<
    TAccountEdition,
    TAccountMint,
    TAccountUpdateAuthority,
    TAccountMintAuthority,
    TAccountPayer,
    TAccountFoo,
    TAccountBar,
    TAccountDelegate,
    TAccountDelegateRecord,
    TAccountTokenOrAtaProgram
  >;

  // Program address.
  const defaultProgramAddress =
    'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR' as Base58EncodedAddress<'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'>;
  const programAddress = (
    context.getProgramAddress
      ? await context.getProgramAddress({
          name: 'mplCandyMachineCore',
          address: defaultProgramAddress,
        })
      : defaultProgramAddress
  ) as Base58EncodedAddress<TProgram>;

  // Original accounts.
  type AccountMetas = Parameters<typeof dummyInstruction>[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    edition: { value: input.edition ?? null, isWritable: true },
    mint: { value: input.mint ?? null, isWritable: true },
    updateAuthority: {
      value: input.updateAuthority ?? null,
      isWritable: false,
    },
    mintAuthority: { value: input.mintAuthority ?? null, isWritable: true },
    payer: { value: input.payer ?? null, isWritable: true },
    foo: { value: input.foo ?? null, isWritable: true },
    bar: { value: input.bar ?? null, isWritable: false },
    delegate: { value: input.delegate ?? null, isWritable: false },
    delegateRecord: { value: input.delegateRecord ?? null, isWritable: true },
    tokenOrAtaProgram: {
      value: input.tokenOrAtaProgram ?? null,
      isWritable: false,
    },
  };

  // Original args.
  const args = {
    amount: input.amount,
  };

  // Resolve default values.
  // TODO

  // Get account metas and signers.
  const [accountMetas, signers] = getAccountMetasAndSigners(
    accounts,
    'programId',
    programAddress
  );

  // Remaining accounts.
  // TODO

  // Bytes created on chain.
  // TODO

  return {
    instruction: dummyInstruction(
      accountMetas as AccountMetas,
      programAddress
    ) as DummyInstruction<
      TProgram,
      TAccountEdition,
      TAccountMint,
      TAccountUpdateAuthority,
      TAccountMintAuthority,
      TAccountPayer,
      TAccountFoo,
      TAccountBar,
      TAccountDelegate,
      TAccountDelegateRecord,
      TAccountTokenOrAtaProgram
    >,
    signers,
    bytesCreatedOnChain: 0,
  };
}
