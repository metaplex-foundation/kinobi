//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use crate::generated::types::MintNewEditionFromMasterEditionViaTokenArgs;
use borsh::BorshDeserialize;
use borsh::BorshSerialize;

/// Accounts.
pub struct MintNewEditionFromMasterEditionViaVaultProxy {
    /// New Metadata key (pda of ['metadata', program id, mint id])
    pub new_metadata: solana_program::pubkey::Pubkey,
    /// New Edition (pda of ['metadata', program id, mint id, 'edition'])
    pub new_edition: solana_program::pubkey::Pubkey,
    /// Master Record Edition V2 (pda of ['metadata', program id, master metadata mint id, 'edition']
    pub master_edition: solana_program::pubkey::Pubkey,
    /// Mint of new token - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY
    pub new_mint: solana_program::pubkey::Pubkey,
    /// Edition pda to mark creation - will be checked for pre-existence. (pda of ['metadata', program id, master metadata mint id, 'edition', edition_number]) where edition_number is NOT the edition number you pass in args but actually edition_number = floor(edition/EDITION_MARKER_BIT_SIZE).
    pub edition_mark_pda: solana_program::pubkey::Pubkey,
    /// Mint authority of new mint
    pub new_mint_authority: solana_program::pubkey::Pubkey,
    /// payer
    pub payer: solana_program::pubkey::Pubkey,
    /// Vault authority
    pub vault_authority: solana_program::pubkey::Pubkey,
    /// Safety deposit token store account
    pub safety_deposit_store: solana_program::pubkey::Pubkey,
    /// Safety deposit box
    pub safety_deposit_box: solana_program::pubkey::Pubkey,
    /// Vault
    pub vault: solana_program::pubkey::Pubkey,
    /// Update authority info for new metadata
    pub new_metadata_update_authority: solana_program::pubkey::Pubkey,
    /// Master record metadata account
    pub metadata: solana_program::pubkey::Pubkey,
    /// Token program
    pub token_program: solana_program::pubkey::Pubkey,
    /// Token vault program
    pub token_vault_program: solana_program::pubkey::Pubkey,
    /// System program
    pub system_program: solana_program::pubkey::Pubkey,
    /// Rent info
    pub rent: Option<solana_program::pubkey::Pubkey>,
}

impl MintNewEditionFromMasterEditionViaVaultProxy {
    #[allow(clippy::vec_init_then_push)]
    pub fn instruction(
        &self,
        args: MintNewEditionFromMasterEditionViaVaultProxyInstructionArgs,
    ) -> solana_program::instruction::Instruction {
        let mut accounts = Vec::with_capacity(17);
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.new_metadata,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.new_edition,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.master_edition,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.new_mint,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.edition_mark_pda,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.new_mint_authority,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.payer, true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.vault_authority,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.safety_deposit_store,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.safety_deposit_box,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.vault, false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.new_metadata_update_authority,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.metadata,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.token_program,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.token_vault_program,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.system_program,
            false,
        ));
        if let Some(rent) = self.rent {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                rent, false,
            ));
        } else {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                crate::MPL_TOKEN_METADATA_ID,
                false,
            ));
        }
        let mut data = MintNewEditionFromMasterEditionViaVaultProxyInstructionData::new()
            .try_to_vec()
            .unwrap();
        let mut args = args.try_to_vec().unwrap();
        data.append(&mut args);

        solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts,
            data,
        }
    }
}

#[derive(BorshDeserialize, BorshSerialize)]
struct MintNewEditionFromMasterEditionViaVaultProxyInstructionData {
    discriminator: u8,
}

