import { Context, Pda, PublicKey } from '@metaplex-foundation/umi';
import {
  ResolvedAccounts,
  TokenStandard,
  expectPublicKey,
  findMasterEditionV2Pda,
} from '../generated';

export const resolveMasterEditionFromTokenStandard = (
  context: Pick<Context, 'eddsa' | 'programs'>,
  accounts: ResolvedAccounts,
  args: { tokenStandard?: TokenStandard },
  _programId: any,
  _isWritable: any
): Partial<{ value: Pda | null }> => {
  return args.tokenStandard === TokenStandard.NonFungible ||
    args.tokenStandard === TokenStandard.ProgrammableNonFungible
    ? {
        value: findMasterEditionV2Pda(context, {
          mint: expectPublicKey(accounts.mint?.value),
        }),
      }
    : { value: null };
};

export const resolveTokenOrAta = (
  _context: any,
  _accounts: ResolvedAccounts,
  args: { proof?: PublicKey[] },
  _programId?: any,
  _isWritable?: any
): boolean => {
  return !!args.proof && args.proof.length > 0;
};
