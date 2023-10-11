/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Base58EncodedAddress,
  ProgramDerivedAddress,
  getAddressEncoder,
} from '@solana/addresses';
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
import { getU64Decoder, getU64Encoder } from '@solana/codecs-numbers';
import { getStringEncoder } from '@solana/codecs-strings';
import {
  Option,
  OptionOrNullable,
  getOptionDecoder,
  getOptionEncoder,
} from '@solana/options';
import {
  Account,
  Context,
  GpaBuilder,
  RpcAccount,
  RpcGetAccountOptions,
  RpcGetAccountsOptions,
  assertAccountExists,
  deserializeAccount,
  gpaBuilder,
} from 'some-magical-place';
import { TmKey, TmKeyArgs, getTmKeyDecoder, getTmKeyEncoder } from '../types';

export type MasterEditionV2 = Account<MasterEditionV2AccountData>;

export type MasterEditionV2AccountData = {
  key: TmKey;
  supply: bigint;
  maxSupply: Option<bigint>;
};

export type MasterEditionV2AccountDataArgs = {
  supply: number | bigint;
  maxSupply: OptionOrNullable<number | bigint>;
};

export function getMasterEditionV2AccountDataEncoder(): Encoder<MasterEditionV2AccountDataArgs> {
  return mapEncoder(
    getStructEncoder<MasterEditionV2AccountData>(
      [
        ['key', getTmKeyEncoder()],
        ['supply', getU64Encoder()],
        ['maxSupply', getOptionEncoder(getU64Encoder())],
      ],
      { description: 'MasterEditionV2AccountData' }
    ),
    (value) =>
      ({ ...value, key: TmKey.MasterEditionV2 } as MasterEditionV2AccountData)
  ) as Encoder<MasterEditionV2AccountDataArgs>;
}

export function getMasterEditionV2AccountDataDecoder(): Decoder<MasterEditionV2AccountData> {
  return getStructDecoder<MasterEditionV2AccountData>(
    [
      ['key', getTmKeyDecoder()],
      ['supply', getU64Decoder()],
      ['maxSupply', getOptionDecoder(getU64Decoder())],
    ],
    { description: 'MasterEditionV2AccountData' }
  ) as Decoder<MasterEditionV2AccountData>;
}

export function getMasterEditionV2AccountDataCodec(): Codec<
  MasterEditionV2AccountDataArgs,
  MasterEditionV2AccountData
> {
  return combineCodec(
    getMasterEditionV2AccountDataEncoder(),
    getMasterEditionV2AccountDataDecoder()
  );
}

export function deserializeMasterEditionV2(
  rawAccount: RpcAccount
): MasterEditionV2 {
  return deserializeAccount(rawAccount, getMasterEditionV2AccountDataEncoder());
}

export async function fetchMasterEditionV2(
  context: Pick<Context, 'rpc'>,
  address: Base58EncodedAddress,
  options?: RpcGetAccountOptions
): Promise<MasterEditionV2> {
  const maybeAccount = await context.rpc.getAccount(address, options);
  assertAccountExists(maybeAccount, 'MasterEditionV2');
  return deserializeMasterEditionV2(maybeAccount);
}

export async function safeFetchMasterEditionV2(
  context: Pick<Context, 'rpc'>,
  address: Base58EncodedAddress,
  options?: RpcGetAccountOptions
): Promise<MasterEditionV2 | null> {
  const maybeAccount = await context.rpc.getAccount(address, options);
  return maybeAccount.exists ? deserializeMasterEditionV2(maybeAccount) : null;
}

export async function fetchAllMasterEditionV2(
  context: Pick<Context, 'rpc'>,
  addresses: Array<Base58EncodedAddress>,
  options?: RpcGetAccountsOptions
): Promise<MasterEditionV2[]> {
  const maybeAccounts = await context.rpc.getAccounts(addresses, options);
  return maybeAccounts.map((maybeAccount) => {
    assertAccountExists(maybeAccount, 'MasterEditionV2');
    return deserializeMasterEditionV2(maybeAccount);
  });
}

export async function safeFetchAllMasterEditionV2(
  context: Pick<Context, 'rpc'>,
  addresses: Array<Base58EncodedAddress>,
  options?: RpcGetAccountsOptions
): Promise<MasterEditionV2[]> {
  const maybeAccounts = await context.rpc.getAccounts(addresses, options);
  return maybeAccounts
    .filter((maybeAccount) => maybeAccount.exists)
    .map((maybeAccount) =>
      deserializeMasterEditionV2(maybeAccount as RpcAccount)
    );
}

export function getMasterEditionV2GpaBuilder(
  context: Pick<Context, 'rpc' | 'programs'>
) {
  const programId = context.programs.getPublicKey(
    'mplTokenMetadata',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );
  return gpaBuilder(context, programId)
    .registerFields<{
      key: TmKeyArgs;
      supply: number | bigint;
      maxSupply: OptionOrNullable<number | bigint>;
    }>({
      key: [0, getTmKeyEncoder()],
      supply: [1, getU64Encoder()],
      maxSupply: [9, getOptionEncoder(getU64Encoder())],
    })
    .deserializeUsing<MasterEditionV2>((account) =>
      deserializeMasterEditionV2(account)
    )
    .whereField('key', TmKey.MasterEditionV2);
}

export function getMasterEditionV2Size(): number {
  return 282;
}

export function findMasterEditionV2Pda(
  context: Pick<Context, 'eddsa' | 'programs'>,
  seeds: {
    /** The address of the mint account */
    mint: Base58EncodedAddress;
  }
): ProgramDerivedAddress {
  const programId = context.programs.getPublicKey(
    'mplTokenMetadata',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );
  return context.eddsa.findPda(programId, [
    getStringEncoder({ size: 'variable' }).encode('metadata'),
    getAddressEncoder().encode(programId),
    getAddressEncoder().encode(seeds.mint),
    getStringEncoder({ size: 'variable' }).encode('edition'),
  ]);
}

export async function fetchMasterEditionV2FromSeeds(
  context: Pick<Context, 'eddsa' | 'programs' | 'rpc'>,
  seeds: Parameters<typeof findMasterEditionV2Pda>[1],
  options?: RpcGetAccountOptions
): Promise<MasterEditionV2> {
  return fetchMasterEditionV2(
    context,
    findMasterEditionV2Pda(context, seeds),
    options
  );
}

export async function safeFetchMasterEditionV2FromSeeds(
  context: Pick<Context, 'eddsa' | 'programs' | 'rpc'>,
  seeds: Parameters<typeof findMasterEditionV2Pda>[1],
  options?: RpcGetAccountOptions
): Promise<MasterEditionV2 | null> {
  return safeFetchMasterEditionV2(
    context,
    findMasterEditionV2Pda(context, seeds),
    options
  );
}
