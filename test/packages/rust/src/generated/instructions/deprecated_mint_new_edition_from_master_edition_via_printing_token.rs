//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use borsh::BorshDeserialize;
use borsh::BorshSerialize;

/// Accounts.
pub struct DeprecatedMintNewEditionFromMasterEditionViaPrintingToken {
    /// New Metadata key (pda of ['metadata', program id, mint id])
    pub metadata: solana_program::pubkey::Pubkey,
    /// New Edition V1 (pda of ['metadata', program id, mint id, 'edition'])
    pub edition: solana_program::pubkey::Pubkey,
    /// Master Record Edition V1 (pda of ['metadata', program id, master metadata mint id, 'edition'])
    pub master_edition: solana_program::pubkey::Pubkey,
    /// Mint of new token - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY
    pub mint: solana_program::pubkey::Pubkey,
    /// Mint authority of new mint
    pub mint_authority: solana_program::pubkey::Pubkey,
    /// Printing Mint of master record edition
    pub printing_mint: solana_program::pubkey::Pubkey,
    /// Token account containing Printing mint token to be transferred
    pub master_token_account: solana_program::pubkey::Pubkey,
    /// Edition pda to mark creation - will be checked for pre-existence. (pda of ['metadata', program id, master mint id, edition_number])
    pub edition_marker: solana_program::pubkey::Pubkey,
    /// Burn authority for this token
    pub burn_authority: solana_program::pubkey::Pubkey,
    /// payer
    pub payer: solana_program::pubkey::Pubkey,
    /// update authority info for new metadata account
    pub master_update_authority: solana_program::pubkey::Pubkey,
    /// Master record metadata account
    pub master_metadata: solana_program::pubkey::Pubkey,
    /// Token program
    pub token_program: solana_program::pubkey::Pubkey,
    /// System program
    pub system_program: solana_program::pubkey::Pubkey,
    /// Rent info
    pub rent: solana_program::pubkey::Pubkey,
    /// Reservation List - If present, and you are on this list, you can get an edition number given by your position on the list.
    pub reservation_list: Option<solana_program::pubkey::Pubkey>,
}

impl DeprecatedMintNewEditionFromMasterEditionViaPrintingToken {
    pub fn instruction(&self) -> solana_program::instruction::Instruction {
        let args = DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionArgs::new();

        let mut accounts = Vec::with_capacity(16);
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.metadata,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.edition,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.master_edition,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.mint, false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.mint_authority,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.printing_mint,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.master_token_account,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.edition_marker,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.burn_authority,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.payer, true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.master_update_authority,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.master_metadata,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.token_program,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.system_program,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.rent, false,
        ));
        if let Some(reservation_list) = self.reservation_list {
            accounts.push(solana_program::instruction::AccountMeta::new(
                reservation_list,
                false,
            ));
        } else {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                crate::MPL_TOKEN_METADATA_ID,
                false,
            ));
        }

        solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts,
            data: args.try_to_vec().unwrap(),
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
struct DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionArgs {
    discriminator: u8,
}

impl DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionArgs {
    pub fn new() -> Self {
        Self { discriminator: 3 }
    }
}

/// Instruction builder.
#[derive(Default)]
pub struct DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenBuilder {
    metadata: Option<solana_program::pubkey::Pubkey>,
    edition: Option<solana_program::pubkey::Pubkey>,
    master_edition: Option<solana_program::pubkey::Pubkey>,
    mint: Option<solana_program::pubkey::Pubkey>,
    mint_authority: Option<solana_program::pubkey::Pubkey>,
    printing_mint: Option<solana_program::pubkey::Pubkey>,
    master_token_account: Option<solana_program::pubkey::Pubkey>,
    edition_marker: Option<solana_program::pubkey::Pubkey>,
    burn_authority: Option<solana_program::pubkey::Pubkey>,
    payer: Option<solana_program::pubkey::Pubkey>,
    master_update_authority: Option<solana_program::pubkey::Pubkey>,
    master_metadata: Option<solana_program::pubkey::Pubkey>,
    token_program: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    rent: Option<solana_program::pubkey::Pubkey>,
    reservation_list: Option<solana_program::pubkey::Pubkey>,
}

