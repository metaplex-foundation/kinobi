//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use borsh::{BorshDeserialize, BorshSerialize};

/// Accounts.
pub struct Migrate {
    /// Metadata account
    pub metadata: solana_program::pubkey::Pubkey,
    /// Master edition account
    pub master_edition: solana_program::pubkey::Pubkey,
    /// Token account
    pub token_account: solana_program::pubkey::Pubkey,
    /// Mint account
    pub mint: solana_program::pubkey::Pubkey,
    /// Update authority
    pub update_authority: solana_program::pubkey::Pubkey,
    /// Collection metadata account
    pub collection_metadata: solana_program::pubkey::Pubkey,
    /// Token Program
    pub token_program: solana_program::pubkey::Pubkey,
    /// System program
    pub system_program: solana_program::pubkey::Pubkey,
    /// Instruction sysvar account
    pub sysvar_instructions: solana_program::pubkey::Pubkey,
    /// Token Authorization Rules account
    pub authorization_rules: Option<solana_program::pubkey::Pubkey>,
}

impl Migrate {
    pub fn instruction(
        &self,
        args: MigrateInstructionArgs,
    ) -> solana_program::instruction::Instruction {
        solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts: vec![
                                          solana_program::instruction::AccountMeta::new(
              self.metadata,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.master_edition,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new(
              self.token_account,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.mint,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.update_authority,
              true
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.collection_metadata,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.token_program,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.system_program,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.sysvar_instructions,
              false
            ),
                                                                if let Some(authorization_rules) = self.authorization_rules {
              solana_program::instruction::AccountMeta::new_readonly(
                authorization_rules,
                false,
              ),
            } else {
              solana_program::instruction::AccountMeta::new_readonly(
                crate::MPL_TOKEN_METADATA_ID,
                false,
              ),
            },
                                  ],
            data: args.try_to_vec().unwrap(),
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct MigrateInstructionArgs {
    discriminator: u8,
    pub migrate_args: MigrateArgs,
}

impl MigrateInstructionArgs {
    pub fn new(migrate_args: MigrateArgs) -> Self {
        Self {
            discriminator: 50,
            migrate_args,
        }
    }
}

/// Instruction builder.
#[derive(Default)]
pub struct MigrateBuilder {
    metadata: Option<solana_program::pubkey::Pubkey>,
    master_edition: Option<solana_program::pubkey::Pubkey>,
    token_account: Option<solana_program::pubkey::Pubkey>,
    mint: Option<solana_program::pubkey::Pubkey>,
    update_authority: Option<solana_program::pubkey::Pubkey>,
    collection_metadata: Option<solana_program::pubkey::Pubkey>,
    token_program: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    sysvar_instructions: Option<solana_program::pubkey::Pubkey>,
    authorization_rules: Option<solana_program::pubkey::Pubkey>,
    migrate_args: Option<MigrateArgs>,
}

impl MigrateBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn metadata(&mut self, metadata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.metadata = Some(metadata);
        self
    }
    pub fn master_edition(&mut self, master_edition: solana_program::pubkey::Pubkey) -> &mut Self {
        self.master_edition = Some(master_edition);
        self
    }
    pub fn token_account(&mut self, token_account: solana_program::pubkey::Pubkey) -> &mut Self {
        self.token_account = Some(token_account);
        self
    }
    pub fn mint(&mut self, mint: solana_program::pubkey::Pubkey) -> &mut Self {
        self.mint = Some(mint);
        self
    }
    pub fn update_authority(
        &mut self,
        update_authority: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.update_authority = Some(update_authority);
        self
    }
    pub fn collection_metadata(
        &mut self,
        collection_metadata: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.collection_metadata = Some(collection_metadata);
        self
    }
    pub fn token_program(&mut self, token_program: solana_program::pubkey::Pubkey) -> &mut Self {
        self.token_program = Some(token_program);
        self
    }
    pub fn system_program(&mut self, system_program: solana_program::pubkey::Pubkey) -> &mut Self {
        self.system_program = Some(system_program);
        self
    }
    pub fn sysvar_instructions(
        &mut self,
        sysvar_instructions: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.sysvar_instructions = Some(sysvar_instructions);
        self
    }
    pub fn authorization_rules(
        &mut self,
        authorization_rules: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.authorization_rules = Some(authorization_rules);
        self
    }
    pub fn migrate_args(&mut self, migrate_args: MigrateArgs) -> &mut Self {
        self.migrate_args = Some(migrate_args);
        self
    }
    pub fn build(&self) -> solana_program::instruction::Instruction {
        let accounts = Migrate {
            metadata: self.metadata.expect("metadata is not set"),

            master_edition: self.master_edition.expect("master_edition is not set"),

            token_account: self.token_account.expect("token_account is not set"),

            mint: self.mint.expect("mint is not set"),

            update_authority: self.update_authority.expect("update_authority is not set"),

            collection_metadata: self
                .collection_metadata
                .expect("collection_metadata is not set"),

            token_program: self.token_program.expect("token_program is not set"),

            system_program: self.system_program.expect("system_program is not set"),

            sysvar_instructions: self
                .sysvar_instructions
                .expect("sysvar_instructions is not set"),

            authorization_rules: self.authorization_rules,
        };
        let args = MigrateInstructionArgs::new(self.migrate_args.expect("migrate_args is not set"));
        accounts.instruction(args)
    }
}

pub mod cpi {
    use super::*;

    /// `migrate` CPI instruction.
    pub struct Migrate<'a> {
        pub program: &'a solana_program::account_info::AccountInfo<'a>,
        /// Metadata account
        pub metadata: &'a solana_program::account_info::AccountInfo<'a>,
        /// Master edition account
        pub master_edition: &'a solana_program::account_info::AccountInfo<'a>,
        /// Token account
        pub token_account: &'a solana_program::account_info::AccountInfo<'a>,
        /// Mint account
        pub mint: &'a solana_program::account_info::AccountInfo<'a>,
        /// Update authority
        pub update_authority: &'a solana_program::account_info::AccountInfo<'a>,
        /// Collection metadata account
        pub collection_metadata: &'a solana_program::account_info::AccountInfo<'a>,
        /// Token Program
        pub token_program: &'a solana_program::account_info::AccountInfo<'a>,
        /// System program
        pub system_program: &'a solana_program::account_info::AccountInfo<'a>,
        /// Instruction sysvar account
        pub sysvar_instructions: &'a solana_program::account_info::AccountInfo<'a>,
        /// Token Authorization Rules account
        pub authorization_rules: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        pub args: MigrateInstructionArgs,
    }

    impl<'a> Migrate<'a> {
        pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
            self.invoke_signed(&[])
        }
        #[allow(clippy::vec_init_then_push)]
        pub fn invoke_signed(
            &self,
            signers_seeds: &[&[&[u8]]],
        ) -> solana_program::entrypoint::ProgramResult {
            let instruction = solana_program::instruction::Instruction {
                program_id: crate::MPL_TOKEN_METADATA_ID,
                accounts: vec![
                                              solana_program::instruction::AccountMeta::new(
                  *self.metadata.key,
                  false
                ),
                                                                    solana_program::instruction::AccountMeta::new_readonly(
                  *self.master_edition.key,
                  false
                ),
                                                                    solana_program::instruction::AccountMeta::new(
                  *self.token_account.key,
                  false
                ),
                                                                    solana_program::instruction::AccountMeta::new_readonly(
                  *self.mint.key,
                  false
                ),
                                                                    solana_program::instruction::AccountMeta::new_readonly(
                  *self.update_authority.key,
                  true
                ),
                                                                    solana_program::instruction::AccountMeta::new_readonly(
                  *self.collection_metadata.key,
                  false
                ),
                                                                    solana_program::instruction::AccountMeta::new_readonly(
                  *self.token_program.key,
                  false
                ),
                                                                    solana_program::instruction::AccountMeta::new_readonly(
                  *self.system_program.key,
                  false
                ),
                                                                    solana_program::instruction::AccountMeta::new_readonly(
                  *self.sysvar_instructions.key,
                  false
                ),
                                                                    if let Some(authorization_rules) = self.authorization_rules {
                  solana_program::instruction::AccountMeta::new_readonly(
                    *authorization_rules.key,
                    false,
                  ),
                } else {
                  solana_program::instruction::AccountMeta::new_readonly(
                    crate::MPL_TOKEN_METADATA_ID,
                    false,
                  ),
                },
                                      ],
                data: self.args.try_to_vec().unwrap(),
            };
            let mut account_infos = Vec::with_capacity(10 + 1);
            account_infos.push(self.program.clone());
            account_infos.push(self.metadata.clone());
            account_infos.push(self.master_edition.clone());
            account_infos.push(self.token_account.clone());
            account_infos.push(self.mint.clone());
            account_infos.push(self.update_authority.clone());
            account_infos.push(self.collection_metadata.clone());
            account_infos.push(self.token_program.clone());
            account_infos.push(self.system_program.clone());
            account_infos.push(self.sysvar_instructions.clone());
            if let Some(authorization_rules) = self.authorization_rules {
                account_infos.push(authorization_rules.clone());
            }

            if signers_seeds.is_empty() {
                solana_program::program::invoke(&instruction, &account_infos)
            } else {
                solana_program::program::invoke_signed(&instruction, &account_infos, signers_seeds)
            }
        }
    }

