//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use crate::generated::types::CreateMasterEditionArgs;
use borsh::{BorshDeserialize, BorshSerialize};

/// Accounts.
pub struct CreateMasterEditionV3 {
    /// Unallocated edition V2 account with address as pda of ['metadata', program id, mint, 'edition']
    pub edition: solana_program::pubkey::Pubkey,
    /// Metadata mint
    pub mint: solana_program::pubkey::Pubkey,
    /// Update authority
    pub update_authority: solana_program::pubkey::Pubkey,
    /// Mint authority on the metadata's mint - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY
    pub mint_authority: solana_program::pubkey::Pubkey,
    /// payer
    pub payer: solana_program::pubkey::Pubkey,
    /// Metadata account
    pub metadata: solana_program::pubkey::Pubkey,
    /// Token program
    pub token_program: solana_program::pubkey::Pubkey,
    /// System program
    pub system_program: solana_program::pubkey::Pubkey,
    /// Rent info
    pub rent: Option<solana_program::pubkey::Pubkey>,
}

impl CreateMasterEditionV3 {
    pub fn instruction(
        &self,
        args: CreateMasterEditionV3InstructionArgs,
    ) -> solana_program::instruction::Instruction {
        solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts: vec![
                solana_program::instruction::AccountMeta::new(self.edition, false),
                solana_program::instruction::AccountMeta::new(self.mint, false),
                solana_program::instruction::AccountMeta::new_readonly(self.update_authority, true),
                solana_program::instruction::AccountMeta::new_readonly(self.mint_authority, true),
                solana_program::instruction::AccountMeta::new(self.payer, true),
                solana_program::instruction::AccountMeta::new(self.metadata, false),
                solana_program::instruction::AccountMeta::new_readonly(self.token_program, false),
                solana_program::instruction::AccountMeta::new_readonly(self.system_program, false),
                if let Some(rent) = self.rent {
                    solana_program::instruction::AccountMeta::new_readonly(rent, false)
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
pub struct CreateMasterEditionV3InstructionArgs {
    discriminator: u8,
    pub create_master_edition_args: CreateMasterEditionArgs,
}

impl CreateMasterEditionV3InstructionArgs {
    pub fn new(create_master_edition_args: CreateMasterEditionArgs) -> Self {
        Self {
            discriminator: 17,
            create_master_edition_args,
        }
    }
}

/// Instruction builder.
#[derive(Default)]
pub struct CreateMasterEditionV3Builder {
    edition: Option<solana_program::pubkey::Pubkey>,
    mint: Option<solana_program::pubkey::Pubkey>,
    update_authority: Option<solana_program::pubkey::Pubkey>,
    mint_authority: Option<solana_program::pubkey::Pubkey>,
    payer: Option<solana_program::pubkey::Pubkey>,
    metadata: Option<solana_program::pubkey::Pubkey>,
    token_program: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    rent: Option<solana_program::pubkey::Pubkey>,
    create_master_edition_args: Option<CreateMasterEditionArgs>,
}

impl CreateMasterEditionV3Builder {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn edition(&mut self, edition: solana_program::pubkey::Pubkey) -> &mut Self {
        self.edition = Some(edition);
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
    pub fn mint_authority(&mut self, mint_authority: solana_program::pubkey::Pubkey) -> &mut Self {
        self.mint_authority = Some(mint_authority);
        self
    }
    pub fn payer(&mut self, payer: solana_program::pubkey::Pubkey) -> &mut Self {
        self.payer = Some(payer);
        self
    }
    pub fn metadata(&mut self, metadata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.metadata = Some(metadata);
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
    pub fn rent(&mut self, rent: solana_program::pubkey::Pubkey) -> &mut Self {
        self.rent = Some(rent);
        self
    }
    pub fn create_master_edition_args(
        &mut self,
        create_master_edition_args: CreateMasterEditionArgs,
    ) -> &mut Self {
        self.create_master_edition_args = Some(create_master_edition_args);
        self
    }
    pub fn build(&self) -> solana_program::instruction::Instruction {
        let accounts = CreateMasterEditionV3 {
            edition: self.edition.expect("edition is not set"),

            mint: self.mint.expect("mint is not set"),

            update_authority: self.update_authority.expect("update_authority is not set"),

            mint_authority: self.mint_authority.expect("mint_authority is not set"),

            payer: self.payer.expect("payer is not set"),

            metadata: self.metadata.expect("metadata is not set"),

            token_program: self.token_program.expect("token_program is not set"),

            system_program: self.system_program.expect("system_program is not set"),

            rent: self.rent,
        };
        let args = CreateMasterEditionV3InstructionArgs::new(
            self.create_master_edition_args
                .expect("create_master_edition_args is not set"),
        );
        accounts.instruction(args)
    }
}

pub mod cpi {
    use super::*;

    /// `create_master_edition_v3` CPI instruction.
    pub struct CreateMasterEditionV3<'a> {
        pub program: &'a solana_program::account_info::AccountInfo<'a>,
        /// Unallocated edition V2 account with address as pda of ['metadata', program id, mint, 'edition']
        pub edition: &'a solana_program::account_info::AccountInfo<'a>,
        /// Metadata mint
        pub mint: &'a solana_program::account_info::AccountInfo<'a>,
        /// Update authority
        pub update_authority: &'a solana_program::account_info::AccountInfo<'a>,
        /// Mint authority on the metadata's mint - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY
        pub mint_authority: &'a solana_program::account_info::AccountInfo<'a>,
        /// payer
        pub payer: &'a solana_program::account_info::AccountInfo<'a>,
        /// Metadata account
        pub metadata: &'a solana_program::account_info::AccountInfo<'a>,
        /// Token program
        pub token_program: &'a solana_program::account_info::AccountInfo<'a>,
        /// System program
        pub system_program: &'a solana_program::account_info::AccountInfo<'a>,
        /// Rent info
        pub rent: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        pub args: CreateMasterEditionV3InstructionArgs,
    }

    impl<'a> CreateMasterEditionV3<'a> {
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
                    solana_program::instruction::AccountMeta::new(*self.edition.key, false),
                    solana_program::instruction::AccountMeta::new(*self.mint.key, false),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.update_authority.key,
                        true,
                    ),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.mint_authority.key,
                        true,
                    ),
                    solana_program::instruction::AccountMeta::new(*self.payer.key, true),
                    solana_program::instruction::AccountMeta::new(*self.metadata.key, false),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.token_program.key,
                        false,
                    ),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.system_program.key,
                        false,
                    ),
                    if let Some(rent) = self.rent {
                        solana_program::instruction::AccountMeta::new_readonly(*rent.key, false)
                    } else {
                        solana_program::instruction::AccountMeta::new_readonly(
                            crate::MPL_TOKEN_METADATA_ID,
                            false,
                        )
                    },
                ],
                data: self.args.try_to_vec().unwrap(),
            };
            let mut account_infos = Vec::with_capacity(9 + 1);
            account_infos.push(self.program.clone());
            account_infos.push(self.edition.clone());
            account_infos.push(self.mint.clone());
            account_infos.push(self.update_authority.clone());
            account_infos.push(self.mint_authority.clone());
            account_infos.push(self.payer.clone());
            account_infos.push(self.metadata.clone());
            account_infos.push(self.token_program.clone());
            account_infos.push(self.system_program.clone());
            if let Some(rent) = self.rent {
                account_infos.push(rent.clone());
            }

