//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use borsh::BorshDeserialize;
use borsh::BorshSerialize;

/// Accounts.
pub struct CreateEscrowAccount {
    /// Escrow account
    pub escrow: solana_program::pubkey::Pubkey,
    /// Metadata account
    pub metadata: solana_program::pubkey::Pubkey,
    /// Mint account
    pub mint: solana_program::pubkey::Pubkey,
    /// Token account of the token
    pub token_account: solana_program::pubkey::Pubkey,
    /// Edition account
    pub edition: solana_program::pubkey::Pubkey,
    /// Wallet paying for the transaction and new account
    pub payer: solana_program::pubkey::Pubkey,
    /// System program
    pub system_program: solana_program::pubkey::Pubkey,
    /// Instructions sysvar account
    pub sysvar_instructions: solana_program::pubkey::Pubkey,
    /// Authority/creator of the escrow account
    pub authority: Option<solana_program::pubkey::Pubkey>,
}

impl CreateEscrowAccount {
    pub fn instruction(&self) -> solana_program::instruction::Instruction {
        let args = CreateEscrowAccountInstructionArgs::new();
        solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts: vec![
                solana_program::instruction::AccountMeta::new(self.escrow, false),
                solana_program::instruction::AccountMeta::new(self.metadata, false),
                solana_program::instruction::AccountMeta::new_readonly(self.mint, false),
                solana_program::instruction::AccountMeta::new_readonly(self.token_account, false),
                solana_program::instruction::AccountMeta::new_readonly(self.edition, false),
                solana_program::instruction::AccountMeta::new(self.payer, true),
                solana_program::instruction::AccountMeta::new_readonly(self.system_program, false),
                solana_program::instruction::AccountMeta::new_readonly(
                    self.sysvar_instructions,
                    false,
                ),
                if let Some(authority) = self.authority {
                    solana_program::instruction::AccountMeta::new_readonly(authority, true)
                } else {
                    solana_program::instruction::AccountMeta::new_readonly(
                        crate::MPL_TOKEN_METADATA_ID,
                        false,
                    )
                },
            ],
            data: args.try_to_vec().unwrap(),
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
struct CreateEscrowAccountInstructionArgs {
    discriminator: u8,
}

impl CreateEscrowAccountInstructionArgs {
    pub fn new() -> Self {
        Self { discriminator: 38 }
    }
}

/// Instruction builder.
#[derive(Default)]
pub struct CreateEscrowAccountBuilder {
    escrow: Option<solana_program::pubkey::Pubkey>,
    metadata: Option<solana_program::pubkey::Pubkey>,
    mint: Option<solana_program::pubkey::Pubkey>,
    token_account: Option<solana_program::pubkey::Pubkey>,
    edition: Option<solana_program::pubkey::Pubkey>,
    payer: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    sysvar_instructions: Option<solana_program::pubkey::Pubkey>,
    authority: Option<solana_program::pubkey::Pubkey>,
}

impl CreateEscrowAccountBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn escrow(&mut self, escrow: solana_program::pubkey::Pubkey) -> &mut Self {
        self.escrow = Some(escrow);
        self
    }
    pub fn metadata(&mut self, metadata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.metadata = Some(metadata);
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
    pub fn edition(&mut self, edition: solana_program::pubkey::Pubkey) -> &mut Self {
        self.edition = Some(edition);
        self
    }
    pub fn payer(&mut self, payer: solana_program::pubkey::Pubkey) -> &mut Self {
        self.payer = Some(payer);
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
    pub fn authority(&mut self, authority: solana_program::pubkey::Pubkey) -> &mut Self {
        self.authority = Some(authority);
        self
    }
    pub fn build(&self) -> solana_program::instruction::Instruction {
        let accounts = CreateEscrowAccount {
            escrow: self.escrow.expect("escrow is not set"),

            metadata: self.metadata.expect("metadata is not set"),

            mint: self.mint.expect("mint is not set"),

            token_account: self.token_account.expect("token_account is not set"),

            edition: self.edition.expect("edition is not set"),

            payer: self.payer.expect("payer is not set"),

            system_program: self.system_program.expect("system_program is not set"),

            sysvar_instructions: self
                .sysvar_instructions
                .expect("sysvar_instructions is not set"),

            authority: self.authority,
        };
        accounts.instruction()
    }
}

pub mod cpi {
    use super::*;

    /// `create_escrow_account` CPI instruction.
    pub struct CreateEscrowAccount<'a> {
        pub program: &'a solana_program::account_info::AccountInfo<'a>,
        /// Escrow account
        pub escrow: &'a solana_program::account_info::AccountInfo<'a>,
        /// Metadata account
        pub metadata: &'a solana_program::account_info::AccountInfo<'a>,
        /// Mint account
        pub mint: &'a solana_program::account_info::AccountInfo<'a>,
        /// Token account of the token
        pub token_account: &'a solana_program::account_info::AccountInfo<'a>,
        /// Edition account
        pub edition: &'a solana_program::account_info::AccountInfo<'a>,
        /// Wallet paying for the transaction and new account
        pub payer: &'a solana_program::account_info::AccountInfo<'a>,
        /// System program
        pub system_program: &'a solana_program::account_info::AccountInfo<'a>,
        /// Instructions sysvar account
        pub sysvar_instructions: &'a solana_program::account_info::AccountInfo<'a>,
        /// Authority/creator of the escrow account
        pub authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    }

    impl<'a> CreateEscrowAccount<'a> {
        pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
            self.invoke_signed(&[])
        }
        #[allow(clippy::vec_init_then_push)]
        pub fn invoke_signed(
            &self,
            signers_seeds: &[&[&[u8]]],
        ) -> solana_program::entrypoint::ProgramResult {
            let args = CreateEscrowAccountInstructionArgs::new();
            let instruction = solana_program::instruction::Instruction {
                program_id: crate::MPL_TOKEN_METADATA_ID,
                accounts: vec![
                    solana_program::instruction::AccountMeta::new(*self.escrow.key, false),
                    solana_program::instruction::AccountMeta::new(*self.metadata.key, false),
                    solana_program::instruction::AccountMeta::new_readonly(*self.mint.key, false),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.token_account.key,
                        false,
                    ),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.edition.key,
                        false,
                    ),
                    solana_program::instruction::AccountMeta::new(*self.payer.key, true),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.system_program.key,
                        false,
                    ),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.sysvar_instructions.key,
                        false,
                    ),
                    if let Some(authority) = self.authority {
                        solana_program::instruction::AccountMeta::new_readonly(*authority.key, true)
                    } else {
                        solana_program::instruction::AccountMeta::new_readonly(
                            crate::MPL_TOKEN_METADATA_ID,
                            false,
                        )
                    },
                ],
                data: args.try_to_vec().unwrap(),
            };
            let mut account_infos = Vec::with_capacity(9 + 1);
            account_infos.push(self.program.clone());
            account_infos.push(self.escrow.clone());
            account_infos.push(self.metadata.clone());
            account_infos.push(self.mint.clone());
            account_infos.push(self.token_account.clone());
            account_infos.push(self.edition.clone());
            account_infos.push(self.payer.clone());
            account_infos.push(self.system_program.clone());
            account_infos.push(self.sysvar_instructions.clone());
            if let Some(authority) = self.authority {
                account_infos.push(authority.clone());
            }

            if signers_seeds.is_empty() {
                solana_program::program::invoke(&instruction, &account_infos)
            } else {
                solana_program::program::invoke_signed(&instruction, &account_infos, signers_seeds)
            }
        }
    }

    /// `create_escrow_account` CPI instruction builder.
    pub struct CreateEscrowAccountBuilder<'a> {
        program: &'a solana_program::account_info::AccountInfo<'a>,
        escrow: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        metadata: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        mint: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        token_account: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        edition: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        payer: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        system_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        sysvar_instructions: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    }

    impl<'a> CreateEscrowAccountBuilder<'a> {
        pub fn new(program: &'a solana_program::account_info::AccountInfo<'a>) -> Self {
            Self {
                program,
                escrow: None,
                metadata: None,
                mint: None,
                token_account: None,
                edition: None,
                payer: None,
                system_program: None,
                sysvar_instructions: None,
                authority: None,
            }
        }
        pub fn escrow(
            &'a mut self,
            escrow: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.escrow = Some(escrow);
            self
        }
        pub fn metadata(
            &'a mut self,
            metadata: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.metadata = Some(metadata);
            self
        }
        pub fn mint(
            &'a mut self,
            mint: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.mint = Some(mint);
            self
        }
        pub fn token_account(
            &'a mut self,
            token_account: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.token_account = Some(token_account);
            self
        }
        pub fn edition(
            &'a mut self,
            edition: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.edition = Some(edition);
            self
        }
        pub fn payer(
            &'a mut self,
            payer: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.payer = Some(payer);
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
        pub fn authority(
            &'a mut self,
            authority: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.authority = Some(authority);
            self
        }
        pub fn build(&'a self) -> CreateEscrowAccount {
            CreateEscrowAccount {
                program: self.program,

                escrow: self.escrow.expect("escrow is not set"),

                metadata: self.metadata.expect("metadata is not set"),

                mint: self.mint.expect("mint is not set"),

                token_account: self.token_account.expect("token_account is not set"),

                edition: self.edition.expect("edition is not set"),

                payer: self.payer.expect("payer is not set"),

                system_program: self.system_program.expect("system_program is not set"),

                sysvar_instructions: self
                    .sysvar_instructions
                    .expect("sysvar_instructions is not set"),

                authority: self.authority,
            }
        }
    }
}
