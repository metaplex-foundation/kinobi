//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use borsh::BorshDeserialize;
use borsh::BorshSerialize;

/// Accounts.
pub struct RevokeUseAuthority {
    /// Use Authority Record PDA
    pub use_authority_record: solana_program::pubkey::Pubkey,
    /// Owner
    pub owner: solana_program::pubkey::Pubkey,
    /// A Use Authority
    pub user: solana_program::pubkey::Pubkey,
    /// Owned Token Account Of Mint
    pub owner_token_account: solana_program::pubkey::Pubkey,
    /// Mint of Metadata
    pub mint: solana_program::pubkey::Pubkey,
    /// Metadata account
    pub metadata: solana_program::pubkey::Pubkey,
    /// Token program
    pub token_program: solana_program::pubkey::Pubkey,
    /// System program
    pub system_program: solana_program::pubkey::Pubkey,
    /// Rent info
    pub rent: Option<solana_program::pubkey::Pubkey>,
}

impl RevokeUseAuthority {
    pub fn instruction(&self) -> solana_program::instruction::Instruction {
        self.instruction_with_remaining_accounts(&[])
    }
    #[allow(clippy::vec_init_then_push)]
    pub fn instruction_with_remaining_accounts(
        &self,
        remaining_accounts: &[solana_program::instruction::AccountMeta],
    ) -> solana_program::instruction::Instruction {
        let mut accounts = Vec::with_capacity(9 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.use_authority_record,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.owner, true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.user, false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.owner_token_account,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.mint, false,
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
        accounts.extend_from_slice(remaining_accounts);
        let data = RevokeUseAuthorityInstructionData::new()
            .try_to_vec()
            .unwrap();

        solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts,
            data,
        }
    }
}

#[derive(BorshDeserialize, BorshSerialize)]
struct RevokeUseAuthorityInstructionData {
    discriminator: u8,
}

impl RevokeUseAuthorityInstructionData {
    fn new() -> Self {
        Self { discriminator: 21 }
    }
}

/// Instruction builder for `RevokeUseAuthority`.
///
/// ### Accounts:
///
///   0. `[writable]` use_authority_record
///   1. `[writable, signer]` owner
///   2. `[]` user
///   3. `[writable]` owner_token_account
///   4. `[]` mint
///   5. `[]` metadata
///   6. `[optional]` token_program (default to `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`)
///   7. `[optional]` system_program (default to `11111111111111111111111111111111`)
///   8. `[optional]` rent
#[derive(Clone, Debug, Default)]
pub struct RevokeUseAuthorityBuilder {
    use_authority_record: Option<solana_program::pubkey::Pubkey>,
    owner: Option<solana_program::pubkey::Pubkey>,
    user: Option<solana_program::pubkey::Pubkey>,
    owner_token_account: Option<solana_program::pubkey::Pubkey>,
    mint: Option<solana_program::pubkey::Pubkey>,
    metadata: Option<solana_program::pubkey::Pubkey>,
    token_program: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    rent: Option<solana_program::pubkey::Pubkey>,
    __remaining_accounts: Vec<solana_program::instruction::AccountMeta>,
}

