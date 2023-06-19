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
import { resolveMasterEditionFromTokenStandard } from '../../hooked';
import { PickPartial, addAccountMeta, addObjectProperty } from '../shared';
import {
  TokenStandard,
  TokenStandardArgs,
  TransferArgs,
  TransferArgsArgs,
  getTransferArgsSerializer,
} from '../types';

// Accounts.
export type TransferInstructionAccounts = {
  /** Transfer authority (token or delegate owner) */
  authority?: Signer;
  /** Delegate record PDA */
  delegateRecord?: PublicKey | Pda;
  /** Token account */
  token: PublicKey | Pda;
  /** Token account owner */
  tokenOwner: PublicKey | Pda;
  /** Destination token account */
  destination: PublicKey | Pda;
  /** Destination token account owner */
  destinationOwner: PublicKey | Pda;
  /** Mint of token asset */
  mint: PublicKey | Pda;
  /** Metadata (pda of ['metadata', program id, mint id]) */
  metadata: PublicKey | Pda;
  /** Master Edition of token asset */
  masterEdition?: PublicKey | Pda;
  /** SPL Token Program */
  splTokenProgram?: PublicKey | Pda;
  /** SPL Associated Token Account program */
  splAtaProgram?: PublicKey | Pda;
  /** System Program */
  systemProgram?: PublicKey | Pda;
  /** Instructions sysvar account */
  sysvarInstructions?: PublicKey | Pda;
  /** Token Authorization Rules Program */
  authorizationRulesProgram?: PublicKey | Pda;
  /** Token Authorization Rules account */
  authorizationRules?: PublicKey | Pda;
};

// Data.
export type TransferInstructionData = {
  discriminator: number;
  transferArgs: TransferArgs;
};

export type TransferInstructionDataArgs = { transferArgs: TransferArgsArgs };

export function getTransferInstructionDataSerializer(
  _context: object = {}
): Serializer<TransferInstructionDataArgs, TransferInstructionData> {
  return mapSerializer<
    TransferInstructionDataArgs,
    any,
    TransferInstructionData
  >(
    struct<TransferInstructionData>(
      [
        ['discriminator', u8()],
        ['transferArgs', getTransferArgsSerializer()],
      ],
      { description: 'TransferInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 46 })
  ) as Serializer<TransferInstructionDataArgs, TransferInstructionData>;
}

// Extra Args.
export type TransferInstructionExtraArgs = { tokenStandard: TokenStandardArgs };

// Args.
export type TransferInstructionArgs = PickPartial<
  TransferInstructionDataArgs & TransferInstructionExtraArgs,
  'tokenStandard'
>;

// Instruction.
export function transfer(
  context: Pick<
    Context,
    'serializer' | 'programs' | 'eddsa' | 'identity' | 'payer'
  >,
  input: TransferInstructionAccounts & TransferInstructionArgs
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
    token: [input.token, true] as const,
    tokenOwner: [input.tokenOwner, false] as const,
    destination: [input.destination, true] as const,
    destinationOwner: [input.destinationOwner, false] as const,
    mint: [input.mint, false] as const,
    metadata: [input.metadata, true] as const,
  };
  const resolvingArgs = {};
  addObjectProperty(
    resolvedAccounts,
    'authority',
    input.authority
      ? ([input.authority, true] as const)
      : ([context.identity, true] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'delegateRecord',
    input.delegateRecord
      ? ([input.delegateRecord, true] as const)
      : ([programId, false] as const)
  );
  addObjectProperty(
    resolvingArgs,
    'tokenStandard',
    input.tokenStandard ?? TokenStandard.NonFungible
  );
  addObjectProperty(
    resolvedAccounts,
    'masterEdition',
    input.masterEdition
      ? ([input.masterEdition, false] as const)
      : resolveMasterEditionFromTokenStandard(
          context,
          { ...input, ...resolvedAccounts },
          { ...input, ...resolvingArgs },
          programId,
          false
        )
  );
  addObjectProperty(
    resolvedAccounts,
    'splTokenProgram',
    input.splTokenProgram
      ? ([input.splTokenProgram, false] as const)
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
    'splAtaProgram',
    input.splAtaProgram
      ? ([input.splAtaProgram, false] as const)
      : ([
          context.programs.getPublicKey(
            'splAssociatedToken',
            'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
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
    'sysvarInstructions',
    input.sysvarInstructions
      ? ([input.sysvarInstructions, false] as const)
      : ([
          publicKey('Sysvar1nstructions1111111111111111111111111'),
          false,
        ] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'authorizationRulesProgram',
    input.authorizationRulesProgram
      ? ([input.authorizationRulesProgram, false] as const)
      : ([programId, false] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'authorizationRules',
    input.authorizationRules
      ? ([input.authorizationRules, false] as const)
      : ([programId, false] as const)
  );
  const resolvedArgs = { ...input, ...resolvingArgs };

  addAccountMeta(keys, signers, resolvedAccounts.authority, false);
  addAccountMeta(keys, signers, resolvedAccounts.delegateRecord, false);
  addAccountMeta(keys, signers, resolvedAccounts.token, false);
  addAccountMeta(keys, signers, resolvedAccounts.tokenOwner, false);
  addAccountMeta(keys, signers, resolvedAccounts.destination, false);
  addAccountMeta(keys, signers, resolvedAccounts.destinationOwner, false);
  addAccountMeta(keys, signers, resolvedAccounts.mint, false);
  addAccountMeta(keys, signers, resolvedAccounts.metadata, false);
  addAccountMeta(keys, signers, resolvedAccounts.masterEdition, false);
  addAccountMeta(keys, signers, resolvedAccounts.splTokenProgram, false);
  addAccountMeta(keys, signers, resolvedAccounts.splAtaProgram, false);
  addAccountMeta(keys, signers, resolvedAccounts.systemProgram, false);
  addAccountMeta(keys, signers, resolvedAccounts.sysvarInstructions, false);
  addAccountMeta(
    keys,
    signers,
    resolvedAccounts.authorizationRulesProgram,
    false
  );
  addAccountMeta(keys, signers, resolvedAccounts.authorizationRules, false);

  // Data.
  const data =
    getTransferInstructionDataSerializer(context).serialize(resolvedArgs);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