            if signers_seeds.is_empty() {
                solana_program::program::invoke(&instruction, &account_infos)
            } else {
                solana_program::program::invoke_signed(&instruction, &account_infos, signers_seeds)
            }
        }
    }

    /// `create_master_edition_v3` CPI instruction builder.
    pub struct CreateMasterEditionV3Builder<'a> {
        program: &'a solana_program::account_info::AccountInfo<'a>,
        edition: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        mint: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        update_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        mint_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        payer: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        metadata: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        token_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        system_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        rent: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        create_master_edition_args: Option<CreateMasterEditionArgs>,
    }

    impl<'a> CreateMasterEditionV3Builder<'a> {
        pub fn new(program: &'a solana_program::account_info::AccountInfo<'a>) -> Self {
            Self {
                program,
                edition: None,
                mint: None,
                update_authority: None,
                mint_authority: None,
                payer: None,
                metadata: None,
                token_program: None,
                system_program: None,
                rent: None,
                create_master_edition_args: None,
            }
        }
        pub fn edition(
            &'a mut self,
            edition: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.edition = Some(edition);
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
        pub fn mint_authority(
            &'a mut self,
            mint_authority: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.mint_authority = Some(mint_authority);
            self
        }
        pub fn payer(
            &'a mut self,
            payer: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.payer = Some(payer);
            self
        }
        pub fn metadata(
            &'a mut self,
            metadata: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.metadata = Some(metadata);
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
        pub fn rent(
            &'a mut self,
            rent: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.rent = Some(rent);
            self
        }
        pub fn create_master_edition_args(
            &'a mut self,
            create_master_edition_args: CreateMasterEditionArgs,
        ) -> &mut Self {
            self.create_master_edition_args = Some(create_master_edition_args);
            self
        }
        pub fn build(&'a self) -> CreateMasterEditionV3 {
            CreateMasterEditionV3 {
                program: self.program,

                edition: self.edition.expect("edition is not set"),

                mint: self.mint.expect("mint is not set"),

                update_authority: self.update_authority.expect("update_authority is not set"),

                mint_authority: self.mint_authority.expect("mint_authority is not set"),

                payer: self.payer.expect("payer is not set"),

                metadata: self.metadata.expect("metadata is not set"),

                token_program: self.token_program.expect("token_program is not set"),

                system_program: self.system_program.expect("system_program is not set"),

                rent: self.rent,
                args: CreateMasterEditionV3InstructionArgs::new(
                    self.create_master_edition_args
                        .expect("create_master_edition_args is not set"),
                ),
            }
        }
    }
}
