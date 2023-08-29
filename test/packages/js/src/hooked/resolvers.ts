import {
  Context,
  Pda,
  PublicKey,
  Signer,
  publicKey,
} from '@metaplex-foundation/umi';
import {
  ResolvedAccount,
  TokenStandard,
  findMasterEditionV2Pda,
} from '../generated';

export const resolveMasterEditionFromTokenStandard = (
  context: Pick<Context, 'eddsa' | 'programs'>,
  accounts: { mint: ResolvedAccount<PublicKey | Pda> },
  args: { tokenStandard: TokenStandard },
  programId: any,
  isWritable: any
): Partial<ResolvedAccount> => {
  return args.tokenStandard === TokenStandard.NonFungible ||
    args.tokenStandard === TokenStandard.ProgrammableNonFungible
    ? {
        value: findMasterEditionV2Pda(context, {
          mint: publicKey(accounts.mint.value, false),
        }),
      }
    : { value: null };
};