impl DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn metadata(&mut self, metadata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.metadata = Some(metadata);
        self
    }
    pub fn edition(&mut self, edition: solana_program::pubkey::Pubkey) -> &mut Self {
        self.edition = Some(edition);
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
    pub fn mint_authority(&mut self, mint_authority: solana_program::pubkey::Pubkey) -> &mut Self {
        self.mint_authority = Some(mint_authority);
        self
    }
    pub fn printing_mint(&mut self, printing_mint: solana_program::pubkey::Pubkey) -> &mut Self {
        self.printing_mint = Some(printing_mint);
        self
    }
    pub fn master_token_account(
        &mut self,
        master_token_account: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.master_token_account = Some(master_token_account);
        self
    }
    pub fn edition_marker(&mut self, edition_marker: solana_program::pubkey::Pubkey) -> &mut Self {
        self.edition_marker = Some(edition_marker);
        self
    }
    pub fn burn_authority(&mut self, burn_authority: solana_program::pubkey::Pubkey) -> &mut Self {
        self.burn_authority = Some(burn_authority);
        self
    }
    pub fn payer(&mut self, payer: solana_program::pubkey::Pubkey) -> &mut Self {
        self.payer = Some(payer);
        self
    }
    pub fn master_update_authority(
        &mut self,
        master_update_authority: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.master_update_authority = Some(master_update_authority);
        self
    }
    pub fn master_metadata(
        &mut self,
        master_metadata: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.master_metadata = Some(master_metadata);
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
    pub fn reservation_list(
        &mut self,
        reservation_list: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.reservation_list = Some(reservation_list);
        self
    }
    #[allow(clippy::clone_on_copy)]
    pub fn build(&self) -> solana_program::instruction::Instruction {
        let accounts = DeprecatedMintNewEditionFromMasterEditionViaPrintingToken {
            metadata: self.metadata.expect("metadata is not set"),
            edition: self.edition.expect("edition is not set"),
            master_edition: self.master_edition.expect("master_edition is not set"),
            mint: self.mint.expect("mint is not set"),
            mint_authority: self.mint_authority.expect("mint_authority is not set"),
            printing_mint: self.printing_mint.expect("printing_mint is not set"),
            master_token_account: self
                .master_token_account
                .expect("master_token_account is not set"),
            edition_marker: self.edition_marker.expect("edition_marker is not set"),
            burn_authority: self.burn_authority.expect("burn_authority is not set"),
            payer: self.payer.expect("payer is not set"),
            master_update_authority: self
                .master_update_authority
                .expect("master_update_authority is not set"),
            master_metadata: self.master_metadata.expect("master_metadata is not set"),
            token_program: self.token_program.unwrap_or(solana_program::pubkey!(
                "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            )),
            system_program: self
                .system_program
                .unwrap_or(solana_program::pubkey!("11111111111111111111111111111111")),
            rent: self.rent.unwrap_or(solana_program::pubkey!(
                "SysvarRent111111111111111111111111111111111"
            )),
            reservation_list: self.reservation_list,
        };

        accounts.instruction()
    }
}

/// `deprecated_mint_new_edition_from_master_edition_via_printing_token` CPI instruction.
pub struct DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenCpi<'a> {
    /// The program to invoke.
    pub program: &'a solana_program::account_info::AccountInfo<'a>,
    /// New Metadata key (pda of ['metadata', program id, mint id])
    pub metadata: &'a solana_program::account_info::AccountInfo<'a>,
    /// New Edition V1 (pda of ['metadata', program id, mint id, 'edition'])
    pub edition: &'a solana_program::account_info::AccountInfo<'a>,
    /// Master Record Edition V1 (pda of ['metadata', program id, master metadata mint id, 'edition'])
    pub master_edition: &'a solana_program::account_info::AccountInfo<'a>,
    /// Mint of new token - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY
    pub mint: &'a solana_program::account_info::AccountInfo<'a>,
    /// Mint authority of new mint
    pub mint_authority: &'a solana_program::account_info::AccountInfo<'a>,
    /// Printing Mint of master record edition
    pub printing_mint: &'a solana_program::account_info::AccountInfo<'a>,
    /// Token account containing Printing mint token to be transferred
    pub master_token_account: &'a solana_program::account_info::AccountInfo<'a>,
    /// Edition pda to mark creation - will be checked for pre-existence. (pda of ['metadata', program id, master mint id, edition_number])
    pub edition_marker: &'a solana_program::account_info::AccountInfo<'a>,
    /// Burn authority for this token
    pub burn_authority: &'a solana_program::account_info::AccountInfo<'a>,
    /// payer
    pub payer: &'a solana_program::account_info::AccountInfo<'a>,
    /// update authority info for new metadata account
    pub master_update_authority: &'a solana_program::account_info::AccountInfo<'a>,
    /// Master record metadata account
    pub master_metadata: &'a solana_program::account_info::AccountInfo<'a>,
    /// Token program
    pub token_program: &'a solana_program::account_info::AccountInfo<'a>,
    /// System program
    pub system_program: &'a solana_program::account_info::AccountInfo<'a>,
    /// Rent info
    pub rent: &'a solana_program::account_info::AccountInfo<'a>,
    /// Reservation List - If present, and you are on this list, you can get an edition number given by your position on the list.
    pub reservation_list: Option<&'a solana_program::account_info::AccountInfo<'a>>,
}

impl<'a> DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenCpi<'a> {
    pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed(&[])
    }
    #[allow(clippy::clone_on_copy)]
    #[allow(clippy::vec_init_then_push)]
    pub fn invoke_signed(
        &self,
        signers_seeds: &[&[&[u8]]],
    ) -> solana_program::entrypoint::ProgramResult {
        let args = DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionArgs::new();

        let mut accounts = Vec::with_capacity(16);
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.metadata.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.edition.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.master_edition.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.mint.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.mint_authority.key,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.printing_mint.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.master_token_account.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.edition_marker.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.burn_authority.key,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.payer.key,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.master_update_authority.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.master_metadata.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.token_program.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.system_program.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.rent.key,
            false,
        ));
        if let Some(reservation_list) = self.reservation_list {
            accounts.push(solana_program::instruction::AccountMeta::new(
                *reservation_list.key,
                false,
            ));
        } else {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                crate::MPL_TOKEN_METADATA_ID,
                false,
            ));
        }

        let instruction = solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts,
            data: args.try_to_vec().unwrap(),
        };
        let mut account_infos = Vec::with_capacity(16 + 1);
        account_infos.push(self.program.clone());
        account_infos.push(self.metadata.clone());
        account_infos.push(self.edition.clone());
        account_infos.push(self.master_edition.clone());
        account_infos.push(self.mint.clone());
        account_infos.push(self.mint_authority.clone());
        account_infos.push(self.printing_mint.clone());
        account_infos.push(self.master_token_account.clone());
        account_infos.push(self.edition_marker.clone());
        account_infos.push(self.burn_authority.clone());
        account_infos.push(self.payer.clone());
        account_infos.push(self.master_update_authority.clone());
        account_infos.push(self.master_metadata.clone());
        account_infos.push(self.token_program.clone());
        account_infos.push(self.system_program.clone());
        account_infos.push(self.rent.clone());
        if let Some(reservation_list) = self.reservation_list {
            account_infos.push(reservation_list.clone());
        }

        if signers_seeds.is_empty() {
            solana_program::program::invoke(&instruction, &account_infos)
        } else {
            solana_program::program::invoke_signed(&instruction, &account_infos, signers_seeds)
        }
    }
}

