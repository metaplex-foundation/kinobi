//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use borsh::{BorshDeserialize, BorshSerialize};

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
        solana_program::instruction::Instruction {
            program_id: crate::programs::mpl_token_metadata::ID,
            accounts: vec![
                                          solana_program::instruction::AccountMeta::new(
              self.metadata,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new(
              self.token_account,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new(
              self.mint,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new(
              self.use_authority,
              true
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.owner,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.token_program,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.ata_program,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.system_program,
              false
            ),
                                                                solana_program::instruction::AccountMeta::new_readonly(
              self.rent,
              false
            ),
                                                                if let Some(use_authority_record) = self.use_authority_record {
              solana_program::instruction::AccountMeta::new(
                use_authority_record,
                false,
              ),
            } else {
              solana_program::instruction::AccountMeta::new_readonly(
                crate::programs::mpl_token_metadata::ID,
                false,
              ),
            },
                                                                if let Some(burner) = self.burner {
              solana_program::instruction::AccountMeta::new_readonly(
                burner,
                false,
              ),
            } else {
              solana_program::instruction::AccountMeta::new_readonly(
                crate::programs::mpl_token_metadata::ID,
                false,
              ),
            },
                                  ],
            data: args.try_to_vec().unwrap(),
        }
    }
}

/// Instruction builder.
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
}

impl UtilizeBuilder {
    pub fn metadata(&mut self, metadata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.metadata = Some(metadata);
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
    pub fn use_authority(&mut self, use_authority: solana_program::pubkey::Pubkey) -> &mut Self {
        self.use_authority = Some(use_authority);
        self
    }
    pub fn owner(&mut self, owner: solana_program::pubkey::Pubkey) -> &mut Self {
        self.owner = Some(owner);
        self
    }
    pub fn token_program(&mut self, token_program: solana_program::pubkey::Pubkey) -> &mut Self {
        self.token_program = Some(token_program);
        self
    }
    pub fn ata_program(&mut self, ata_program: solana_program::pubkey::Pubkey) -> &mut Self {
        self.ata_program = Some(ata_program);
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
    pub fn use_authority_record(
        &mut self,
        use_authority_record: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.use_authority_record = Some(use_authority_record);
        self
    }
    pub fn burner(&mut self, burner: solana_program::pubkey::Pubkey) -> &mut Self {
        self.burner = Some(burner);
        self
    }
    pub fn number_of_uses(&mut self, number_of_uses: u64) -> &mut Self {
        self.number_of_uses = Some(number_of_uses);
        self
    }
    pub fn build(&self) -> solana_program::instruction::Instruction {
        let accounts = Utilize {
            metadata: self.metadata.expect("metadata is not set"),

            token_account: self.token_account.expect("token_account is not set"),

            mint: self.mint.expect("mint is not set"),

            use_authority: self.use_authority.expect("use_authority is not set"),

            owner: self.owner.expect("owner is not set"),

            token_program: self.token_program.expect("token_program is not set"),

            ata_program: self.ata_program.expect("ata_program is not set"),

            system_program: self.system_program.expect("system_program is not set"),

            rent: self.rent.expect("rent is not set"),

            use_authority_record: self.use_authority_record,

            burner: self.burner,
        };
        let args =
            UtilizeInstructionArgs::new(self.number_of_uses.expect("number_of_uses is not set"));
        accounts.instruction(args)
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct UtilizeInstructionArgs {
    discriminator: u8,
    pub number_of_uses: u64,
}

impl UtilizeInstructionArgs {
    pub fn new(number_of_uses: u64) -> Self {
        Self {
            discriminator: 19,
            number_of_uses,
        }
    }
}
