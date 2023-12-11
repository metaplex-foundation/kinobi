import { Address } from '@solana/addresses';
import { getTransferSolInstruction } from './generated';
import { TransactionSigner } from '@solana/signers';

// Typetests.
const instruction = getTransferSolInstruction({
  source: '1111' as Address<'1111'>,
  destination: '2222' as Address<'2222'>,
  amount: BigInt(100),
});
// @ts-expect-error
instruction.accounts[0].signer;
// @ts-expect-error
instruction.accounts[1].signer;
export type T1 = typeof instruction;

const instructionWithSigners = getTransferSolInstruction({
  source: {} as TransactionSigner<'1111'>,
  destination: '2222' as Address<'2222'>,
  amount: BigInt(100),
});
instructionWithSigners.accounts[0].signer;
// @ts-expect-error
instructionWithSigners.accounts[1].signer;
export type T2 = typeof instructionWithSigners;
