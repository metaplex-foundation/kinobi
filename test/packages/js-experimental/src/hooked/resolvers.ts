import { Address, ProgramDerivedAddress } from '@solana/addresses';
import {
  Context,
  ResolvedAccount,
  TokenStandard,
  expectAddress,
  findMasterEditionV2Pda,
} from '../generated';

export const resolveMasterEditionFromTokenStandard = async (
  context: Pick<Context, 'getProgramAddress' | 'getProgramDerivedAddress'>,
  accounts: Record<string, ResolvedAccount>,
  args: { tokenStandard?: TokenStandard },
  _programId: any,
  _isWritable: any
): Promise<Partial<{ value: ProgramDerivedAddress | null }>> => {
  return args.tokenStandard === TokenStandard.NonFungible ||
    args.tokenStandard === TokenStandard.ProgrammableNonFungible
    ? {
        value: await findMasterEditionV2Pda(context, {
          mint: expectAddress(accounts.mint?.value),
        }),
      }
    : { value: null };
};

export const resolveTokenOrAta = async (
  _context: any,
  _accounts: Record<string, ResolvedAccount>,
  args: { proof?: Address[] },
  _programId?: any,
  _isWritable?: any
): Promise<boolean> => {
  return !!args.proof && args.proof.length > 0;
};