impl RevokeUseAuthorityBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    /// Use Authority Record PDA
    #[inline(always)]
    pub fn use_authority_record(
        &mut self,
        use_authority_record: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.use_authority_record = Some(use_authority_record);
        self
    }
    /// Owner
    #[inline(always)]
    pub fn owner(&mut self, owner: solana_program::pubkey::Pubkey) -> &mut Self {
        self.owner = Some(owner);
        self
    }
    /// A Use Authority
    #[inline(always)]
    pub fn user(&mut self, user: solana_program::pubkey::Pubkey) -> &mut Self {
        self.user = Some(user);
        self
    }
    /// Owned Token Account Of Mint
    #[inline(always)]
    pub fn owner_token_account(
        &mut self,
        owner_token_account: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.owner_token_account = Some(owner_token_account);
        self
    }
    /// Mint of Metadata
    #[inline(always)]
    pub fn mint(&mut self, mint: solana_program::pubkey::Pubkey) -> &mut Self {
        self.mint = Some(mint);
        self
    }
    /// Metadata account
    #[inline(always)]
    pub fn metadata(&mut self, metadata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.metadata = Some(metadata);
        self
    }
    /// `[optional account, default to 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA']`
    /// Token program
    #[inline(always)]
    pub fn token_program(&mut self, token_program: solana_program::pubkey::Pubkey) -> &mut Self {
        self.token_program = Some(token_program);
        self
    }
    /// `[optional account, default to '11111111111111111111111111111111']`
    /// System program
    #[inline(always)]
    pub fn system_program(&mut self, system_program: solana_program::pubkey::Pubkey) -> &mut Self {
        self.system_program = Some(system_program);
        self
    }
    /// `[optional account]`
    /// Rent info
    #[inline(always)]
    pub fn rent(&mut self, rent: Option<solana_program::pubkey::Pubkey>) -> &mut Self {
        self.rent = rent;
        self
    }
    /// Add an aditional account to the instruction.
    #[inline(always)]
    pub fn add_remaining_account(
        &mut self,
        account: solana_program::instruction::AccountMeta,
    ) -> &mut Self {
        self.__remaining_accounts.push(account);
        self
    }
    /// Add additional accounts to the instruction.
    #[inline(always)]
    pub fn add_remaining_accounts(
        &mut self,
        accounts: &[solana_program::instruction::AccountMeta],
    ) -> &mut Self {
        self.__remaining_accounts.extend_from_slice(accounts);
        self
    }
    #[allow(clippy::clone_on_copy)]
    pub fn instruction(&self) -> solana_program::instruction::Instruction {
        let accounts = RevokeUseAuthority {
            use_authority_record: self
                .use_authority_record
                .expect("use_authority_record is not set"),
            owner: self.owner.expect("owner is not set"),
            user: self.user.expect("user is not set"),
            owner_token_account: self
                .owner_token_account
                .expect("owner_token_account is not set"),
            mint: self.mint.expect("mint is not set"),
            metadata: self.metadata.expect("metadata is not set"),
            token_program: self.token_program.unwrap_or(solana_program::pubkey!(
                "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            )),
            system_program: self
                .system_program
                .unwrap_or(solana_program::pubkey!("11111111111111111111111111111111")),
            rent: self.rent,
        };

        accounts.instruction_with_remaining_accounts(&self.__remaining_accounts)
    }
}

/// `revoke_use_authority` CPI accounts.
pub struct RevokeUseAuthorityCpiAccounts<'a, 'b> {
    /// Use Authority Record PDA
    pub use_authority_record: &'b solana_program::account_info::AccountInfo<'a>,
    /// Owner
    pub owner: &'b solana_program::account_info::AccountInfo<'a>,
    /// A Use Authority
    pub user: &'b solana_program::account_info::AccountInfo<'a>,
    /// Owned Token Account Of Mint
    pub owner_token_account: &'b solana_program::account_info::AccountInfo<'a>,
    /// Mint of Metadata
    pub mint: &'b solana_program::account_info::AccountInfo<'a>,
    /// Metadata account
    pub metadata: &'b solana_program::account_info::AccountInfo<'a>,
    /// Token program
    pub token_program: &'b solana_program::account_info::AccountInfo<'a>,
    /// System program
    pub system_program: &'b solana_program::account_info::AccountInfo<'a>,
    /// Rent info
    pub rent: Option<&'b solana_program::account_info::AccountInfo<'a>>,
}

/// `revoke_use_authority` CPI instruction.
pub struct RevokeUseAuthorityCpi<'a, 'b> {
    /// The program to invoke.
    pub __program: &'b solana_program::account_info::AccountInfo<'a>,
    /// Use Authority Record PDA
    pub use_authority_record: &'b solana_program::account_info::AccountInfo<'a>,
    /// Owner
    pub owner: &'b solana_program::account_info::AccountInfo<'a>,
    /// A Use Authority
    pub user: &'b solana_program::account_info::AccountInfo<'a>,
    /// Owned Token Account Of Mint
    pub owner_token_account: &'b solana_program::account_info::AccountInfo<'a>,
    /// Mint of Metadata
    pub mint: &'b solana_program::account_info::AccountInfo<'a>,
    /// Metadata account
    pub metadata: &'b solana_program::account_info::AccountInfo<'a>,
    /// Token program
    pub token_program: &'b solana_program::account_info::AccountInfo<'a>,
    /// System program
    pub system_program: &'b solana_program::account_info::AccountInfo<'a>,
    /// Rent info
    pub rent: Option<&'b solana_program::account_info::AccountInfo<'a>>,
}

impl<'a, 'b> RevokeUseAuthorityCpi<'a, 'b> {
    pub fn new(
        program: &'b solana_program::account_info::AccountInfo<'a>,
        accounts: RevokeUseAuthorityCpiAccounts<'a, 'b>,
    ) -> Self {
        Self {
            __program: program,
            use_authority_record: accounts.use_authority_record,
            owner: accounts.owner,
            user: accounts.user,
            owner_token_account: accounts.owner_token_account,
            mint: accounts.mint,
            metadata: accounts.metadata,
            token_program: accounts.token_program,
            system_program: accounts.system_program,
            rent: accounts.rent,
        }
    }
    #[inline(always)]
    pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed_with_remaining_accounts(&[], &[])
    }
    #[inline(always)]
    pub fn invoke_with_remaining_accounts(
        &self,
        remaining_accounts: &[(
            &'b solana_program::account_info::AccountInfo<'a>,
            bool,
            bool,
        )],
    ) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed_with_remaining_accounts(&[], remaining_accounts)
    }
    #[inline(always)]
    pub fn invoke_signed(
        &self,
        signers_seeds: &[&[&[u8]]],
    ) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed_with_remaining_accounts(signers_seeds, &[])
    }
    #[allow(clippy::clone_on_copy)]
    #[allow(clippy::vec_init_then_push)]
    pub fn invoke_signed_with_remaining_accounts(
        &self,
        signers_seeds: &[&[&[u8]]],
        remaining_accounts: &[(
            &'b solana_program::account_info::AccountInfo<'a>,
            bool,
            bool,
        )],
    ) -> solana_program::entrypoint::ProgramResult {
        let mut accounts = Vec::with_capacity(9 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.use_authority_record.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.owner.key,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.user.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.owner_token_account.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.mint.key,
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
        remaining_accounts.iter().for_each(|remaining_account| {
            accounts.push(solana_program::instruction::AccountMeta {
                pubkey: *remaining_account.0.key,
                is_signer: remaining_account.1,
                is_writable: remaining_account.2,
            })
        });
        let data = RevokeUseAuthorityInstructionData::new()
            .try_to_vec()
            .unwrap();

        let instruction = solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts,
            data,
        };
        let mut account_infos = Vec::with_capacity(9 + 1 + remaining_accounts.len());
        account_infos.push(self.__program.clone());
        account_infos.push(self.use_authority_record.clone());
        account_infos.push(self.owner.clone());
        account_infos.push(self.user.clone());
        account_infos.push(self.owner_token_account.clone());
        account_infos.push(self.mint.clone());
        account_infos.push(self.metadata.clone());
        account_infos.push(self.token_program.clone());
        account_infos.push(self.system_program.clone());
        if let Some(rent) = self.rent {
            account_infos.push(rent.clone());
        }
        remaining_accounts
            .iter()
            .for_each(|remaining_account| account_infos.push(remaining_account.0.clone()));

        if signers_seeds.is_empty() {
            solana_program::program::invoke(&instruction, &account_infos)
        } else {
            solana_program::program::invoke_signed(&instruction, &account_infos, signers_seeds)
        }
    }
}

