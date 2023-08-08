//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use borsh::{BorshDeserialize, BorshSerialize};

/// Accounts.
pub struct CreateMetadataAccountV2 {
    /// Metadata key (pda of ['metadata', program id, mint id])
    pub metadata: solana_program::pubkey::Pubkey,
    /// Mint of token asset
    pub mint: solana_program::pubkey::Pubkey,
    /// Mint authority
    pub mint_authority: solana_program::pubkey::Pubkey,
    /// payer
    pub payer: solana_program::pubkey::Pubkey,
    /// update authority info
    pub update_authority: solana_program::pubkey::Pubkey,
    /// System program
    pub system_program: solana_program::pubkey::Pubkey,
    /// Rent info
    pub rent: Option<solana_program::pubkey::Pubkey>,
}

impl CreateMetadataAccountV2 {
    pub fn instruction(
        &self,
        args: CreateMetadataAccountV2InstructionArgs,
    ) -> solana_program::instruction::Instruction {
        solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts: vec![
                                          solana_program::instruction::AccountMeta::new(
              self.metadata,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.mint,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.mint_authority,
              true
            ),
                                                                solana_program::instruction::AccountMeta::new(
              self.payer,
              true
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.update_authority,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.system_program,
              false
            ),
                                                                if let Some(rent) = self.rent {
              solana_program::instruction::AccountMeta::new_readonly(
                rent,
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
pub struct CreateMetadataAccountV2InstructionArgs {
    discriminator: u8,
    pub data: DataV2,
    pub is_mutable: bool,
}

impl CreateMetadataAccountV2InstructionArgs {
    pub fn new(data: DataV2, is_mutable: bool) -> Self {
        Self {
            discriminator: 16,
            data,
            is_mutable,
        }
    }
}

/// Instruction builder.
#[derive(Default)]
pub struct CreateMetadataAccountV2Builder {
    metadata: Option<solana_program::pubkey::Pubkey>,
    mint: Option<solana_program::pubkey::Pubkey>,
    mint_authority: Option<solana_program::pubkey::Pubkey>,
    payer: Option<solana_program::pubkey::Pubkey>,
    update_authority: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    rent: Option<solana_program::pubkey::Pubkey>,
    data: Option<DataV2>,
    is_mutable: Option<bool>,
}

impl CreateMetadataAccountV2Builder {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn metadata(&mut self, metadata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.metadata = Some(metadata);
        self
    }
    pub fn mint(&mut self, mint: solana_program::pubkey::Pubkey) -> &mut Self {
        self.mint = Some(mint);
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
    pub fn update_authority(
        &mut self,
        update_authority: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.update_authority = Some(update_authority);
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
    pub fn data(&mut self, data: DataV2) -> &mut Self {
        self.data = Some(data);
        self
    }
    pub fn is_mutable(&mut self, is_mutable: bool) -> &mut Self {
        self.is_mutable = Some(is_mutable);
        self
    }
    pub fn build(&self) -> solana_program::instruction::Instruction {
        let accounts = CreateMetadataAccountV2 {
            metadata: self.metadata.expect("metadata is not set"),

            mint: self.mint.expect("mint is not set"),

            mint_authority: self.mint_authority.expect("mint_authority is not set"),

            payer: self.payer.expect("payer is not set"),

            update_authority: self.update_authority.expect("update_authority is not set"),

            system_program: self.system_program.expect("system_program is not set"),

            rent: self.rent,
        };
        let args = CreateMetadataAccountV2InstructionArgs::new(
            self.data.expect("data is not set"),
            self.is_mutable.expect("is_mutable is not set"),
        );
        accounts.instruction(args)
    }
}

pub mod cpi {
    use super::*;

    /// `create_metadata_account_v2` CPI instruction.
    pub struct CreateMetadataAccountV2<'a> {
        pub program: &'a solana_program::account_info::AccountInfo<'a>,
        /// Metadata key (pda of ['metadata', program id, mint id])
        pub metadata: &'a solana_program::account_info::AccountInfo<'a>,
        /// Mint of token asset
        pub mint: &'a solana_program::account_info::AccountInfo<'a>,
        /// Mint authority
        pub mint_authority: &'a solana_program::account_info::AccountInfo<'a>,
        /// payer
        pub payer: &'a solana_program::account_info::AccountInfo<'a>,
        /// update authority info
        pub update_authority: &'a solana_program::account_info::AccountInfo<'a>,
        /// System program
        pub system_program: &'a solana_program::account_info::AccountInfo<'a>,
        /// Rent info
        pub rent: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        pub args: CreateMetadataAccountV2InstructionArgs,
    }

    impl<'a> CreateMetadataAccountV2<'a> {
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
                  *self.mint.key,
                  false
                ),
                                                                    solana_program::instruction::AccountMeta::new_readonly(
                  *self.mint_authority.key,
                  true
                ),
                                                                    solana_program::instruction::AccountMeta::new(
                  *self.payer.key,
                  true
                ),
                                                                    solana_program::instruction::AccountMeta::new_readonly(
                  *self.update_authority.key,
                  false
                ),
                                                                    solana_program::instruction::AccountMeta::new_readonly(
                  *self.system_program.key,
                  false
                ),
                                                                    if let Some(rent) = self.rent {
                  solana_program::instruction::AccountMeta::new_readonly(
                    *rent.key,
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
            let mut account_infos = Vec::with_capacity(7 + 1);
            account_infos.push(self.program.clone());
            account_infos.push(self.metadata.clone());
            account_infos.push(self.mint.clone());
            account_infos.push(self.mint_authority.clone());
            account_infos.push(self.payer.clone());
            account_infos.push(self.update_authority.clone());
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

    /// `create_metadata_account_v2` CPI instruction builder.
    pub struct CreateMetadataAccountV2Builder<'a> {
        program: &'a solana_program::account_info::AccountInfo<'a>,
        metadata: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        mint: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        mint_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        payer: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        update_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        system_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        rent: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        data: Option<DataV2>,
        is_mutable: Option<bool>,
    }

    impl<'a> CreateMetadataAccountV2Builder<'a> {
        pub fn new(program: &'a solana_program::account_info::AccountInfo<'a>) -> Self {
            Self {
                program,
                metadata: None,
                mint: None,
                mint_authority: None,
                payer: None,
                update_authority: None,
                system_program: None,
                rent: None,
                data: None,
                is_mutable: None,
            }
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
        pub fn update_authority(
            &'a mut self,
            update_authority: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.update_authority = Some(update_authority);
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
        pub fn data(&'a mut self, data: DataV2) -> &mut Self {
            self.data = Some(data);
            self
        }
        pub fn is_mutable(&'a mut self, is_mutable: bool) -> &mut Self {
            self.is_mutable = Some(is_mutable);
            self
        }
        pub fn build(&'a self) -> CreateMetadataAccountV2 {
            CreateMetadataAccountV2 {
                program: self.program,

                metadata: self.metadata.expect("metadata is not set"),

                mint: self.mint.expect("mint is not set"),

                mint_authority: self.mint_authority.expect("mint_authority is not set"),

                payer: self.payer.expect("payer is not set"),

                update_authority: self.update_authority.expect("update_authority is not set"),

                system_program: self.system_program.expect("system_program is not set"),

                rent: self.rent,
                args: CreateMetadataAccountV2InstructionArgs::new(
                    self.data.expect("data is not set"),
                    self.is_mutable.expect("is_mutable is not set"),
                ),
            }
        }
    }
}
