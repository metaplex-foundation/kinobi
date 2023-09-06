//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use borsh::BorshDeserialize;
use borsh::BorshSerialize;

/// Accounts.
pub struct Utilize {
    /// Metadata account
    pub metadata: solana_program::pubkey::Pubkey,
    /// Token Account Of NFT
    pub token_account: solana_program::pubkey::Pubkey,
    /// Mint of the Metadata
    pub mint: solana_program::pubkey::Pubkey,
    /// A Use Authority / Can be the current Owner of the NFT
    pub use_authority: solana_program::pubkey::Pubkey,
    /// Owner
    pub owner: solana_program::pubkey::Pubkey,
    /// Token program
    pub token_program: solana_program::pubkey::Pubkey,
    /// Associated Token program
    pub ata_program: solana_program::pubkey::Pubkey,
    /// System program
    pub system_program: solana_program::pubkey::Pubkey,
    /// Rent info
    pub rent: solana_program::pubkey::Pubkey,
    /// Use Authority Record PDA If present the program Assumes a delegated use authority
    pub use_authority_record: Option<solana_program::pubkey::Pubkey>,
    /// Program As Signer (Burner)
    pub burner: Option<solana_program::pubkey::Pubkey>,
}

impl Utilize {
    pub fn instruction(
        &self,
        args: UtilizeInstructionArgs,
    ) -> solana_program::instruction::Instruction {
        self.instruction_with_remaining_accounts(args, &[])
    }
    #[allow(clippy::vec_init_then_push)]
    pub fn instruction_with_remaining_accounts(
        &self,
        args: UtilizeInstructionArgs,
        remaining_accounts: &[super::InstructionAccount],
    ) -> solana_program::instruction::Instruction {
        let mut accounts = Vec::with_capacity(11 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.metadata,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.token_account,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.mint, false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.use_authority,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.owner, false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.token_program,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.ata_program,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.system_program,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.rent, false,
        ));
        if let Some(use_authority_record) = self.use_authority_record {
            accounts.push(solana_program::instruction::AccountMeta::new(
                use_authority_record,
                false,
            ));
        } else {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                crate::MPL_TOKEN_METADATA_ID,
                false,
            ));
        }
        if let Some(burner) = self.burner {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                burner, false,
            ));
        } else {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                crate::MPL_TOKEN_METADATA_ID,
                false,
            ));
        }
        remaining_accounts
            .iter()
            .for_each(|remaining_account| accounts.push(remaining_account.to_account_meta()));
        let mut data = UtilizeInstructionData::new().try_to_vec().unwrap();
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
struct UtilizeInstructionData {
    discriminator: u8,
}

