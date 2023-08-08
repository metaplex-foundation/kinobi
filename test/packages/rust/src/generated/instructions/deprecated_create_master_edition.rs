//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use borsh::{BorshDeserialize, BorshSerialize};

/// Accounts.
pub struct DeprecatedCreateMasterEdition {
    /// Unallocated edition V1 account with address as pda of ['metadata', program id, mint, 'edition']
    pub edition: solana_program::pubkey::Pubkey,
    /// Metadata mint
    pub mint: solana_program::pubkey::Pubkey,
    /// Printing mint - A mint you control that can mint tokens that can be exchanged for limited editions of your master edition via the MintNewEditionFromMasterEditionViaToken endpoint
    pub printing_mint: solana_program::pubkey::Pubkey,
    /// One time authorization printing mint - A mint you control that prints tokens that gives the bearer permission to mint any number of tokens from the printing mint one time via an endpoint with the token-metadata program for your metadata. Also burns the token.
    pub one_time_printing_authorization_mint: solana_program::pubkey::Pubkey,
    /// Current Update authority key
    pub update_authority: solana_program::pubkey::Pubkey,
    /// Printing mint authority - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY.
    pub printing_mint_authority: solana_program::pubkey::Pubkey,
    /// Mint authority on the metadata's mint - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY
    pub mint_authority: solana_program::pubkey::Pubkey,
    /// Metadata account
    pub metadata: solana_program::pubkey::Pubkey,
    /// payer
    pub payer: solana_program::pubkey::Pubkey,
    /// Token program
    pub token_program: solana_program::pubkey::Pubkey,
    /// System program
    pub system_program: solana_program::pubkey::Pubkey,
    /// Rent info
    pub rent: solana_program::pubkey::Pubkey,
    /// One time authorization printing mint authority - must be provided if using max supply. THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY.
    pub one_time_printing_authorization_mint_authority: solana_program::pubkey::Pubkey,
}

