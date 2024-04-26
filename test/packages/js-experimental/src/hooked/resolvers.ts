import { Address, ProgramDerivedAddress } from '@solana/web3.js';
import { TokenStandard, findMasterEditionV2Pda } from '../generated';
import { ResolvedAccount, expectAddress } from '../generated/shared';

export const resolveMasterEditionFromTokenStandard = async ({
  accounts,
  args,
}: {
  accounts: Record<string, ResolvedAccount>;
  args: { tokenStandard?: TokenStandard | undefined };
}): Promise<Partial<{ value: ProgramDerivedAddress | null }>> => {
  return args.tokenStandard === TokenStandard.NonFungible ||
    args.tokenStandard === TokenStandard.ProgrammableNonFungible
    ? {
        value: await findMasterEditionV2Pda({
          mint: expectAddress(accounts.mint?.value),
        }),
      }
    : { value: null };
};

export const resolveTokenOrAta = ({
  args,
}: {
  args: { proof?: Address[] | undefined };
}): boolean => {
  return !!args.proof && args.proof.length > 0;
};