impl UtilizeInstructionData {
    fn new() -> Self {
        Self { discriminator: 19 }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Eq, PartialEq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct UtilizeInstructionArgs {
    pub number_of_uses: u64,
}

/// Instruction builder.
#[derive(Default)]
pub struct UtilizeBuilder {
    metadata: Option<solana_program::pubkey::Pubkey>,
    token_account: Option<solana_program::pubkey::Pubkey>,
    mint: Option<solana_program::pubkey::Pubkey>,
    use_authority: Option<solana_program::pubkey::Pubkey>,
    owner: Option<solana_program::pubkey::Pubkey>,
    token_program: Option<solana_program::pubkey::Pubkey>,
    ata_program: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    rent: Option<solana_program::pubkey::Pubkey>,
    use_authority_record: Option<solana_program::pubkey::Pubkey>,
    burner: Option<solana_program::pubkey::Pubkey>,
    number_of_uses: Option<u64>,
    __remaining_accounts: Vec<super::InstructionAccount>,
}

impl UtilizeBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    /// Metadata account
    #[inline(always)]
    pub fn metadata(&mut self, metadata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.metadata = Some(metadata);
        self
    }
    /// Token Account Of NFT
    #[inline(always)]
    pub fn token_account(&mut self, token_account: solana_program::pubkey::Pubkey) -> &mut Self {
        self.token_account = Some(token_account);
        self
    }
    /// Mint of the Metadata
    #[inline(always)]
    pub fn mint(&mut self, mint: solana_program::pubkey::Pubkey) -> &mut Self {
        self.mint = Some(mint);
        self
    }
    /// A Use Authority / Can be the current Owner of the NFT
    #[inline(always)]
    pub fn use_authority(&mut self, use_authority: solana_program::pubkey::Pubkey) -> &mut Self {
        self.use_authority = Some(use_authority);
        self
    }
    /// Owner
    #[inline(always)]
    pub fn owner(&mut self, owner: solana_program::pubkey::Pubkey) -> &mut Self {
        self.owner = Some(owner);
        self
    }
    /// `[optional account, default to 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA']`
    /// Token program
    #[inline(always)]
    pub fn token_program(&mut self, token_program: solana_program::pubkey::Pubkey) -> &mut Self {
        self.token_program = Some(token_program);
        self
    }
    /// `[optional account, default to 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL']`
    /// Associated Token program
    #[inline(always)]
    pub fn ata_program(&mut self, ata_program: solana_program::pubkey::Pubkey) -> &mut Self {
        self.ata_program = Some(ata_program);
        self
    }
    /// `[optional account, default to '11111111111111111111111111111111']`
    /// System program
    #[inline(always)]
    pub fn system_program(&mut self, system_program: solana_program::pubkey::Pubkey) -> &mut Self {
        self.system_program = Some(system_program);
        self
    }
    /// `[optional account, default to 'SysvarRent111111111111111111111111111111111']`
    /// Rent info
    #[inline(always)]
    pub fn rent(&mut self, rent: solana_program::pubkey::Pubkey) -> &mut Self {
        self.rent = Some(rent);
        self
    }
    /// `[optional account]`
    /// Use Authority Record PDA If present the program Assumes a delegated use authority
    #[inline(always)]
    pub fn use_authority_record(
        &mut self,
        use_authority_record: Option<solana_program::pubkey::Pubkey>,
    ) -> &mut Self {
        self.use_authority_record = use_authority_record;
        self
    }
    /// `[optional account]`
    /// Program As Signer (Burner)
    #[inline(always)]
    pub fn burner(&mut self, burner: Option<solana_program::pubkey::Pubkey>) -> &mut Self {
        self.burner = burner;
        self
    }
    #[inline(always)]
    pub fn number_of_uses(&mut self, number_of_uses: u64) -> &mut Self {
        self.number_of_uses = Some(number_of_uses);
        self
    }
    #[inline(always)]
    pub fn add_remaining_account(&mut self, account: super::InstructionAccount) -> &mut Self {
        self.__remaining_accounts.push(account);
        self
    }
    #[inline(always)]
    pub fn add_remaining_accounts(&mut self, accounts: &[super::InstructionAccount]) -> &mut Self {
        self.__remaining_accounts.extend_from_slice(accounts);
        self
    }
    #[allow(clippy::clone_on_copy)]
    pub fn instruction(&self) -> solana_program::instruction::Instruction {
        let accounts = Utilize {
            metadata: self.metadata.expect("metadata is not set"),
            token_account: self.token_account.expect("token_account is not set"),
            mint: self.mint.expect("mint is not set"),
            use_authority: self.use_authority.expect("use_authority is not set"),
            owner: self.owner.expect("owner is not set"),
            token_program: self.token_program.unwrap_or(solana_program::pubkey!(
                "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            )),
            ata_program: self.ata_program.unwrap_or(solana_program::pubkey!(
                "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
            )),
            system_program: self
                .system_program
                .unwrap_or(solana_program::pubkey!("11111111111111111111111111111111")),
            rent: self.rent.unwrap_or(solana_program::pubkey!(
                "SysvarRent111111111111111111111111111111111"
            )),
            use_authority_record: self.use_authority_record,
            burner: self.burner,
        };
        let args = UtilizeInstructionArgs {
            number_of_uses: self
                .number_of_uses
                .clone()
                .expect("number_of_uses is not set"),
        };

        accounts.instruction_with_remaining_accounts(args, &self.__remaining_accounts)
    }
}

/// `utilize` CPI accounts.
pub struct UtilizeCpiAccounts<'a> {
    /// Metadata account
    pub metadata: &'a solana_program::account_info::AccountInfo<'a>,
    /// Token Account Of NFT
    pub token_account: &'a solana_program::account_info::AccountInfo<'a>,
    /// Mint of the Metadata
    pub mint: &'a solana_program::account_info::AccountInfo<'a>,
    /// A Use Authority / Can be the current Owner of the NFT
    pub use_authority: &'a solana_program::account_info::AccountInfo<'a>,
    /// Owner
    pub owner: &'a solana_program::account_info::AccountInfo<'a>,
    /// Token program
    pub token_program: &'a solana_program::account_info::AccountInfo<'a>,
    /// Associated Token program
    pub ata_program: &'a solana_program::account_info::AccountInfo<'a>,
    /// System program
    pub system_program: &'a solana_program::account_info::AccountInfo<'a>,
    /// Rent info
    pub rent: &'a solana_program::account_info::AccountInfo<'a>,
    /// Use Authority Record PDA If present the program Assumes a delegated use authority
    pub use_authority_record: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    /// Program As Signer (Burner)
    pub burner: Option<&'a solana_program::account_info::AccountInfo<'a>>,
}

/// `utilize` CPI instruction.
pub struct UtilizeCpi<'a> {
    /// The program to invoke.
    pub __program: &'a solana_program::account_info::AccountInfo<'a>,
    /// Metadata account
    pub metadata: &'a solana_program::account_info::AccountInfo<'a>,
    /// Token Account Of NFT
    pub token_account: &'a solana_program::account_info::AccountInfo<'a>,
    /// Mint of the Metadata
    pub mint: &'a solana_program::account_info::AccountInfo<'a>,
    /// A Use Authority / Can be the current Owner of the NFT
    pub use_authority: &'a solana_program::account_info::AccountInfo<'a>,
    /// Owner
    pub owner: &'a solana_program::account_info::AccountInfo<'a>,
    /// Token program
    pub token_program: &'a solana_program::account_info::AccountInfo<'a>,
    /// Associated Token program
    pub ata_program: &'a solana_program::account_info::AccountInfo<'a>,
    /// System program
    pub system_program: &'a solana_program::account_info::AccountInfo<'a>,
    /// Rent info
    pub rent: &'a solana_program::account_info::AccountInfo<'a>,
    /// Use Authority Record PDA If present the program Assumes a delegated use authority
    pub use_authority_record: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    /// Program As Signer (Burner)
    pub burner: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    /// The arguments for the instruction.
    pub __args: UtilizeInstructionArgs,
}

impl<'a> UtilizeCpi<'a> {
    pub fn new(
        program: &'a solana_program::account_info::AccountInfo<'a>,
        accounts: UtilizeCpiAccounts<'a>,
        args: UtilizeInstructionArgs,
    ) -> Self {
        Self {
            __program: program,
            metadata: accounts.metadata,
            token_account: accounts.token_account,
            mint: accounts.mint,
            use_authority: accounts.use_authority,
            owner: accounts.owner,
            token_program: accounts.token_program,
            ata_program: accounts.ata_program,
            system_program: accounts.system_program,
            rent: accounts.rent,
            use_authority_record: accounts.use_authority_record,
            burner: accounts.burner,
            __args: args,
        }
    }
    #[inline(always)]
    pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed_with_remaining_accounts(&[], &[])
    }
    #[inline(always)]
    pub fn invoke_with_remaining_accounts(
        &self,
        remaining_accounts: &[super::InstructionAccountInfo<'a>],
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
        remaining_accounts: &[super::InstructionAccountInfo<'a>],
    ) -> solana_program::entrypoint::ProgramResult {
        let mut accounts = Vec::with_capacity(11 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.metadata.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.token_account.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.mint.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.use_authority.key,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.owner.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.token_program.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.ata_program.key,
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
        if let Some(use_authority_record) = self.use_authority_record {
            accounts.push(solana_program::instruction::AccountMeta::new(
                *use_authority_record.key,
                false,
            ));
        } else {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                crate::MPL_TOKEN_METADATA_ID,
                false,
            ));
        }
        if let Some(burner) = self.burner {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                *burner.key,
                false,
            ));
        } else {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                crate::MPL_TOKEN_METADATA_ID,
                false,
            ));
        }
        remaining_accounts
            .iter()
            .for_each(|remaining_account| accounts.push(remaining_account.to_account_meta()));
        let mut data = UtilizeInstructionData::new().try_to_vec().unwrap();
        let mut args = self.__args.try_to_vec().unwrap();
        data.append(&mut args);

        let instruction = solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts,
            data,
        };
        let mut account_infos = Vec::with_capacity(11 + 1 + remaining_accounts.len());
        account_infos.push(self.__program.clone());
        account_infos.push(self.metadata.clone());
        account_infos.push(self.token_account.clone());
        account_infos.push(self.mint.clone());
        account_infos.push(self.use_authority.clone());
        account_infos.push(self.owner.clone());
        account_infos.push(self.token_program.clone());
        account_infos.push(self.ata_program.clone());
        account_infos.push(self.system_program.clone());
        account_infos.push(self.rent.clone());
        if let Some(use_authority_record) = self.use_authority_record {
            account_infos.push(use_authority_record.clone());
        }
        if let Some(burner) = self.burner {
            account_infos.push(burner.clone());
        }
        remaining_accounts.iter().for_each(|remaining_account| {
            account_infos.push(remaining_account.account_info().clone())
        });

        if signers_seeds.is_empty() {
            solana_program::program::invoke(&instruction, &account_infos)
        } else {
            solana_program::program::invoke_signed(&instruction, &account_infos, signers_seeds)
        }
    }
}