/// `deprecated_mint_new_edition_from_master_edition_via_printing_token` CPI instruction builder.
pub struct DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenCpiBuilder<'a> {
    instruction:
        Box<DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenCpiBuilderInstruction<'a>>,
}

impl<'a> DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenCpiBuilder<'a> {
    pub fn new(program: &'a solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(
            DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenCpiBuilderInstruction {
                program,
                metadata: None,
                edition: None,
                master_edition: None,
                mint: None,
                mint_authority: None,
                printing_mint: None,
                master_token_account: None,
                edition_marker: None,
                burn_authority: None,
                payer: None,
                master_update_authority: None,
                master_metadata: None,
                token_program: None,
                system_program: None,
                rent: None,
                reservation_list: None,
            },
        );
        Self { instruction }
    }
    pub fn metadata(
        &mut self,
        metadata: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.metadata = Some(metadata);
        self
    }
    pub fn edition(
        &mut self,
        edition: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.edition = Some(edition);
        self
    }
    pub fn master_edition(
        &mut self,
        master_edition: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.master_edition = Some(master_edition);
        self
    }
    pub fn mint(&mut self, mint: &'a solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.mint = Some(mint);
        self
    }
    pub fn mint_authority(
        &mut self,
        mint_authority: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.mint_authority = Some(mint_authority);
        self
    }
    pub fn printing_mint(
        &mut self,
        printing_mint: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.printing_mint = Some(printing_mint);
        self
    }
    pub fn master_token_account(
        &mut self,
        master_token_account: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.master_token_account = Some(master_token_account);
        self
    }
    pub fn edition_marker(
        &mut self,
        edition_marker: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.edition_marker = Some(edition_marker);
        self
    }
    pub fn burn_authority(
        &mut self,
        burn_authority: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.burn_authority = Some(burn_authority);
        self
    }
    pub fn payer(&mut self, payer: &'a solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.payer = Some(payer);
        self
    }
    pub fn master_update_authority(
        &mut self,
        master_update_authority: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.master_update_authority = Some(master_update_authority);
        self
    }
    pub fn master_metadata(
        &mut self,
        master_metadata: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.master_metadata = Some(master_metadata);
        self
    }
    pub fn token_program(
        &mut self,
        token_program: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.token_program = Some(token_program);
        self
    }
    pub fn system_program(
        &mut self,
        system_program: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.system_program = Some(system_program);
        self
    }
    pub fn rent(&mut self, rent: &'a solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.rent = Some(rent);
        self
    }
    pub fn reservation_list(
        &mut self,
        reservation_list: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.reservation_list = Some(reservation_list);
        self
    }
    #[allow(clippy::clone_on_copy)]
    pub fn build(&self) -> DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenCpi<'a> {
        DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenCpi {
            program: self.instruction.program,

            metadata: self.instruction.metadata.expect("metadata is not set"),

            edition: self.instruction.edition.expect("edition is not set"),

            master_edition: self
                .instruction
                .master_edition
                .expect("master_edition is not set"),

            mint: self.instruction.mint.expect("mint is not set"),

            mint_authority: self
                .instruction
                .mint_authority
                .expect("mint_authority is not set"),

            printing_mint: self
                .instruction
                .printing_mint
                .expect("printing_mint is not set"),

            master_token_account: self
                .instruction
                .master_token_account
                .expect("master_token_account is not set"),

            edition_marker: self
                .instruction
                .edition_marker
                .expect("edition_marker is not set"),

            burn_authority: self
                .instruction
                .burn_authority
                .expect("burn_authority is not set"),

            payer: self.instruction.payer.expect("payer is not set"),

            master_update_authority: self
                .instruction
                .master_update_authority
                .expect("master_update_authority is not set"),

            master_metadata: self
                .instruction
                .master_metadata
                .expect("master_metadata is not set"),

            token_program: self
                .instruction
                .token_program
                .expect("token_program is not set"),

            system_program: self
                .instruction
                .system_program
                .expect("system_program is not set"),

            rent: self.instruction.rent.expect("rent is not set"),

            reservation_list: self.instruction.reservation_list,
        }
    }
}

struct DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenCpiBuilderInstruction<'a> {
    program: &'a solana_program::account_info::AccountInfo<'a>,
    metadata: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    edition: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    master_edition: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    mint: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    mint_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    printing_mint: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    master_token_account: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    edition_marker: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    burn_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    payer: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    master_update_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    master_metadata: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    token_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    system_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    rent: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    reservation_list: Option<&'a solana_program::account_info::AccountInfo<'a>>,
}
