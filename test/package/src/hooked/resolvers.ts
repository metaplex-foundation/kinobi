import {
  Context,
  PublicKey,
  Signer,
  publicKey,
} from '@metaplex-foundation/umi';
import { TokenStandard, findMasterEditionV2Pda } from '../generated';

export const resolveMasterEditionFromTokenStandard = (
  context: Pick<Context, 'eddsa' | 'programs' | 'serializer'>,
  accounts: { mint: PublicKey | Signer },
  args: { tokenStandard: TokenStandard },
  programId: PublicKey
) => {
  return args.tokenStandard === TokenStandard.NonFungible ||
    args.tokenStandard === TokenStandard.ProgrammableNonFungible
    ? findMasterEditionV2Pda(context, { mint: publicKey(accounts.mint) })
    : programId;
};
