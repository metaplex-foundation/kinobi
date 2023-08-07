//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use borsh::{BorshDeserialize, BorshSerialize};

/// Accounts.
pub struct Burn {
    /// Metadata (pda of ['metadata', program id, mint id])
    pub metadata: solana_program::pubkey::Pubkey,
    /// Asset owner
    pub owner: solana_program::pubkey::Pubkey,
    /// Mint of token asset
    pub mint: solana_program::pubkey::Pubkey,
    /// Token account to close
    pub token_account: solana_program::pubkey::Pubkey,
    /// MasterEdition of the asset
    pub master_edition_account: solana_program::pubkey::Pubkey,
    /// SPL Token Program
    pub spl_token_program: solana_program::pubkey::Pubkey,
    /// Metadata of the Collection
    pub collection_metadata: Option<solana_program::pubkey::Pubkey>,
    /// Token Authorization Rules account
    pub authorization_rules: Option<solana_program::pubkey::Pubkey>,
    /// Token Authorization Rules Program
    pub authorization_rules_program: Option<solana_program::pubkey::Pubkey>,
}

impl Burn {
    pub fn instruction(
        &self,
        args: BurnInstructionArgs,
    ) -> solana_program::instruction::Instruction {
        solana_program::instruction::Instruction {
            program_id: crate::programs::mpl_token_metadata::ID,
            accounts: vec![
                                          solana_program::instruction::AccountMeta::new(
              self.metadata,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new(
              self.owner,
              true
            ),
                                                                solana_program::instruction::AccountMeta::new(
              self.mint,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new(
              self.token_account,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new(
              self.master_edition_account,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.spl_token_program,
              false
            ),
                                                                if let Some(collection_metadata) = self.collection_metadata {
              solana_program::instruction::AccountMeta::new(
                collection_metadata,
                false,
              ),
            } else {
              solana_program::instruction::AccountMeta::new_readonly(
                crate::programs::mpl_token_metadata::ID,
                false,
              ),
            },
                                                                if let Some(authorization_rules) = self.authorization_rules {
              solana_program::instruction::AccountMeta::new_readonly(
                authorization_rules,
                false,
              ),
            } else {
              solana_program::instruction::AccountMeta::new_readonly(
                crate::programs::mpl_token_metadata::ID,
                false,
              ),
            },
                                                                if let Some(authorization_rules_program) = self.authorization_rules_program {
              solana_program::instruction::AccountMeta::new_readonly(
                authorization_rules_program,
                false,
              ),
            } else {
              solana_program::instruction::AccountMeta::new_readonly(
                crate::programs::mpl_token_metadata::ID,
                false,
              ),
            },
                                  ],
            data: args.try_to_vec().unwrap(),
        }
    }
}

/// Instruction builder.
pub struct BurnBuilder {
    metadata: Option<solana_program::pubkey::Pubkey>,
    owner: Option<solana_program::pubkey::Pubkey>,
    mint: Option<solana_program::pubkey::Pubkey>,
    token_account: Option<solana_program::pubkey::Pubkey>,
    master_edition_account: Option<solana_program::pubkey::Pubkey>,
    spl_token_program: Option<solana_program::pubkey::Pubkey>,
    collection_metadata: Option<solana_program::pubkey::Pubkey>,
    authorization_rules: Option<solana_program::pubkey::Pubkey>,
    authorization_rules_program: Option<solana_program::pubkey::Pubkey>,
    burn_args: Option<BurnArgs>,
}

impl BurnBuilder {
    pub fn metadata(&mut self, metadata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.metadata = Some(metadata);
        self
    }
    pub fn owner(&mut self, owner: solana_program::pubkey::Pubkey) -> &mut Self {
        self.owner = Some(owner);
        self
    }
    pub fn mint(&mut self, mint: solana_program::pubkey::Pubkey) -> &mut Self {
        self.mint = Some(mint);
        self
    }
    pub fn token_account(&mut self, token_account: solana_program::pubkey::Pubkey) -> &mut Self {
        self.token_account = Some(token_account);
        self
    }
    pub fn master_edition_account(
        &mut self,
        master_edition_account: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.master_edition_account = Some(master_edition_account);
        self
    }
    pub fn spl_token_program(
        &mut self,
        spl_token_program: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.spl_token_program = Some(spl_token_program);
        self
    }
    pub fn collection_metadata(
        &mut self,
        collection_metadata: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.collection_metadata = Some(collection_metadata);
        self
    }
    pub fn authorization_rules(
        &mut self,
        authorization_rules: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.authorization_rules = Some(authorization_rules);
        self
    }
    pub fn authorization_rules_program(
        &mut self,
        authorization_rules_program: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.authorization_rules_program = Some(authorization_rules_program);
        self
    }
    pub fn burn_args(&mut self, burn_args: BurnArgs) -> &mut Self {
        self.burn_args = Some(burn_args);
        self
    }
    pub fn build(&self) -> solana_program::instruction::Instruction {
        let accounts = Burn {
            metadata: self.metadata.expect("metadata is not set"),

            owner: self.owner.expect("owner is not set"),

            mint: self.mint.expect("mint is not set"),

            token_account: self.token_account.expect("token_account is not set"),

            master_edition_account: self
                .master_edition_account
                .expect("master_edition_account is not set"),

            spl_token_program: self
                .spl_token_program
                .expect("spl_token_program is not set"),

            collection_metadata: self.collection_metadata,

            authorization_rules: self.authorization_rules,

            authorization_rules_program: self.authorization_rules_program,
        };
        let args = BurnInstructionArgs::new(self.burn_args.expect("burn_args is not set"));
        accounts.instruction(args)
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct BurnInstructionArgs {
    discriminator: u8,
    pub burn_args: BurnArgs,
}

impl BurnInstructionArgs {
    pub fn new(burn_args: BurnArgs) -> Self {
        Self {
            discriminator: 44,
            burn_args,
        }
    }
}
