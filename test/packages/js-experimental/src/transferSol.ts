import { Address } from '@solana/addresses';
import { getTransferSolInstruction } from './generated';
import { TransactionSigner } from '@solana/signers';

// Typetests.
const instruction = getTransferSolInstruction({
  source: {} as TransactionSigner<'1111'>,
  destination: '2222' as Address<'2222'>,
  amount: BigInt(100),
});
instruction.accounts[0].signer;
// @ts-expect-error
instruction.accounts[1].signer;
export type T2 = typeof instruction;
