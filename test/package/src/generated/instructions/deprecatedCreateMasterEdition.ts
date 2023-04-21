/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  AccountMeta,
  Context,
  PublicKey,
  Serializer,
  Signer,
  TransactionBuilder,
  mapSerializer,
  publicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import { addObjectProperty, isWritable } from '../shared';
import {
  CreateMasterEditionArgs,
  CreateMasterEditionArgsArgs,
  getCreateMasterEditionArgsSerializer,
} from '../types';

// Accounts.
export type DeprecatedCreateMasterEditionInstructionAccounts = {
  /** Unallocated edition V1 account with address as pda of ['metadata', program id, mint, 'edition'] */
  edition: PublicKey;
  /** Metadata mint */
  mint: PublicKey;
  /** Printing mint - A mint you control that can mint tokens that can be exchanged for limited editions of your master edition via the MintNewEditionFromMasterEditionViaToken endpoint */
  printingMint: PublicKey;
  /** One time authorization printing mint - A mint you control that prints tokens that gives the bearer permission to mint any number of tokens from the printing mint one time via an endpoint with the token-metadata program for your metadata. Also burns the token. */
  oneTimePrintingAuthorizationMint: PublicKey;
  /** Current Update authority key */
  updateAuthority: Signer;
  /** Printing mint authority - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY. */
  printingMintAuthority: Signer;
  /** Mint authority on the metadata's mint - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY */
  mintAuthority: Signer;
  /** Metadata account */
  metadata: PublicKey;
  /** payer */
  payer?: Signer;
  /** Token program */
  tokenProgram?: PublicKey;
  /** System program */
  systemProgram?: PublicKey;
  /** Rent info */
  rent?: PublicKey;
  /** One time authorization printing mint authority - must be provided if using max supply. THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY. */
  oneTimePrintingAuthorizationMintAuthority: Signer;
};

// Data.
export type DeprecatedCreateMasterEditionInstructionData = {
  discriminator: number;
  createMasterEditionArgs: CreateMasterEditionArgs;
};

export type DeprecatedCreateMasterEditionInstructionDataArgs = {
  createMasterEditionArgs: CreateMasterEditionArgsArgs;
};

export function getDeprecatedCreateMasterEditionInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  DeprecatedCreateMasterEditionInstructionDataArgs,
  DeprecatedCreateMasterEditionInstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    DeprecatedCreateMasterEditionInstructionDataArgs,
    DeprecatedCreateMasterEditionInstructionData,
    DeprecatedCreateMasterEditionInstructionData
  >(
    s.struct<DeprecatedCreateMasterEditionInstructionData>(
      [
        ['discriminator', s.u8()],
        [
          'createMasterEditionArgs',
          getCreateMasterEditionArgsSerializer(context),
        ],
      ],
      { description: 'DeprecatedCreateMasterEditionInstructionData' }
    ),
    (value) =>
      ({
        ...value,
        discriminator: 2,
      } as DeprecatedCreateMasterEditionInstructionData)
  ) as Serializer<
    DeprecatedCreateMasterEditionInstructionDataArgs,
    DeprecatedCreateMasterEditionInstructionData
  >;
}

// Args.
export type DeprecatedCreateMasterEditionInstructionArgs =
  DeprecatedCreateMasterEditionInstructionDataArgs;

// Instruction.
export function deprecatedCreateMasterEdition(
  context: Pick<Context, 'serializer' | 'programs' | 'payer'>,
  input: DeprecatedCreateMasterEditionInstructionAccounts &
    DeprecatedCreateMasterEditionInstructionArgs
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
  const resolvedAccounts = {};
  const resolvedArgs = {};
  addObjectProperty(resolvedAccounts, 'payer', input.payer ?? context.payer);
  addObjectProperty(
    resolvedAccounts,
    'tokenProgram',
    input.tokenProgram ?? {
      ...context.programs.getPublicKey(
        'splToken',
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
      ),
      isWritable: false,
    }
  );
  addObjectProperty(
    resolvedAccounts,
    'systemProgram',
    input.systemProgram ?? {
      ...context.programs.getPublicKey(
        'splSystem',
        '11111111111111111111111111111111'
      ),
      isWritable: false,
    }
  );
  addObjectProperty(
    resolvedAccounts,
    'rent',
    input.rent ?? publicKey('SysvarRent111111111111111111111111111111111')
  );

  // Edition.
  keys.push({
    pubkey: resolvedAccounts.edition,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.edition, true),
  });

  // Mint.
  keys.push({
    pubkey: resolvedAccounts.mint,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.mint, true),
  });

  // Printing Mint.
  keys.push({
    pubkey: resolvedAccounts.printingMint,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.printingMint, true),
  });

  // One Time Printing Authorization Mint.
  keys.push({
    pubkey: resolvedAccounts.oneTimePrintingAuthorizationMint,
    isSigner: false,
    isWritable: isWritable(
      resolvedAccounts.oneTimePrintingAuthorizationMint,
      true
    ),
  });

  // Update Authority.
  signers.push(resolvedAccounts.updateAuthority);
  keys.push({
    pubkey: resolvedAccounts.updateAuthority.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.updateAuthority, false),
  });

  // Printing Mint Authority.
  signers.push(resolvedAccounts.printingMintAuthority);
  keys.push({
    pubkey: resolvedAccounts.printingMintAuthority.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.printingMintAuthority, false),
  });

  // Mint Authority.
  signers.push(resolvedAccounts.mintAuthority);
  keys.push({
    pubkey: resolvedAccounts.mintAuthority.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.mintAuthority, false),
  });

  // Metadata.
  keys.push({
    pubkey: resolvedAccounts.metadata,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.metadata, false),
  });

  // Payer.
  signers.push(resolvedAccounts.payer);
  keys.push({
    pubkey: resolvedAccounts.payer.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.payer, false),
  });

  // Token Program.
  keys.push({
    pubkey: resolvedAccounts.tokenProgram,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.tokenProgram, false),
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

  // One Time Printing Authorization Mint Authority.
  signers.push(resolvedAccounts.oneTimePrintingAuthorizationMintAuthority);
  keys.push({
    pubkey:
      resolvedAccounts.oneTimePrintingAuthorizationMintAuthority.publicKey,
    isSigner: true,
    isWritable: isWritable(
      resolvedAccounts.oneTimePrintingAuthorizationMintAuthority,
      false
    ),
  });

  // Data.
  const data =
    getDeprecatedCreateMasterEditionInstructionDataSerializer(
      context
    ).serialize(resolvedArgs);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