    /// `migrate` CPI instruction builder.
    pub struct MigrateBuilder<'a> {
        program: &'a solana_program::account_info::AccountInfo<'a>,
        metadata: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        master_edition: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        token_account: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        mint: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        update_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        collection_metadata: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        token_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        system_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        sysvar_instructions: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        authorization_rules: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        migrate_args: Option<MigrateArgs>,
    }

    impl<'a> MigrateBuilder<'a> {
        pub fn new(program: &'a solana_program::account_info::AccountInfo<'a>) -> Self {
            Self {
                program,
                metadata: None,
                master_edition: None,
                token_account: None,
                mint: None,
                update_authority: None,
                collection_metadata: None,
                token_program: None,
                system_program: None,
                sysvar_instructions: None,
                authorization_rules: None,
                migrate_args: None,
            }
        }
        pub fn metadata(
            &'a mut self,
            metadata: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.metadata = Some(metadata);
            self
        }
        pub fn master_edition(
            &'a mut self,
            master_edition: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.master_edition = Some(master_edition);
            self
        }
        pub fn token_account(
            &'a mut self,
            token_account: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.token_account = Some(token_account);
            self
        }
        pub fn mint(
            &'a mut self,
            mint: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.mint = Some(mint);
            self
        }
        pub fn update_authority(
            &'a mut self,
            update_authority: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.update_authority = Some(update_authority);
            self
        }
        pub fn collection_metadata(
            &'a mut self,
            collection_metadata: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.collection_metadata = Some(collection_metadata);
            self
        }
        pub fn token_program(
            &'a mut self,
            token_program: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.token_program = Some(token_program);
            self
        }
        pub fn system_program(
            &'a mut self,
            system_program: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.system_program = Some(system_program);
            self
        }
        pub fn sysvar_instructions(
            &'a mut self,
            sysvar_instructions: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.sysvar_instructions = Some(sysvar_instructions);
            self
        }
        pub fn authorization_rules(
            &'a mut self,
            authorization_rules: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.authorization_rules = Some(authorization_rules);
            self
        }
        pub fn migrate_args(&'a mut self, migrate_args: MigrateArgs) -> &mut Self {
            self.migrate_args = Some(migrate_args);
            self
        }
        pub fn build(&'a self) -> Migrate {
            Migrate {
                program: self.program,

                metadata: self.metadata.expect("metadata is not set"),

                master_edition: self.master_edition.expect("master_edition is not set"),

                token_account: self.token_account.expect("token_account is not set"),

                mint: self.mint.expect("mint is not set"),

                update_authority: self.update_authority.expect("update_authority is not set"),

                collection_metadata: self
                    .collection_metadata
                    .expect("collection_metadata is not set"),

                token_program: self.token_program.expect("token_program is not set"),

                system_program: self.system_program.expect("system_program is not set"),

                sysvar_instructions: self
                    .sysvar_instructions
                    .expect("sysvar_instructions is not set"),

                authorization_rules: self.authorization_rules,
                args: MigrateInstructionArgs::new(
                    self.migrate_args.expect("migrate_args is not set"),
                ),
            }
        }
    }
}
