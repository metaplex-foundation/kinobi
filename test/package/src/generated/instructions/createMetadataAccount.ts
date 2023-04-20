/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  ACCOUNT_HEADER_SIZE,
  AccountMeta,
  Context,
  Option,
  Pda,
  PublicKey,
  Serializer,
  Signer,
  TransactionBuilder,
  checkForIsWritableOverride as isWritable,
  mapSerializer,
  publicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import { findMetadataPda, getMetadataSize } from '../accounts';
import { Creator, CreatorArgs, getCreatorSerializer } from '../types';

// Accounts.
export type CreateMetadataAccountInstructionAccounts = {
  /** Metadata key (pda of ['metadata', program id, mint id]) */
  metadata?: Pda;
  /** Mint of token asset */
  mint: PublicKey;
  /** Mint authority */
  mintAuthority: Signer;
  /** payer */
  payer?: Signer;
  /** update authority info */
  updateAuthority: PublicKey;
  /** System program */
  systemProgram?: PublicKey;
  /** Rent info */
  rent?: PublicKey;
};

// Data.
export type CreateMetadataAccountInstructionData = {
  discriminator: number;
  data: {
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    creators: Option<Array<Creator>>;
  };
  isMutable: boolean;
  metadataBump: number;
};

export type CreateMetadataAccountInstructionDataArgs = {
  data: {
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    creators: Option<Array<CreatorArgs>>;
  };
  isMutable: boolean;
  metadataBump: number;
};

export function getCreateMetadataAccountInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  CreateMetadataAccountInstructionDataArgs,
  CreateMetadataAccountInstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    CreateMetadataAccountInstructionDataArgs,
    CreateMetadataAccountInstructionData,
    CreateMetadataAccountInstructionData
  >(
    s.struct<CreateMetadataAccountInstructionData>(
      [
        ['discriminator', s.u8()],
        [
          'data',
          s.struct<any>(
            [
              ['name', s.string()],
              ['symbol', s.string()],
              ['uri', s.string()],
              ['sellerFeeBasisPoints', s.u16()],
              ['creators', s.option(s.array(getCreatorSerializer(context)))],
            ],
            { description: 'Data' }
          ),
        ],
        ['isMutable', s.bool()],
        ['metadataBump', s.u8()],
      ],
      { description: 'CreateMetadataAccountInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 0 } as CreateMetadataAccountInstructionData)
  ) as Serializer<
    CreateMetadataAccountInstructionDataArgs,
    CreateMetadataAccountInstructionData
  >;
}

// Args.
type PickPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type CreateMetadataAccountInstructionArgs = PickPartial<
  CreateMetadataAccountInstructionDataArgs,
  'metadataBump'
>;

// Instruction.
export function createMetadataAccount(
  context: Pick<Context, 'serializer' | 'programs' | 'eddsa' | 'payer'>,
  input: CreateMetadataAccountInstructionAccounts &
    CreateMetadataAccountInstructionArgs
): TransactionBuilder {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId = {
    ...context.programs.getPublicKey(
      'mplTokenMetadata',
      'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
    ),
    isWritable: false,
  };

  // Resolved inputs.
  const resolvedAccounts: any = { ...input };
  const resolvedArgs: any = { ...input };
  resolvedAccounts.metadata =
    resolvedAccounts.metadata ??
    findMetadataPda(context, { mint: publicKey(resolvedAccounts.mint) });
  resolvedAccounts.payer = resolvedAccounts.payer ?? context.payer;
  resolvedAccounts.systemProgram = resolvedAccounts.systemProgram ?? {
    ...context.programs.getPublicKey(
      'splSystem',
      '11111111111111111111111111111111'
    ),
    isWritable: false,
  };
  resolvedAccounts.rent =
    resolvedAccounts.rent ??
    publicKey('SysvarRent111111111111111111111111111111111');
  resolvedArgs.metadataBump =
    resolvedArgs.metadataBump ?? resolvedAccounts.metadata.bump;

  // Metadata.
  keys.push({
    pubkey: resolvedAccounts.metadata,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.metadata, true),
  });

  // Mint.
  keys.push({
    pubkey: resolvedAccounts.mint,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.mint, false),
  });

  // Mint Authority.
  signers.push(resolvedAccounts.mintAuthority);
  keys.push({
    pubkey: resolvedAccounts.mintAuthority.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.mintAuthority, false),
  });

  // Payer.
  signers.push(resolvedAccounts.payer);
  keys.push({
    pubkey: resolvedAccounts.payer.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.payer, true),
  });

  // Update Authority.
  keys.push({
    pubkey: resolvedAccounts.updateAuthority,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.updateAuthority, false),
  });

  // System Program.
  keys.push({
    pubkey: resolvedAccounts.systemProgram,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.systemProgram, false),
  });

  // Rent.
  keys.push({
    pubkey: resolvedAccounts.rent,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.rent, false),
  });

  // Data.
  const data =
    getCreateMetadataAccountInstructionDataSerializer(context).serialize(
      resolvedArgs
    );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = getMetadataSize() + ACCOUNT_HEADER_SIZE;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