impl DeprecatedCreateMasterEdition {
    pub fn instruction(
        &self,
        args: DeprecatedCreateMasterEditionInstructionArgs,
    ) -> solana_program::instruction::Instruction {
        solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts: vec![
                solana_program::instruction::AccountMeta::new(self.edition, false),
                solana_program::instruction::AccountMeta::new(self.mint, false),
                solana_program::instruction::AccountMeta::new(self.printing_mint, false),
                solana_program::instruction::AccountMeta::new(
                    self.one_time_printing_authorization_mint,
                    false,
                ),
                solana_program::instruction::AccountMeta::new_readonly(self.update_authority, true),
                solana_program::instruction::AccountMeta::new_readonly(
                    self.printing_mint_authority,
                    true,
                ),
                solana_program::instruction::AccountMeta::new_readonly(self.mint_authority, true),
                solana_program::instruction::AccountMeta::new_readonly(self.metadata, false),
                solana_program::instruction::AccountMeta::new_readonly(self.payer, true),
                solana_program::instruction::AccountMeta::new_readonly(self.token_program, false),
                solana_program::instruction::AccountMeta::new_readonly(self.system_program, false),
                solana_program::instruction::AccountMeta::new_readonly(self.rent, false),
                solana_program::instruction::AccountMeta::new_readonly(
                    self.one_time_printing_authorization_mint_authority,
                    true,
                ),
            ],
            data: args.try_to_vec().unwrap(),
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct DeprecatedCreateMasterEditionInstructionArgs {
    discriminator: u8,
    pub create_master_edition_args: CreateMasterEditionArgs,
}

impl DeprecatedCreateMasterEditionInstructionArgs {
    pub fn new(create_master_edition_args: CreateMasterEditionArgs) -> Self {
        Self {
            discriminator: 2,
            create_master_edition_args,
        }
    }
}

/// Instruction builder.
#[derive(Default)]
pub struct DeprecatedCreateMasterEditionBuilder {
    edition: Option<solana_program::pubkey::Pubkey>,
    mint: Option<solana_program::pubkey::Pubkey>,
    printing_mint: Option<solana_program::pubkey::Pubkey>,
    one_time_printing_authorization_mint: Option<solana_program::pubkey::Pubkey>,
    update_authority: Option<solana_program::pubkey::Pubkey>,
    printing_mint_authority: Option<solana_program::pubkey::Pubkey>,
    mint_authority: Option<solana_program::pubkey::Pubkey>,
    metadata: Option<solana_program::pubkey::Pubkey>,
    payer: Option<solana_program::pubkey::Pubkey>,
    token_program: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    rent: Option<solana_program::pubkey::Pubkey>,
    one_time_printing_authorization_mint_authority: Option<solana_program::pubkey::Pubkey>,
    create_master_edition_args: Option<CreateMasterEditionArgs>,
}

impl DeprecatedCreateMasterEditionBuilder {
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
    pub fn printing_mint(&mut self, printing_mint: solana_program::pubkey::Pubkey) -> &mut Self {
        self.printing_mint = Some(printing_mint);
        self
    }
    pub fn one_time_printing_authorization_mint(
        &mut self,
        one_time_printing_authorization_mint: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.one_time_printing_authorization_mint = Some(one_time_printing_authorization_mint);
        self
    }
    pub fn update_authority(
        &mut self,
        update_authority: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.update_authority = Some(update_authority);
        self
    }
    pub fn printing_mint_authority(
        &mut self,
        printing_mint_authority: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.printing_mint_authority = Some(printing_mint_authority);
        self
    }
    pub fn mint_authority(&mut self, mint_authority: solana_program::pubkey::Pubkey) -> &mut Self {
        self.mint_authority = Some(mint_authority);
        self
    }
    pub fn metadata(&mut self, metadata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.metadata = Some(metadata);
        self
    }
    pub fn payer(&mut self, payer: solana_program::pubkey::Pubkey) -> &mut Self {
        self.payer = Some(payer);
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
    pub fn one_time_printing_authorization_mint_authority(
        &mut self,
        one_time_printing_authorization_mint_authority: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.one_time_printing_authorization_mint_authority =
            Some(one_time_printing_authorization_mint_authority);
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
        let accounts = DeprecatedCreateMasterEdition {
            edition: self.edition.expect("edition is not set"),

            mint: self.mint.expect("mint is not set"),

            printing_mint: self.printing_mint.expect("printing_mint is not set"),

            one_time_printing_authorization_mint: self
                .one_time_printing_authorization_mint
                .expect("one_time_printing_authorization_mint is not set"),

            update_authority: self.update_authority.expect("update_authority is not set"),

            printing_mint_authority: self
                .printing_mint_authority
                .expect("printing_mint_authority is not set"),

            mint_authority: self.mint_authority.expect("mint_authority is not set"),

            metadata: self.metadata.expect("metadata is not set"),

            payer: self.payer.expect("payer is not set"),

            token_program: self.token_program.expect("token_program is not set"),

            system_program: self.system_program.expect("system_program is not set"),

            rent: self.rent.expect("rent is not set"),

            one_time_printing_authorization_mint_authority: self
                .one_time_printing_authorization_mint_authority
                .expect("one_time_printing_authorization_mint_authority is not set"),
        };
        let args = DeprecatedCreateMasterEditionInstructionArgs::new(
            self.create_master_edition_args
                .expect("create_master_edition_args is not set"),
        );
        accounts.instruction(args)
    }
}

pub mod cpi {
    use super::*;

    /// `deprecated_create_master_edition` CPI instruction.
    pub struct DeprecatedCreateMasterEdition<'a> {
        pub program: &'a solana_program::account_info::AccountInfo<'a>,
        /// Unallocated edition V1 account with address as pda of ['metadata', program id, mint, 'edition']
        pub edition: &'a solana_program::account_info::AccountInfo<'a>,
        /// Metadata mint
        pub mint: &'a solana_program::account_info::AccountInfo<'a>,
        /// Printing mint - A mint you control that can mint tokens that can be exchanged for limited editions of your master edition via the MintNewEditionFromMasterEditionViaToken endpoint
        pub printing_mint: &'a solana_program::account_info::AccountInfo<'a>,
        /// One time authorization printing mint - A mint you control that prints tokens that gives the bearer permission to mint any number of tokens from the printing mint one time via an endpoint with the token-metadata program for your metadata. Also burns the token.
        pub one_time_printing_authorization_mint: &'a solana_program::account_info::AccountInfo<'a>,
        /// Current Update authority key
        pub update_authority: &'a solana_program::account_info::AccountInfo<'a>,
        /// Printing mint authority - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY.
        pub printing_mint_authority: &'a solana_program::account_info::AccountInfo<'a>,
        /// Mint authority on the metadata's mint - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY
        pub mint_authority: &'a solana_program::account_info::AccountInfo<'a>,
        /// Metadata account
        pub metadata: &'a solana_program::account_info::AccountInfo<'a>,
        /// payer
        pub payer: &'a solana_program::account_info::AccountInfo<'a>,
        /// Token program
        pub token_program: &'a solana_program::account_info::AccountInfo<'a>,
        /// System program
        pub system_program: &'a solana_program::account_info::AccountInfo<'a>,
        /// Rent info
        pub rent: &'a solana_program::account_info::AccountInfo<'a>,
        /// One time authorization printing mint authority - must be provided if using max supply. THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY.
        pub one_time_printing_authorization_mint_authority:
            &'a solana_program::account_info::AccountInfo<'a>,
        pub args: DeprecatedCreateMasterEditionInstructionArgs,
    }

    impl<'a> DeprecatedCreateMasterEdition<'a> {
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
                    solana_program::instruction::AccountMeta::new(*self.printing_mint.key, false),
                    solana_program::instruction::AccountMeta::new(
                        *self.one_time_printing_authorization_mint.key,
                        false,
                    ),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.update_authority.key,
                        true,
                    ),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.printing_mint_authority.key,
                        true,
                    ),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.mint_authority.key,
                        true,
                    ),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.metadata.key,
                        false,
                    ),
                    solana_program::instruction::AccountMeta::new_readonly(*self.payer.key, true),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.token_program.key,
                        false,
                    ),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.system_program.key,
                        false,
                    ),
                    solana_program::instruction::AccountMeta::new_readonly(*self.rent.key, false),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.one_time_printing_authorization_mint_authority.key,
                        true,
                    ),
                ],
                data: self.args.try_to_vec().unwrap(),
            };
            let mut account_infos = Vec::with_capacity(13 + 1);
            account_infos.push(self.program.clone());
            account_infos.push(self.edition.clone());
            account_infos.push(self.mint.clone());
            account_infos.push(self.printing_mint.clone());
            account_infos.push(self.one_time_printing_authorization_mint.clone());
            account_infos.push(self.update_authority.clone());
            account_infos.push(self.printing_mint_authority.clone());
            account_infos.push(self.mint_authority.clone());
            account_infos.push(self.metadata.clone());
            account_infos.push(self.payer.clone());
            account_infos.push(self.token_program.clone());
            account_infos.push(self.system_program.clone());
            account_infos.push(self.rent.clone());
            account_infos.push(self.one_time_printing_authorization_mint_authority.clone());

            if signers_seeds.is_empty() {
                solana_program::program::invoke(&instruction, &account_infos)
            } else {
                solana_program::program::invoke_signed(&instruction, &account_infos, signers_seeds)
            }
        }
    }

    /// `deprecated_create_master_edition` CPI instruction builder.
    pub struct DeprecatedCreateMasterEditionBuilder<'a> {
        program: &'a solana_program::account_info::AccountInfo<'a>,
        edition: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        mint: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        printing_mint: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        one_time_printing_authorization_mint:
            Option<&'a solana_program::account_info::AccountInfo<'a>>,
        update_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        printing_mint_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        mint_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        metadata: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        payer: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        token_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        system_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        rent: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        one_time_printing_authorization_mint_authority:
            Option<&'a solana_program::account_info::AccountInfo<'a>>,
        create_master_edition_args: Option<CreateMasterEditionArgs>,
    }

    impl<'a> DeprecatedCreateMasterEditionBuilder<'a> {
        pub fn new(program: &'a solana_program::account_info::AccountInfo<'a>) -> Self {
            Self {
                program,
                edition: None,
                mint: None,
                printing_mint: None,
                one_time_printing_authorization_mint: None,
                update_authority: None,
                printing_mint_authority: None,
                mint_authority: None,
                metadata: None,
                payer: None,
                token_program: None,
                system_program: None,
                rent: None,
                one_time_printing_authorization_mint_authority: None,
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
        pub fn printing_mint(
            &'a mut self,
            printing_mint: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.printing_mint = Some(printing_mint);
            self
        }
        pub fn one_time_printing_authorization_mint(
            &'a mut self,
            one_time_printing_authorization_mint: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.one_time_printing_authorization_mint = Some(one_time_printing_authorization_mint);
            self
        }
        pub fn update_authority(
            &'a mut self,
            update_authority: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.update_authority = Some(update_authority);
            self
        }
        pub fn printing_mint_authority(
            &'a mut self,
            printing_mint_authority: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.printing_mint_authority = Some(printing_mint_authority);
            self
        }
        pub fn mint_authority(
            &'a mut self,
            mint_authority: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.mint_authority = Some(mint_authority);
            self
        }
        pub fn metadata(
            &'a mut self,
            metadata: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.metadata = Some(metadata);
            self
        }
        pub fn payer(
            &'a mut self,
            payer: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.payer = Some(payer);
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
        pub fn one_time_printing_authorization_mint_authority(
            &'a mut self,
            one_time_printing_authorization_mint_authority: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.one_time_printing_authorization_mint_authority =
                Some(one_time_printing_authorization_mint_authority);
            self
        }
        pub fn create_master_edition_args(
            &'a mut self,
            create_master_edition_args: CreateMasterEditionArgs,
        ) -> &mut Self {
            self.create_master_edition_args = Some(create_master_edition_args);
            self
        }
        pub fn build(&'a self) -> DeprecatedCreateMasterEdition {
            DeprecatedCreateMasterEdition {
                program: self.program,

                edition: self.edition.expect("edition is not set"),

                mint: self.mint.expect("mint is not set"),

                printing_mint: self.printing_mint.expect("printing_mint is not set"),

                one_time_printing_authorization_mint: self
                    .one_time_printing_authorization_mint
                    .expect("one_time_printing_authorization_mint is not set"),

                update_authority: self.update_authority.expect("update_authority is not set"),

                printing_mint_authority: self
                    .printing_mint_authority
                    .expect("printing_mint_authority is not set"),

                mint_authority: self.mint_authority.expect("mint_authority is not set"),

                metadata: self.metadata.expect("metadata is not set"),

                payer: self.payer.expect("payer is not set"),

                token_program: self.token_program.expect("token_program is not set"),

                system_program: self.system_program.expect("system_program is not set"),

                rent: self.rent.expect("rent is not set"),

                one_time_printing_authorization_mint_authority: self
                    .one_time_printing_authorization_mint_authority
                    .expect("one_time_printing_authorization_mint_authority is not set"),
                args: DeprecatedCreateMasterEditionInstructionArgs::new(
                    self.create_master_edition_args
                        .expect("create_master_edition_args is not set"),
                ),
            }
        }
    }
}