impl MintNewEditionFromMasterEditionViaVaultProxyInstructionData {
    fn new() -> Self {
        Self { discriminator: 13 }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct MintNewEditionFromMasterEditionViaVaultProxyInstructionArgs {
    pub mint_new_edition_from_master_edition_via_token_args:
        MintNewEditionFromMasterEditionViaTokenArgs,
}

/// Instruction builder.
#[derive(Default)]
pub struct MintNewEditionFromMasterEditionViaVaultProxyBuilder {
    new_metadata: Option<solana_program::pubkey::Pubkey>,
    new_edition: Option<solana_program::pubkey::Pubkey>,
    master_edition: Option<solana_program::pubkey::Pubkey>,
    new_mint: Option<solana_program::pubkey::Pubkey>,
    edition_mark_pda: Option<solana_program::pubkey::Pubkey>,
    new_mint_authority: Option<solana_program::pubkey::Pubkey>,
    payer: Option<solana_program::pubkey::Pubkey>,
    vault_authority: Option<solana_program::pubkey::Pubkey>,
    safety_deposit_store: Option<solana_program::pubkey::Pubkey>,
    safety_deposit_box: Option<solana_program::pubkey::Pubkey>,
    vault: Option<solana_program::pubkey::Pubkey>,
    new_metadata_update_authority: Option<solana_program::pubkey::Pubkey>,
    metadata: Option<solana_program::pubkey::Pubkey>,
    token_program: Option<solana_program::pubkey::Pubkey>,
    token_vault_program: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    rent: Option<solana_program::pubkey::Pubkey>,
    mint_new_edition_from_master_edition_via_token_args:
        Option<MintNewEditionFromMasterEditionViaTokenArgs>,
}

impl MintNewEditionFromMasterEditionViaVaultProxyBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    /// New Metadata key (pda of ['metadata', program id, mint id])
    #[inline(always)]
    pub fn new_metadata(&mut self, new_metadata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.new_metadata = Some(new_metadata);
        self
    }
    /// New Edition (pda of ['metadata', program id, mint id, 'edition'])
    #[inline(always)]
    pub fn new_edition(&mut self, new_edition: solana_program::pubkey::Pubkey) -> &mut Self {
        self.new_edition = Some(new_edition);
        self
    }
    /// Master Record Edition V2 (pda of ['metadata', program id, master metadata mint id, 'edition']
    #[inline(always)]
    pub fn master_edition(&mut self, master_edition: solana_program::pubkey::Pubkey) -> &mut Self {
        self.master_edition = Some(master_edition);
        self
    }
    /// Mint of new token - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY
    #[inline(always)]
    pub fn new_mint(&mut self, new_mint: solana_program::pubkey::Pubkey) -> &mut Self {
        self.new_mint = Some(new_mint);
        self
    }
    /// Edition pda to mark creation - will be checked for pre-existence. (pda of ['metadata', program id, master metadata mint id, 'edition', edition_number]) where edition_number is NOT the edition number you pass in args but actually edition_number = floor(edition/EDITION_MARKER_BIT_SIZE).
    #[inline(always)]
    pub fn edition_mark_pda(
        &mut self,
        edition_mark_pda: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.edition_mark_pda = Some(edition_mark_pda);
        self
    }
    /// Mint authority of new mint
    #[inline(always)]
    pub fn new_mint_authority(
        &mut self,
        new_mint_authority: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.new_mint_authority = Some(new_mint_authority);
        self
    }
    /// payer
    #[inline(always)]
    pub fn payer(&mut self, payer: solana_program::pubkey::Pubkey) -> &mut Self {
        self.payer = Some(payer);
        self
    }
    /// Vault authority
    #[inline(always)]
    pub fn vault_authority(
        &mut self,
        vault_authority: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.vault_authority = Some(vault_authority);
        self
    }
    /// Safety deposit token store account
    #[inline(always)]
    pub fn safety_deposit_store(
        &mut self,
        safety_deposit_store: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.safety_deposit_store = Some(safety_deposit_store);
        self
    }
    /// Safety deposit box
    #[inline(always)]
    pub fn safety_deposit_box(
        &mut self,
        safety_deposit_box: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.safety_deposit_box = Some(safety_deposit_box);
        self
    }
    /// Vault
    #[inline(always)]
    pub fn vault(&mut self, vault: solana_program::pubkey::Pubkey) -> &mut Self {
        self.vault = Some(vault);
        self
    }
    /// Update authority info for new metadata
    #[inline(always)]
    pub fn new_metadata_update_authority(
        &mut self,
        new_metadata_update_authority: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.new_metadata_update_authority = Some(new_metadata_update_authority);
        self
    }
    /// Master record metadata account
    #[inline(always)]
    pub fn metadata(&mut self, metadata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.metadata = Some(metadata);
        self
    }
    /// Token program
    #[inline(always)]
    pub fn token_program(&mut self, token_program: solana_program::pubkey::Pubkey) -> &mut Self {
        self.token_program = Some(token_program);
        self
    }
    /// Token vault program
    #[inline(always)]
    pub fn token_vault_program(
        &mut self,
        token_vault_program: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.token_vault_program = Some(token_vault_program);
        self
    }
    /// System program
    #[inline(always)]
    pub fn system_program(&mut self, system_program: solana_program::pubkey::Pubkey) -> &mut Self {
        self.system_program = Some(system_program);
        self
    }
    /// `[optional account]`
    /// Rent info
    #[inline(always)]
    pub fn rent(&mut self, rent: solana_program::pubkey::Pubkey) -> &mut Self {
        self.rent = Some(rent);
        self
    }
    #[inline(always)]
    pub fn mint_new_edition_from_master_edition_via_token_args(
        &mut self,
        mint_new_edition_from_master_edition_via_token_args: MintNewEditionFromMasterEditionViaTokenArgs,
    ) -> &mut Self {
        self.mint_new_edition_from_master_edition_via_token_args =
            Some(mint_new_edition_from_master_edition_via_token_args);
        self
    }
    #[allow(clippy::clone_on_copy)]
    pub fn build(&self) -> solana_program::instruction::Instruction {
        let accounts = MintNewEditionFromMasterEditionViaVaultProxy {
            new_metadata: self.new_metadata.expect("new_metadata is not set"),
            new_edition: self.new_edition.expect("new_edition is not set"),
            master_edition: self.master_edition.expect("master_edition is not set"),
            new_mint: self.new_mint.expect("new_mint is not set"),
            edition_mark_pda: self.edition_mark_pda.expect("edition_mark_pda is not set"),
            new_mint_authority: self
                .new_mint_authority
                .expect("new_mint_authority is not set"),
            payer: self.payer.expect("payer is not set"),
            vault_authority: self.vault_authority.expect("vault_authority is not set"),
            safety_deposit_store: self
                .safety_deposit_store
                .expect("safety_deposit_store is not set"),
            safety_deposit_box: self
                .safety_deposit_box
                .expect("safety_deposit_box is not set"),
            vault: self.vault.expect("vault is not set"),
            new_metadata_update_authority: self
                .new_metadata_update_authority
                .expect("new_metadata_update_authority is not set"),
            metadata: self.metadata.expect("metadata is not set"),
            token_program: self.token_program.unwrap_or(solana_program::pubkey!(
                "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            )),
            token_vault_program: self
                .token_vault_program
                .expect("token_vault_program is not set"),
            system_program: self
                .system_program
                .unwrap_or(solana_program::pubkey!("11111111111111111111111111111111")),
            rent: self.rent,
        };
        let args = MintNewEditionFromMasterEditionViaVaultProxyInstructionArgs {
            mint_new_edition_from_master_edition_via_token_args: self
                .mint_new_edition_from_master_edition_via_token_args
                .clone()
                .expect("mint_new_edition_from_master_edition_via_token_args is not set"),
        };

        accounts.instruction(args)
    }
}

/// `mint_new_edition_from_master_edition_via_vault_proxy` CPI instruction.
pub struct MintNewEditionFromMasterEditionViaVaultProxyCpi<'a> {
    /// The program to invoke.
    pub __program: &'a solana_program::account_info::AccountInfo<'a>,
    /// New Metadata key (pda of ['metadata', program id, mint id])
    pub new_metadata: &'a solana_program::account_info::AccountInfo<'a>,
    /// New Edition (pda of ['metadata', program id, mint id, 'edition'])
    pub new_edition: &'a solana_program::account_info::AccountInfo<'a>,
    /// Master Record Edition V2 (pda of ['metadata', program id, master metadata mint id, 'edition']
    pub master_edition: &'a solana_program::account_info::AccountInfo<'a>,
    /// Mint of new token - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY
    pub new_mint: &'a solana_program::account_info::AccountInfo<'a>,
    /// Edition pda to mark creation - will be checked for pre-existence. (pda of ['metadata', program id, master metadata mint id, 'edition', edition_number]) where edition_number is NOT the edition number you pass in args but actually edition_number = floor(edition/EDITION_MARKER_BIT_SIZE).
    pub edition_mark_pda: &'a solana_program::account_info::AccountInfo<'a>,
    /// Mint authority of new mint
    pub new_mint_authority: &'a solana_program::account_info::AccountInfo<'a>,
    /// payer
    pub payer: &'a solana_program::account_info::AccountInfo<'a>,
    /// Vault authority
    pub vault_authority: &'a solana_program::account_info::AccountInfo<'a>,
    /// Safety deposit token store account
    pub safety_deposit_store: &'a solana_program::account_info::AccountInfo<'a>,
    /// Safety deposit box
    pub safety_deposit_box: &'a solana_program::account_info::AccountInfo<'a>,
    /// Vault
    pub vault: &'a solana_program::account_info::AccountInfo<'a>,
    /// Update authority info for new metadata
    pub new_metadata_update_authority: &'a solana_program::account_info::AccountInfo<'a>,
    /// Master record metadata account
    pub metadata: &'a solana_program::account_info::AccountInfo<'a>,
    /// Token program
    pub token_program: &'a solana_program::account_info::AccountInfo<'a>,
    /// Token vault program
    pub token_vault_program: &'a solana_program::account_info::AccountInfo<'a>,
    /// System program
    pub system_program: &'a solana_program::account_info::AccountInfo<'a>,
    /// Rent info
    pub rent: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    /// The arguments for the instruction.
    pub __args: MintNewEditionFromMasterEditionViaVaultProxyInstructionArgs,
}

impl<'a> MintNewEditionFromMasterEditionViaVaultProxyCpi<'a> {
    pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed(&[])
    }
    #[allow(clippy::clone_on_copy)]
    #[allow(clippy::vec_init_then_push)]
    pub fn invoke_signed(
        &self,
        signers_seeds: &[&[&[u8]]],
    ) -> solana_program::entrypoint::ProgramResult {
        let mut accounts = Vec::with_capacity(17);
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.new_metadata.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.new_edition.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.master_edition.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.new_mint.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.edition_mark_pda.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.new_mint_authority.key,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.payer.key,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.vault_authority.key,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.safety_deposit_store.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.safety_deposit_box.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.vault.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.new_metadata_update_authority.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.metadata.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.token_program.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.token_vault_program.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.system_program.key,
            false,
        ));
        if let Some(rent) = self.rent {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                *rent.key, false,
            ));
        } else {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                crate::MPL_TOKEN_METADATA_ID,
                false,
            ));
        }
        let mut data = MintNewEditionFromMasterEditionViaVaultProxyInstructionData::new()
            .try_to_vec()
            .unwrap();
        let mut args = self.__args.try_to_vec().unwrap();
        data.append(&mut args);

        let instruction = solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts,
            data,
        };
        let mut account_infos = Vec::with_capacity(17 + 1);
        account_infos.push(self.__program.clone());
        account_infos.push(self.new_metadata.clone());
        account_infos.push(self.new_edition.clone());
        account_infos.push(self.master_edition.clone());
        account_infos.push(self.new_mint.clone());
        account_infos.push(self.edition_mark_pda.clone());
        account_infos.push(self.new_mint_authority.clone());
        account_infos.push(self.payer.clone());
        account_infos.push(self.vault_authority.clone());
        account_infos.push(self.safety_deposit_store.clone());
        account_infos.push(self.safety_deposit_box.clone());
        account_infos.push(self.vault.clone());
        account_infos.push(self.new_metadata_update_authority.clone());
        account_infos.push(self.metadata.clone());
        account_infos.push(self.token_program.clone());
        account_infos.push(self.token_vault_program.clone());
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

