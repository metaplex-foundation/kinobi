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
  context: Pick<Context, 'eddsa' | 'programs' | 'serializer'>,
  accounts: { mint: WithWritable<PublicKey | Pda | Signer> },
  args: { tokenStandard: TokenStandard },
  programId: PublicKey
): WithWritable<PublicKey | Pda> => {
  const [mint, mintIsWritable] = accounts.mint;
  return args.tokenStandard === TokenStandard.NonFungible ||
    args.tokenStandard === TokenStandard.ProgrammableNonFungible
    ? [
        findMasterEditionV2Pda(context, { mint: publicKey(mint, false) }),
        mintIsWritable,
      ]
    : [programId, false];
};
