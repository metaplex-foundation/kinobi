import type { Address, TransactionSigner } from '@solana/web3.js';
import { getTransferSolInstruction } from './generated';

// Typetests.
const instruction = getTransferSolInstruction({
  source: {} as TransactionSigner<'1111'>,
  destination: '2222' as Address<'2222'>,
  amount: BigInt(100),
});
instruction.accounts[0].signer;
// @ts-expect-error The second account is not a signer.
instruction.accounts[1].signer;
export type T2 = typeof instruction;