/// Instruction builder for `RevokeUseAuthority` via CPI.
///
/// ### Accounts:
///
///   0. `[writable]` use_authority_record
///   1. `[writable, signer]` owner
///   2. `[]` user
///   3. `[writable]` owner_token_account
///   4. `[]` mint
///   5. `[]` metadata
///   6. `[]` token_program
///   7. `[]` system_program
///   8. `[optional]` rent
#[derive(Clone, Debug)]
pub struct RevokeUseAuthorityCpiBuilder<'a, 'b> {
    instruction: Box<RevokeUseAuthorityCpiBuilderInstruction<'a, 'b>>,
}

impl<'a, 'b> RevokeUseAuthorityCpiBuilder<'a, 'b> {
    pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(RevokeUseAuthorityCpiBuilderInstruction {
            __program: program,
            use_authority_record: None,
            owner: None,
            user: None,
            owner_token_account: None,
            mint: None,
            metadata: None,
            token_program: None,
            system_program: None,
            rent: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
    /// Use Authority Record PDA
    #[inline(always)]
    pub fn use_authority_record(
        &mut self,
        use_authority_record: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.use_authority_record = Some(use_authority_record);
        self
    }
    /// Owner
    #[inline(always)]
    pub fn owner(&mut self, owner: &'b solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.owner = Some(owner);
        self
    }
    /// A Use Authority
    #[inline(always)]
    pub fn user(&mut self, user: &'b solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.user = Some(user);
        self
    }
    /// Owned Token Account Of Mint
    #[inline(always)]
    pub fn owner_token_account(
        &mut self,
        owner_token_account: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.owner_token_account = Some(owner_token_account);
        self
    }
    /// Mint of Metadata
    #[inline(always)]
    pub fn mint(&mut self, mint: &'b solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.mint = Some(mint);
        self
    }
    /// Metadata account
    #[inline(always)]
    pub fn metadata(
        &mut self,
        metadata: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.metadata = Some(metadata);
        self
    }
    /// Token program
    #[inline(always)]
    pub fn token_program(
        &mut self,
        token_program: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.token_program = Some(token_program);
        self
    }
    /// System program
    #[inline(always)]
    pub fn system_program(
        &mut self,
        system_program: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.system_program = Some(system_program);
        self
    }
    /// `[optional account]`
    /// Rent info
    #[inline(always)]
    pub fn rent(
        &mut self,
        rent: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    ) -> &mut Self {
        self.instruction.rent = rent;
        self
    }
    /// Add an additional account to the instruction.
    #[inline(always)]
    pub fn add_remaining_account(
        &mut self,
        account: &'b solana_program::account_info::AccountInfo<'a>,
        is_writable: bool,
        is_signer: bool,
    ) -> &mut Self {
        self.instruction
            .__remaining_accounts
            .push((account, is_writable, is_signer));
        self
    }
    /// Add additional accounts to the instruction.
    ///
    /// Each account is represented by a tuple of the `AccountInfo`, a `bool` indicating whether the account is writable or not,
    /// and a `bool` indicating whether the account is a signer or not.
    #[inline(always)]
    pub fn add_remaining_accounts(
        &mut self,
        accounts: &[(
            &'b solana_program::account_info::AccountInfo<'a>,
            bool,
            bool,
        )],
    ) -> &mut Self {
        self.instruction
            .__remaining_accounts
            .extend_from_slice(accounts);
        self
    }
    #[inline(always)]
    pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed(&[])
    }
    #[allow(clippy::clone_on_copy)]
    #[allow(clippy::vec_init_then_push)]
    pub fn invoke_signed(
        &self,
        signers_seeds: &[&[&[u8]]],
    ) -> solana_program::entrypoint::ProgramResult {
        let instruction = RevokeUseAuthorityCpi {
            __program: self.instruction.__program,

            use_authority_record: self
                .instruction
                .use_authority_record
                .expect("use_authority_record is not set"),

            owner: self.instruction.owner.expect("owner is not set"),

            user: self.instruction.user.expect("user is not set"),

            owner_token_account: self
                .instruction
                .owner_token_account
                .expect("owner_token_account is not set"),

            mint: self.instruction.mint.expect("mint is not set"),

            metadata: self.instruction.metadata.expect("metadata is not set"),

            token_program: self
                .instruction
                .token_program
                .expect("token_program is not set"),

            system_program: self
                .instruction
                .system_program
                .expect("system_program is not set"),

            rent: self.instruction.rent,
        };
        instruction.invoke_signed_with_remaining_accounts(
            signers_seeds,
            &self.instruction.__remaining_accounts,
        )
    }
}

#[derive(Clone, Debug)]
struct RevokeUseAuthorityCpiBuilderInstruction<'a, 'b> {
    __program: &'b solana_program::account_info::AccountInfo<'a>,
    use_authority_record: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    owner: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    user: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    owner_token_account: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    mint: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    metadata: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    token_program: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    system_program: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    rent: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// Additional instruction accounts `(AccountInfo, is_writable, is_signer)`.
    __remaining_accounts: Vec<(
        &'b solana_program::account_info::AccountInfo<'a>,
        bool,
        bool,
    )>,
}