/// `utilize` CPI instruction builder.
pub struct UtilizeCpiBuilder<'a> {
    instruction: Box<UtilizeCpiBuilderInstruction<'a>>,
}

impl<'a> UtilizeCpiBuilder<'a> {
    pub fn new(program: &'a solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(UtilizeCpiBuilderInstruction {
            __program: program,
            metadata: None,
            token_account: None,
            mint: None,
            use_authority: None,
            owner: None,
            token_program: None,
            ata_program: None,
            system_program: None,
            rent: None,
            use_authority_record: None,
            burner: None,
            number_of_uses: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
    /// Metadata account
    #[inline(always)]
    pub fn metadata(
        &mut self,
        metadata: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.metadata = Some(metadata);
        self
    }
    /// Token Account Of NFT
    #[inline(always)]
    pub fn token_account(
        &mut self,
        token_account: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.token_account = Some(token_account);
        self
    }
    /// Mint of the Metadata
    #[inline(always)]
    pub fn mint(&mut self, mint: &'a solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.mint = Some(mint);
        self
    }
    /// A Use Authority / Can be the current Owner of the NFT
    #[inline(always)]
    pub fn use_authority(
        &mut self,
        use_authority: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.use_authority = Some(use_authority);
        self
    }
    /// Owner
    #[inline(always)]
    pub fn owner(&mut self, owner: &'a solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.owner = Some(owner);
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
    /// Associated Token program
    #[inline(always)]
    pub fn ata_program(
        &mut self,
        ata_program: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.ata_program = Some(ata_program);
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
    /// Rent info
    #[inline(always)]
    pub fn rent(&mut self, rent: &'a solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.rent = Some(rent);
        self
    }
    /// `[optional account]`
    /// Use Authority Record PDA If present the program Assumes a delegated use authority
    #[inline(always)]
    pub fn use_authority_record(
        &mut self,
        use_authority_record: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    ) -> &mut Self {
        self.instruction.use_authority_record = use_authority_record;
        self
    }
    /// `[optional account]`
    /// Program As Signer (Burner)
    #[inline(always)]
    pub fn burner(
        &mut self,
        burner: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    ) -> &mut Self {
        self.instruction.burner = burner;
        self
    }
    #[inline(always)]
    pub fn number_of_uses(&mut self, number_of_uses: u64) -> &mut Self {
        self.instruction.number_of_uses = Some(number_of_uses);
        self
    }
    #[inline(always)]
    pub fn add_remaining_account(
        &mut self,
        account: super::InstructionAccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.__remaining_accounts.push(account);
        self
    }
    #[inline(always)]
    pub fn add_remaining_accounts(
        &mut self,
        accounts: &[super::InstructionAccountInfo<'a>],
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
        let args = UtilizeInstructionArgs {
            number_of_uses: self
                .instruction
                .number_of_uses
                .clone()
                .expect("number_of_uses is not set"),
        };
        let instruction = UtilizeCpi {
            __program: self.instruction.__program,

            metadata: self.instruction.metadata.expect("metadata is not set"),

            token_account: self
                .instruction
                .token_account
                .expect("token_account is not set"),

            mint: self.instruction.mint.expect("mint is not set"),

            use_authority: self
                .instruction
                .use_authority
                .expect("use_authority is not set"),

            owner: self.instruction.owner.expect("owner is not set"),

            token_program: self
                .instruction
                .token_program
                .expect("token_program is not set"),

            ata_program: self
                .instruction
                .ata_program
                .expect("ata_program is not set"),

            system_program: self
                .instruction
                .system_program
                .expect("system_program is not set"),

            rent: self.instruction.rent.expect("rent is not set"),

            use_authority_record: self.instruction.use_authority_record,

            burner: self.instruction.burner,
            __args: args,
        };
        instruction.invoke_signed_with_remaining_accounts(
            signers_seeds,
            &self.instruction.__remaining_accounts,
        )
    }
}

struct UtilizeCpiBuilderInstruction<'a> {
    __program: &'a solana_program::account_info::AccountInfo<'a>,
    metadata: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    token_account: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    mint: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    use_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    owner: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    token_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    ata_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    system_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    rent: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    use_authority_record: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    burner: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    number_of_uses: Option<u64>,
    __remaining_accounts: Vec<super::InstructionAccountInfo<'a>>,
}
