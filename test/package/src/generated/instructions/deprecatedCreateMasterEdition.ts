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
  Pda,
  PublicKey,
  Signer,
  TransactionBuilder,
  publicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  mapSerializer,
  struct,
  u8,
} from '@metaplex-foundation/umi/serializers';
import { addAccountMeta, addObjectProperty } from '../shared';
import {
  CreateMasterEditionArgs,
  CreateMasterEditionArgsArgs,
  getCreateMasterEditionArgsSerializer,
} from '../types';

// Accounts.
export type DeprecatedCreateMasterEditionInstructionAccounts = {
  /** Unallocated edition V1 account with address as pda of ['metadata', program id, mint, 'edition'] */
  edition: PublicKey | Pda;
  /** Metadata mint */
  mint: PublicKey | Pda;
  /** Printing mint - A mint you control that can mint tokens that can be exchanged for limited editions of your master edition via the MintNewEditionFromMasterEditionViaToken endpoint */
  printingMint: PublicKey | Pda;
  /** One time authorization printing mint - A mint you control that prints tokens that gives the bearer permission to mint any number of tokens from the printing mint one time via an endpoint with the token-metadata program for your metadata. Also burns the token. */
  oneTimePrintingAuthorizationMint: PublicKey | Pda;
  /** Current Update authority key */
  updateAuthority: Signer;
  /** Printing mint authority - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY. */
  printingMintAuthority: Signer;
  /** Mint authority on the metadata's mint - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY */
  mintAuthority: Signer;
  /** Metadata account */
  metadata: PublicKey | Pda;
  /** payer */
  payer?: Signer;
  /** Token program */
  tokenProgram?: PublicKey | Pda;
  /** System program */
  systemProgram?: PublicKey | Pda;
  /** Rent info */
  rent?: PublicKey | Pda;
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
  _context: object = {}
): Serializer<
  DeprecatedCreateMasterEditionInstructionDataArgs,
  DeprecatedCreateMasterEditionInstructionData
> {
  return mapSerializer<
    DeprecatedCreateMasterEditionInstructionDataArgs,
    any,
    DeprecatedCreateMasterEditionInstructionData
  >(
    struct<DeprecatedCreateMasterEditionInstructionData>(
      [
        ['discriminator', u8()],
        ['createMasterEditionArgs', getCreateMasterEditionArgsSerializer()],
      ],
      { description: 'DeprecatedCreateMasterEditionInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 2 })
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
  const programId = context.programs.getPublicKey(
    'mplTokenMetadata',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );

  // Resolved inputs.
  const resolvedAccounts = {
    edition: [input.edition, true] as const,
    mint: [input.mint, true] as const,
    printingMint: [input.printingMint, true] as const,
    oneTimePrintingAuthorizationMint: [
      input.oneTimePrintingAuthorizationMint,
      true,
    ] as const,
    updateAuthority: [input.updateAuthority, false] as const,
    printingMintAuthority: [input.printingMintAuthority, false] as const,
    mintAuthority: [input.mintAuthority, false] as const,
    metadata: [input.metadata, false] as const,
    oneTimePrintingAuthorizationMintAuthority: [
      input.oneTimePrintingAuthorizationMintAuthority,
      false,
    ] as const,
  };
  const resolvingArgs = {};
  addObjectProperty(
    resolvedAccounts,
    'payer',
    input.payer
      ? ([input.payer, false] as const)
      : ([context.payer, false] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'tokenProgram',
    input.tokenProgram
      ? ([input.tokenProgram, false] as const)
      : ([
          context.programs.getPublicKey(
            'splToken',
            'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
          ),
          false,
        ] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'systemProgram',
    input.systemProgram
      ? ([input.systemProgram, false] as const)
      : ([
          context.programs.getPublicKey(
            'splSystem',
            '11111111111111111111111111111111'
          ),
          false,
        ] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'rent',
    input.rent
      ? ([input.rent, false] as const)
      : ([
          publicKey('SysvarRent111111111111111111111111111111111'),
          false,
        ] as const)
  );
  const resolvedArgs = { ...input, ...resolvingArgs };

  addAccountMeta(keys, signers, resolvedAccounts.edition, false);
  addAccountMeta(keys, signers, resolvedAccounts.mint, false);
  addAccountMeta(keys, signers, resolvedAccounts.printingMint, false);
  addAccountMeta(
    keys,
    signers,
    resolvedAccounts.oneTimePrintingAuthorizationMint,
    false
  );
  addAccountMeta(keys, signers, resolvedAccounts.updateAuthority, false);
  addAccountMeta(keys, signers, resolvedAccounts.printingMintAuthority, false);
  addAccountMeta(keys, signers, resolvedAccounts.mintAuthority, false);
  addAccountMeta(keys, signers, resolvedAccounts.metadata, false);
  addAccountMeta(keys, signers, resolvedAccounts.payer, false);
  addAccountMeta(keys, signers, resolvedAccounts.tokenProgram, false);
  addAccountMeta(keys, signers, resolvedAccounts.systemProgram, false);
  addAccountMeta(keys, signers, resolvedAccounts.rent, false);
  addAccountMeta(
    keys,
    signers,
    resolvedAccounts.oneTimePrintingAuthorizationMintAuthority,
    false
  );

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
