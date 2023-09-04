import { Context, PublicKey } from '@metaplex-foundation/umi';
import {
  ResolvedAccount,
  ResolvedAccounts,
  TokenStandard,
  expectPublicKey,
  findMasterEditionV2Pda,
} from '../generated';

export const resolveMasterEditionFromTokenStandard = (
  context: Pick<Context, 'eddsa' | 'programs'>,
  accounts: ResolvedAccounts,
  args: { tokenStandard?: TokenStandard },
  programId: any,
  isWritable: any
): Partial<ResolvedAccount> => {
  return args.tokenStandard === TokenStandard.NonFungible ||
    args.tokenStandard === TokenStandard.ProgrammableNonFungible
    ? {
        value: findMasterEditionV2Pda(context, {
          mint: expectPublicKey(accounts.mint.value),
        }),
      }
    : { value: null };
};

export const resolveTokenOrAta = (
  context: any,
  accounts: ResolvedAccounts,
  args: { proof?: PublicKey[] },
  programId?: any,
  isWritable?: any
): boolean => {
  return !!args.proof && args.proof.length > 0;
};
