//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use borsh::{BorshDeserialize, BorshSerialize};

/// Accounts.
pub struct Mint {
    /// Token account
    pub token: solana_program::pubkey::Pubkey,
    /// Metadata account key (pda of ['metadata', program id, mint id])
    pub metadata: solana_program::pubkey::Pubkey,
    /// Master Edition account
    pub master_edition: Option<solana_program::pubkey::Pubkey>,
    /// Mint of token asset
    pub mint: solana_program::pubkey::Pubkey,
    /// Payer
    pub payer: solana_program::pubkey::Pubkey,
    /// (Mint or Update) authority
    pub authority: solana_program::pubkey::Pubkey,
    /// System program
    pub system_program: solana_program::pubkey::Pubkey,
    /// Instructions sysvar account
    pub sysvar_instructions: solana_program::pubkey::Pubkey,
    /// SPL Token program
    pub spl_token_program: solana_program::pubkey::Pubkey,
    /// SPL Associated Token Account program
    pub spl_ata_program: solana_program::pubkey::Pubkey,
    /// Token Authorization Rules program
    pub authorization_rules_program: Option<solana_program::pubkey::Pubkey>,
    /// Token Authorization Rules account
    pub authorization_rules: Option<solana_program::pubkey::Pubkey>,
}

impl Mint {
    pub fn instruction(
        &self,
        args: MintInstructionArgs,
    ) -> solana_program::instruction::Instruction {
        solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts: vec![
                                          solana_program::instruction::AccountMeta::new(
              self.token,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.metadata,
              false
            ),
                                                                if let Some(master_edition) = self.master_edition {
              solana_program::instruction::AccountMeta::new_readonly(
                master_edition,
                false,
              ),
            } else {
              solana_program::instruction::AccountMeta::new_readonly(
                crate::MPL_TOKEN_METADATA_ID,
                false,
              ),
            },
                                                                solana_program::instruction::AccountMeta::new(
              self.mint,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new(
              self.payer,
              true
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.authority,
              true
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.system_program,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.sysvar_instructions,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.spl_token_program,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.spl_ata_program,
              false
            ),
                                                                if let Some(authorization_rules_program) = self.authorization_rules_program {
              solana_program::instruction::AccountMeta::new_readonly(
                authorization_rules_program,
                false,
              ),
            } else {
              solana_program::instruction::AccountMeta::new_readonly(
                crate::MPL_TOKEN_METADATA_ID,
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
pub struct MintInstructionArgs {
    discriminator: u8,
    pub mint_args: MintArgs,
}

impl MintInstructionArgs {
    pub fn new(mint_args: MintArgs) -> Self {
        Self {
            discriminator: 42,
            mint_args,
        }
    }
}

/// Instruction builder.
#[derive(Default)]
pub struct MintBuilder {
    token: Option<solana_program::pubkey::Pubkey>,
    metadata: Option<solana_program::pubkey::Pubkey>,
    master_edition: Option<solana_program::pubkey::Pubkey>,
    mint: Option<solana_program::pubkey::Pubkey>,
    payer: Option<solana_program::pubkey::Pubkey>,
    authority: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    sysvar_instructions: Option<solana_program::pubkey::Pubkey>,
    spl_token_program: Option<solana_program::pubkey::Pubkey>,
    spl_ata_program: Option<solana_program::pubkey::Pubkey>,
    authorization_rules_program: Option<solana_program::pubkey::Pubkey>,
    authorization_rules: Option<solana_program::pubkey::Pubkey>,
    mint_args: Option<MintArgs>,
}

impl MintBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn token(&mut self, token: solana_program::pubkey::Pubkey) -> &mut Self {
        self.token = Some(token);
        self
    }
    pub fn metadata(&mut self, metadata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.metadata = Some(metadata);
        self
    }
    pub fn master_edition(&mut self, master_edition: solana_program::pubkey::Pubkey) -> &mut Self {
        self.master_edition = Some(master_edition);
        self
    }
    pub fn mint(&mut self, mint: solana_program::pubkey::Pubkey) -> &mut Self {
        self.mint = Some(mint);
        self
    }
    pub fn payer(&mut self, payer: solana_program::pubkey::Pubkey) -> &mut Self {
        self.payer = Some(payer);
        self
    }
    pub fn authority(&mut self, authority: solana_program::pubkey::Pubkey) -> &mut Self {
        self.authority = Some(authority);
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
    pub fn spl_token_program(
        &mut self,
        spl_token_program: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.spl_token_program = Some(spl_token_program);
        self
    }
    pub fn spl_ata_program(
        &mut self,
        spl_ata_program: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.spl_ata_program = Some(spl_ata_program);
        self
    }
    pub fn authorization_rules_program(
        &mut self,
        authorization_rules_program: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.authorization_rules_program = Some(authorization_rules_program);
        self
    }
    pub fn authorization_rules(
        &mut self,
        authorization_rules: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.authorization_rules = Some(authorization_rules);
        self
    }
    pub fn mint_args(&mut self, mint_args: MintArgs) -> &mut Self {
        self.mint_args = Some(mint_args);
        self
    }
    pub fn build(&self) -> solana_program::instruction::Instruction {
        let accounts = Mint {
            token: self.token.expect("token is not set"),

            metadata: self.metadata.expect("metadata is not set"),

            master_edition: self.master_edition,

            mint: self.mint.expect("mint is not set"),

            payer: self.payer.expect("payer is not set"),

            authority: self.authority.expect("authority is not set"),

            system_program: self.system_program.expect("system_program is not set"),

            sysvar_instructions: self
                .sysvar_instructions
                .expect("sysvar_instructions is not set"),

            spl_token_program: self
                .spl_token_program
                .expect("spl_token_program is not set"),

            spl_ata_program: self.spl_ata_program.expect("spl_ata_program is not set"),

            authorization_rules_program: self.authorization_rules_program,

            authorization_rules: self.authorization_rules,
        };
        let args = MintInstructionArgs::new(self.mint_args.expect("mint_args is not set"));
        accounts.instruction(args)
    }
}

pub mod cpi {
    use super::*;

    /// `mint` CPI instruction.
    pub struct Mint<'a> {
        pub program: &'a solana_program::account_info::AccountInfo<'a>,
        /// Token account
        pub token: &'a solana_program::account_info::AccountInfo<'a>,
        /// Metadata account key (pda of ['metadata', program id, mint id])
        pub metadata: &'a solana_program::account_info::AccountInfo<'a>,
        /// Master Edition account
        pub master_edition: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        /// Mint of token asset
        pub mint: &'a solana_program::account_info::AccountInfo<'a>,
        /// Payer
        pub payer: &'a solana_program::account_info::AccountInfo<'a>,
        /// (Mint or Update) authority
        pub authority: &'a solana_program::account_info::AccountInfo<'a>,
        /// System program
        pub system_program: &'a solana_program::account_info::AccountInfo<'a>,
        /// Instructions sysvar account
        pub sysvar_instructions: &'a solana_program::account_info::AccountInfo<'a>,
        /// SPL Token program
        pub spl_token_program: &'a solana_program::account_info::AccountInfo<'a>,
        /// SPL Associated Token Account program
        pub spl_ata_program: &'a solana_program::account_info::AccountInfo<'a>,
        /// Token Authorization Rules program
        pub authorization_rules_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        /// Token Authorization Rules account
        pub authorization_rules: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        pub args: MintInstructionArgs,
    }

    impl<'a> Mint<'a> {
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
                  *self.token.key,
                  false
                ),
                                                                    solana_program::instruction::AccountMeta::new_readonly(
                  *self.metadata.key,
                  false
                ),
                                                                    if let Some(master_edition) = self.master_edition {
                  solana_program::instruction::AccountMeta::new_readonly(
                    *master_edition.key,
                    false,
                  ),
                } else {
                  solana_program::instruction::AccountMeta::new_readonly(
                    crate::MPL_TOKEN_METADATA_ID,
                    false,
                  ),
                },
                                                                    solana_program::instruction::AccountMeta::new(
                  *self.mint.key,
                  false
                ),
                                                                    solana_program::instruction::AccountMeta::new(
                  *self.payer.key,
                  true
                ),
                                                                    solana_program::instruction::AccountMeta::new_readonly(
                  *self.authority.key,
                  true
                ),
                                                                    solana_program::instruction::AccountMeta::new_readonly(
                  *self.system_program.key,
                  false
                ),
                                                                    solana_program::instruction::AccountMeta::new_readonly(
                  *self.sysvar_instructions.key,
                  false
                ),
                                                                    solana_program::instruction::AccountMeta::new_readonly(
                  *self.spl_token_program.key,
                  false
                ),
                                                                    solana_program::instruction::AccountMeta::new_readonly(
                  *self.spl_ata_program.key,
                  false
                ),
                                                                    if let Some(authorization_rules_program) = self.authorization_rules_program {
                  solana_program::instruction::AccountMeta::new_readonly(
                    *authorization_rules_program.key,
                    false,
                  ),
                } else {
                  solana_program::instruction::AccountMeta::new_readonly(
                    crate::MPL_TOKEN_METADATA_ID,
                    false,
                  ),
                },
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
            let mut account_infos = Vec::with_capacity(12 + 1);
            account_infos.push(self.program.clone());
            account_infos.push(self.token.clone());
            account_infos.push(self.metadata.clone());
            if let Some(master_edition) = self.master_edition {
                account_infos.push(master_edition.clone());
            }
            account_infos.push(self.mint.clone());
            account_infos.push(self.payer.clone());
            account_infos.push(self.authority.clone());
            account_infos.push(self.system_program.clone());
            account_infos.push(self.sysvar_instructions.clone());
            account_infos.push(self.spl_token_program.clone());
            account_infos.push(self.spl_ata_program.clone());
            if let Some(authorization_rules_program) = self.authorization_rules_program {
                account_infos.push(authorization_rules_program.clone());
            }
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

    /// `mint` CPI instruction builder.
    pub struct MintBuilder<'a> {
        program: &'a solana_program::account_info::AccountInfo<'a>,
        token: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        metadata: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        master_edition: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        mint: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        payer: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        system_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        sysvar_instructions: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        spl_token_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        spl_ata_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        authorization_rules_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        authorization_rules: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        mint_args: Option<MintArgs>,
    }

    impl<'a> MintBuilder<'a> {
        pub fn new(program: &'a solana_program::account_info::AccountInfo<'a>) -> Self {
            Self {
                program,
                token: None,
                metadata: None,
                master_edition: None,
                mint: None,
                payer: None,
                authority: None,
                system_program: None,
                sysvar_instructions: None,
                spl_token_program: None,
                spl_ata_program: None,
                authorization_rules_program: None,
                authorization_rules: None,
                mint_args: None,
            }
        }
        pub fn token(
            &'a mut self,
            token: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.token = Some(token);
            self
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
        pub fn mint(
            &'a mut self,
            mint: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.mint = Some(mint);
            self
        }
        pub fn payer(
            &'a mut self,
            payer: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.payer = Some(payer);
            self
        }
        pub fn authority(
            &'a mut self,
            authority: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.authority = Some(authority);
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
        pub fn spl_token_program(
            &'a mut self,
            spl_token_program: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.spl_token_program = Some(spl_token_program);
            self
        }
        pub fn spl_ata_program(
            &'a mut self,
            spl_ata_program: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.spl_ata_program = Some(spl_ata_program);
            self
        }
        pub fn authorization_rules_program(
            &'a mut self,
            authorization_rules_program: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.authorization_rules_program = Some(authorization_rules_program);
            self
        }
        pub fn authorization_rules(
            &'a mut self,
            authorization_rules: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.authorization_rules = Some(authorization_rules);
            self
        }
        pub fn mint_args(&'a mut self, mint_args: MintArgs) -> &mut Self {
            self.mint_args = Some(mint_args);
            self
        }
        pub fn build(&'a self) -> Mint {
            Mint {
                program: self.program,

                token: self.token.expect("token is not set"),

                metadata: self.metadata.expect("metadata is not set"),

                master_edition: self.master_edition,

                mint: self.mint.expect("mint is not set"),

                payer: self.payer.expect("payer is not set"),

                authority: self.authority.expect("authority is not set"),

                system_program: self.system_program.expect("system_program is not set"),

                sysvar_instructions: self
                    .sysvar_instructions
                    .expect("sysvar_instructions is not set"),

                spl_token_program: self
                    .spl_token_program
                    .expect("spl_token_program is not set"),

                spl_ata_program: self.spl_ata_program.expect("spl_ata_program is not set"),

                authorization_rules_program: self.authorization_rules_program,

                authorization_rules: self.authorization_rules,
                args: MintInstructionArgs::new(self.mint_args.expect("mint_args is not set")),
            }
        }
    }
}
