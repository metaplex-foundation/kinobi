import { Context } from '@metaplex-foundation/umi';
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  TokenStandard,
  expectPublicKey,
  findMasterEditionV2Pda,
} from '../generated';

export const resolveMasterEditionFromTokenStandard = (
  context: Pick<Context, 'eddsa' | 'programs'>,
  accounts: ResolvedAccountsWithIndices,
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
