import {
  AccountMeta,
  Context,
  PublicKey,
  Serializer,
  Signer,
  WrappedInstruction,
  getProgramAddressWithFallback,
  mapSerializer,
} from '@lorisleiva/js-core';
import {
  CreateMasterEditionInstructionAccounts,
  CreateMasterEditionInstructionArgs,
  getCreateMasterEditionInstructionDataSerializer,
} from './generated';

// Instruction.
export function createMasterEdition(
  context: {
    serializer: Context['serializer'];
    eddsa: Context['eddsa'];
    payer: Context['payer'];
    programs?: Context['programs'];
  },
  input: CreateMasterEditionInstructionAccounts &
    CreateMasterEditionInstructionArgs
): WrappedInstruction {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId: PublicKey = getProgramAddressWithFallback(
    context,
    'mplTokenMetadata',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );

  // Edition.
  keys.push({ pubkey: input.edition, isSigner: false, isWritable: true });

  // Mint.
  keys.push({ pubkey: input.mint, isSigner: false, isWritable: true });

  // Update Authority.
  signers.push(input.updateAuthority);
  keys.push({
    pubkey: input.updateAuthority.publicKey,
    isSigner: true,
    isWritable: false,
  });

  // Mint Authority.
  signers.push(input.mintAuthority);
  keys.push({
    pubkey: input.mintAuthority.publicKey,
    isSigner: true,
    isWritable: false,
  });

  // Payer.
  if (input.payer) {
    signers.push(input.payer);
    keys.push({
      pubkey: input.payer.publicKey,
      isSigner: true,
      isWritable: true,
    });
  } else {
    signers.push(context.payer);
    keys.push({
      pubkey: context.payer.publicKey,
      isSigner: true,
      isWritable: true,
    });
  }

  // Metadata.
  keys.push({ pubkey: input.metadata, isSigner: false, isWritable: false });

  // Token Program.
  if (input.tokenProgram) {
    keys.push({
      pubkey: input.tokenProgram,
      isSigner: false,
      isWritable: false,
    });
  } else {
    keys.push({
      pubkey: getProgramAddressWithFallback(
        context,
        'splToken',
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
      ),
      isSigner: false,
      isWritable: false,
    });
  }

  // System Program.
  if (input.systemProgram) {
    keys.push({
      pubkey: input.systemProgram,
      isSigner: false,
      isWritable: false,
    });
  } else {
    keys.push({
      pubkey: getProgramAddressWithFallback(
        context,
        'splSystem',
        '11111111111111111111111111111111'
      ),
      isSigner: false,
      isWritable: false,
    });
  }

  // Rent.
  if (input.rent) {
    keys.push({ pubkey: input.rent, isSigner: false, isWritable: false });
  } else {
    keys.push({
      pubkey: context.eddsa.createPublicKey(
        'SysvarRent111111111111111111111111111111111'
      ),
      isSigner: false,
      isWritable: false,
    });
  }

  // Data.
  const data =
    getCreateMasterEditionInstructionDataSerializer(context).serialize(input);

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain: 0,
  };
}
