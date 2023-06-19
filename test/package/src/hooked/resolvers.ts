import {
  Context,
  Pda,
  PublicKey,
  Signer,
  publicKey,
} from '@metaplex-foundation/umi';
import {
  TokenStandard,
  WithWritable,
  findMasterEditionV2Pda,
} from '../generated';

export const resolveMasterEditionFromTokenStandard = (
  context: Pick<Context, 'eddsa' | 'programs'>,
  accounts: { mint: WithWritable<PublicKey | Pda | Signer> },
  args: { tokenStandard: TokenStandard },
  programId: PublicKey,
  isWritable: boolean
): WithWritable<PublicKey | Pda> => {
  return args.tokenStandard === TokenStandard.NonFungible ||
    args.tokenStandard === TokenStandard.ProgrammableNonFungible
    ? [
        findMasterEditionV2Pda(context, {
          mint: publicKey(accounts.mint[0], false),
        }),
        isWritable,
      ]
    : [programId, false];
};