/// `mint_new_edition_from_master_edition_via_vault_proxy` CPI instruction builder.
pub struct MintNewEditionFromMasterEditionViaVaultProxyCpiBuilder<'a> {
    instruction: Box<MintNewEditionFromMasterEditionViaVaultProxyCpiBuilderInstruction<'a>>,
}

impl<'a> MintNewEditionFromMasterEditionViaVaultProxyCpiBuilder<'a> {
    pub fn new(program: &'a solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(
            MintNewEditionFromMasterEditionViaVaultProxyCpiBuilderInstruction {
                __program: program,
                new_metadata: None,
                new_edition: None,
                master_edition: None,
                new_mint: None,
                edition_mark_pda: None,
                new_mint_authority: None,
                payer: None,
                vault_authority: None,
                safety_deposit_store: None,
                safety_deposit_box: None,
                vault: None,
                new_metadata_update_authority: None,
                metadata: None,
                token_program: None,
                token_vault_program: None,
                system_program: None,
                rent: None,
                mint_new_edition_from_master_edition_via_token_args: None,
            },
        );
        Self { instruction }
    }
    /// New Metadata key (pda of ['metadata', program id, mint id])
    #[inline(always)]
    pub fn new_metadata(
        &mut self,
        new_metadata: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.new_metadata = Some(new_metadata);
        self
    }
    /// New Edition (pda of ['metadata', program id, mint id, 'edition'])
    #[inline(always)]
    pub fn new_edition(
        &mut self,
        new_edition: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.new_edition = Some(new_edition);
        self
    }
    /// Master Record Edition V2 (pda of ['metadata', program id, master metadata mint id, 'edition']
    #[inline(always)]
    pub fn master_edition(
        &mut self,
        master_edition: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.master_edition = Some(master_edition);
        self
    }
    /// Mint of new token - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY
    #[inline(always)]
    pub fn new_mint(
        &mut self,
        new_mint: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.new_mint = Some(new_mint);
        self
    }
    /// Edition pda to mark creation - will be checked for pre-existence. (pda of ['metadata', program id, master metadata mint id, 'edition', edition_number]) where edition_number is NOT the edition number you pass in args but actually edition_number = floor(edition/EDITION_MARKER_BIT_SIZE).
    #[inline(always)]
    pub fn edition_mark_pda(
        &mut self,
        edition_mark_pda: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.edition_mark_pda = Some(edition_mark_pda);
        self
    }
    /// Mint authority of new mint
    #[inline(always)]
    pub fn new_mint_authority(
        &mut self,
        new_mint_authority: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.new_mint_authority = Some(new_mint_authority);
        self
    }
    /// payer
    #[inline(always)]
    pub fn payer(&mut self, payer: &'a solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.payer = Some(payer);
        self
    }
    /// Vault authority
    #[inline(always)]
    pub fn vault_authority(
        &mut self,
        vault_authority: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.vault_authority = Some(vault_authority);
        self
    }
    /// Safety deposit token store account
    #[inline(always)]
    pub fn safety_deposit_store(
        &mut self,
        safety_deposit_store: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.safety_deposit_store = Some(safety_deposit_store);
        self
    }
    /// Safety deposit box
    #[inline(always)]
    pub fn safety_deposit_box(
        &mut self,
        safety_deposit_box: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.safety_deposit_box = Some(safety_deposit_box);
        self
    }
    /// Vault
    #[inline(always)]
    pub fn vault(&mut self, vault: &'a solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.vault = Some(vault);
        self
    }
    /// Update authority info for new metadata
    #[inline(always)]
    pub fn new_metadata_update_authority(
        &mut self,
        new_metadata_update_authority: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.new_metadata_update_authority = Some(new_metadata_update_authority);
        self
    }
    /// Master record metadata account
    #[inline(always)]
    pub fn metadata(
        &mut self,
        metadata: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.metadata = Some(metadata);
        self
    }
    /// Token program
    #[inline(always)]
    pub fn token_program(
        &mut self,
        token_program: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.token_program = Some(token_program);
        self
    }
    /// Token vault program
    #[inline(always)]
    pub fn token_vault_program(
        &mut self,
        token_vault_program: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.token_vault_program = Some(token_vault_program);
        self
    }
    /// System program
    #[inline(always)]
    pub fn system_program(
        &mut self,
        system_program: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.system_program = Some(system_program);
        self
    }
    /// `[optional account]`
    /// Rent info
    #[inline(always)]
    pub fn rent(&mut self, rent: &'a solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.rent = Some(rent);
        self
    }
    #[inline(always)]
    pub fn mint_new_edition_from_master_edition_via_token_args(
        &mut self,
        mint_new_edition_from_master_edition_via_token_args: MintNewEditionFromMasterEditionViaTokenArgs,
    ) -> &mut Self {
        self.instruction
            .mint_new_edition_from_master_edition_via_token_args =
            Some(mint_new_edition_from_master_edition_via_token_args);
        self
    }
    #[allow(clippy::clone_on_copy)]
    pub fn build(&self) -> MintNewEditionFromMasterEditionViaVaultProxyCpi<'a> {
        let args = MintNewEditionFromMasterEditionViaVaultProxyInstructionArgs {
            mint_new_edition_from_master_edition_via_token_args: self
                .instruction
                .mint_new_edition_from_master_edition_via_token_args
                .clone()
                .expect("mint_new_edition_from_master_edition_via_token_args is not set"),
        };

        MintNewEditionFromMasterEditionViaVaultProxyCpi {
            __program: self.instruction.__program,

            new_metadata: self
                .instruction
                .new_metadata
                .expect("new_metadata is not set"),

            new_edition: self
                .instruction
                .new_edition
                .expect("new_edition is not set"),

            master_edition: self
                .instruction
                .master_edition
                .expect("master_edition is not set"),

            new_mint: self.instruction.new_mint.expect("new_mint is not set"),

            edition_mark_pda: self
                .instruction
                .edition_mark_pda
                .expect("edition_mark_pda is not set"),

            new_mint_authority: self
                .instruction
                .new_mint_authority
                .expect("new_mint_authority is not set"),

            payer: self.instruction.payer.expect("payer is not set"),

            vault_authority: self
                .instruction
                .vault_authority
                .expect("vault_authority is not set"),

            safety_deposit_store: self
                .instruction
                .safety_deposit_store
                .expect("safety_deposit_store is not set"),

            safety_deposit_box: self
                .instruction
                .safety_deposit_box
                .expect("safety_deposit_box is not set"),

            vault: self.instruction.vault.expect("vault is not set"),

            new_metadata_update_authority: self
                .instruction
                .new_metadata_update_authority
                .expect("new_metadata_update_authority is not set"),

            metadata: self.instruction.metadata.expect("metadata is not set"),

            token_program: self
                .instruction
                .token_program
                .expect("token_program is not set"),

            token_vault_program: self
                .instruction
                .token_vault_program
                .expect("token_vault_program is not set"),

            system_program: self
                .instruction
                .system_program
                .expect("system_program is not set"),

            rent: self.instruction.rent,
            __args: args,
        }
    }
}

struct MintNewEditionFromMasterEditionViaVaultProxyCpiBuilderInstruction<'a> {
    __program: &'a solana_program::account_info::AccountInfo<'a>,
    new_metadata: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    new_edition: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    master_edition: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    new_mint: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    edition_mark_pda: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    new_mint_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    payer: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    vault_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    safety_deposit_store: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    safety_deposit_box: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    vault: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    new_metadata_update_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    metadata: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    token_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    token_vault_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    system_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    rent: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    mint_new_edition_from_master_edition_via_token_args:
        Option<MintNewEditionFromMasterEditionViaTokenArgs>,
}
