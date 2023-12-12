import { Address, ProgramDerivedAddress } from '@solana/addresses';
import {
  Context,
  ResolvedAccount,
  TokenStandard,
  expectAddress,
  findMasterEditionV2Pda,
} from '../generated';

export const resolveMasterEditionFromTokenStandard = async ({
  context,
  accounts,
  args,
}: {
  context: Pick<Context, 'getProgramAddress' | 'getProgramDerivedAddress'>;
  accounts: Record<string, ResolvedAccount>;
  args: { tokenStandard?: TokenStandard };
}): Promise<Partial<{ value: ProgramDerivedAddress | null }>> => {
  return args.tokenStandard === TokenStandard.NonFungible ||
    args.tokenStandard === TokenStandard.ProgrammableNonFungible
    ? {
        value: await findMasterEditionV2Pda(context, {
          mint: expectAddress(accounts.mint?.value),
        }),
      }
    : { value: null };
};

export const resolveTokenOrAta = ({
  args,
}: {
  args: { proof?: Address[] };
}): boolean => {
  return !!args.proof && args.proof.length > 0;
};
