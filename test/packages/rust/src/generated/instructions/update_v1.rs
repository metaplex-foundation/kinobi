//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use crate::generated::types::TokenStandard;
use crate::generated::types::{
    AuthorityType, AuthorizationData, Collection, CollectionDetails, Data, DelegateState,
    ProgrammableConfig, TokenStandard, Uses,
};
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{pubkey, pubkey::Pubkey};

/// Accounts.
pub struct UpdateV1 {
    /// Update authority or delegate
    pub authority: solana_program::pubkey::Pubkey,
    /// Metadata account
    pub metadata: solana_program::pubkey::Pubkey,
    /// Master Edition account
    pub master_edition: Option<solana_program::pubkey::Pubkey>,
    /// Mint account
    pub mint: solana_program::pubkey::Pubkey,
    /// System program
    pub system_program: solana_program::pubkey::Pubkey,
    /// System program
    pub sysvar_instructions: solana_program::pubkey::Pubkey,
    /// Token account
    pub token: Option<solana_program::pubkey::Pubkey>,
    /// Delegate record PDA
    pub delegate_record: Option<solana_program::pubkey::Pubkey>,
    /// Token Authorization Rules Program
    pub authorization_rules_program: Option<solana_program::pubkey::Pubkey>,
    /// Token Authorization Rules account
    pub authorization_rules: Option<solana_program::pubkey::Pubkey>,
}

impl UpdateV1 {
    pub fn instruction(
        &self,
        args: UpdateV1InstructionArgs,
    ) -> solana_program::instruction::Instruction {
        solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts: vec![
                solana_program::instruction::AccountMeta::new_readonly(self.authority, true),
                solana_program::instruction::AccountMeta::new(self.metadata, false),
                if let Some(master_edition) = self.master_edition {
                    solana_program::instruction::AccountMeta::new(master_edition, false)
                } else {
                    solana_program::instruction::AccountMeta::new_readonly(
                        crate::MPL_TOKEN_METADATA_ID,
                        false,
                    )
                },
                solana_program::instruction::AccountMeta::new_readonly(self.mint, false),
                solana_program::instruction::AccountMeta::new_readonly(self.system_program, false),
                solana_program::instruction::AccountMeta::new_readonly(
                    self.sysvar_instructions,
                    false,
                ),
                if let Some(token) = self.token {
                    solana_program::instruction::AccountMeta::new_readonly(token, false)
                } else {
                    solana_program::instruction::AccountMeta::new_readonly(
                        crate::MPL_TOKEN_METADATA_ID,
                        false,
                    )
                },
                if let Some(delegate_record) = self.delegate_record {
                    solana_program::instruction::AccountMeta::new_readonly(delegate_record, false)
                } else {
                    solana_program::instruction::AccountMeta::new_readonly(
                        crate::MPL_TOKEN_METADATA_ID,
                        false,
                    )
                },
                if let Some(authorization_rules_program) = self.authorization_rules_program {
                    solana_program::instruction::AccountMeta::new_readonly(
                        authorization_rules_program,
                        false,
                    )
                } else {
                    solana_program::instruction::AccountMeta::new_readonly(
                        crate::MPL_TOKEN_METADATA_ID,
                        false,
                    )
                },
                if let Some(authorization_rules) = self.authorization_rules {
                    solana_program::instruction::AccountMeta::new_readonly(
                        authorization_rules,
                        false,
                    )
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
pub struct UpdateV1InstructionArgs {
    discriminator: u8,
    update_v1_discriminator: u8,
    pub authorization_data: Option<AuthorizationData>,
    pub new_update_authority: Option<Pubkey>,
    pub data: Option<Data>,
    pub primary_sale_happened: Option<bool>,
    pub is_mutable: Option<bool>,
    pub token_standard: Option<TokenStandard>,
    pub collection: Option<Collection>,
    pub uses: Option<Uses>,
    pub collection_details: Option<CollectionDetails>,
    pub programmable_config: Option<ProgrammableConfig>,
    pub delegate_state: Option<DelegateState>,
    pub authority_type: AuthorityType,
}

impl UpdateV1InstructionArgs {
    pub fn new(
        authorization_data: Option<AuthorizationData>,
        new_update_authority: Option<Pubkey>,
        data: Option<Data>,
        primary_sale_happened: Option<bool>,
        is_mutable: Option<bool>,
        token_standard: Option<TokenStandard>,
        collection: Option<Collection>,
        uses: Option<Uses>,
        collection_details: Option<CollectionDetails>,
        programmable_config: Option<ProgrammableConfig>,
        delegate_state: Option<DelegateState>,
        authority_type: AuthorityType,
    ) -> Self {
        Self {
            discriminator: 43,
            update_v1_discriminator: 0,
            authorization_data,
            new_update_authority,
            data,
            primary_sale_happened,
            is_mutable,
            token_standard,
            collection,
            uses,
            collection_details,
            programmable_config,
            delegate_state,
            authority_type,
        }
    }
}

/// Instruction builder.
#[derive(Default)]
pub struct UpdateV1Builder {
    authority: Option<solana_program::pubkey::Pubkey>,
    metadata: Option<solana_program::pubkey::Pubkey>,
    master_edition: Option<solana_program::pubkey::Pubkey>,
    mint: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    sysvar_instructions: Option<solana_program::pubkey::Pubkey>,
    token: Option<solana_program::pubkey::Pubkey>,
    delegate_record: Option<solana_program::pubkey::Pubkey>,
    authorization_rules_program: Option<solana_program::pubkey::Pubkey>,
    authorization_rules: Option<solana_program::pubkey::Pubkey>,
    authorization_data: Option<AuthorizationData>,
    new_update_authority: Option<Pubkey>,
    data: Option<Data>,
    primary_sale_happened: Option<bool>,
    is_mutable: Option<bool>,
    token_standard: Option<TokenStandard>,
    collection: Option<Collection>,
    uses: Option<Uses>,
    collection_details: Option<CollectionDetails>,
    programmable_config: Option<ProgrammableConfig>,
    delegate_state: Option<DelegateState>,
    authority_type: Option<AuthorityType>,
}

impl UpdateV1Builder {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn authority(&mut self, authority: solana_program::pubkey::Pubkey) -> &mut Self {
        self.authority = Some(authority);
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
    pub fn token(&mut self, token: solana_program::pubkey::Pubkey) -> &mut Self {
        self.token = Some(token);
        self
    }
    pub fn delegate_record(
        &mut self,
        delegate_record: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.delegate_record = Some(delegate_record);
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
    pub fn authorization_data(&mut self, authorization_data: AuthorizationData) -> &mut Self {
        self.authorization_data = Some(authorization_data);
        self
    }
    pub fn new_update_authority(&mut self, new_update_authority: Pubkey) -> &mut Self {
        self.new_update_authority = Some(new_update_authority);
        self
    }
    pub fn data(&mut self, data: Data) -> &mut Self {
        self.data = Some(data);
        self
    }
    pub fn primary_sale_happened(&mut self, primary_sale_happened: bool) -> &mut Self {
        self.primary_sale_happened = Some(primary_sale_happened);
        self
    }
    pub fn is_mutable(&mut self, is_mutable: bool) -> &mut Self {
        self.is_mutable = Some(is_mutable);
        self
    }
    pub fn token_standard(&mut self, token_standard: TokenStandard) -> &mut Self {
        self.token_standard = Some(token_standard);
        self
    }
    pub fn collection(&mut self, collection: Collection) -> &mut Self {
        self.collection = Some(collection);
        self
    }
    pub fn uses(&mut self, uses: Uses) -> &mut Self {
        self.uses = Some(uses);
        self
    }
    pub fn collection_details(&mut self, collection_details: CollectionDetails) -> &mut Self {
        self.collection_details = Some(collection_details);
        self
    }
    pub fn programmable_config(&mut self, programmable_config: ProgrammableConfig) -> &mut Self {
        self.programmable_config = Some(programmable_config);
        self
    }
    pub fn delegate_state(&mut self, delegate_state: DelegateState) -> &mut Self {
        self.delegate_state = Some(delegate_state);
        self
    }
    pub fn authority_type(&mut self, authority_type: AuthorityType) -> &mut Self {
        self.authority_type = Some(authority_type);
        self
    }
    pub fn build(&self) -> solana_program::instruction::Instruction {
        let accounts = UpdateV1 {
            authority: self.authority.expect("authority is not set"),

            metadata: self.metadata.expect("metadata is not set"),

            master_edition: self.master_edition,

            mint: self.mint.expect("mint is not set"),

            system_program: self.system_program.expect("system_program is not set"),

            sysvar_instructions: self
                .sysvar_instructions
                .expect("sysvar_instructions is not set"),

            token: self.token,

            delegate_record: self.delegate_record,

            authorization_rules_program: self.authorization_rules_program,

            authorization_rules: self.authorization_rules,
        };
        let args = UpdateV1InstructionArgs::new(
            self.authorization_data,
            self.new_update_authority,
            self.data,
            self.primary_sale_happened,
            self.is_mutable,
            self.token_standard,
            self.collection,
            self.uses,
            self.collection_details,
            self.programmable_config,
            self.delegate_state,
            self.authority_type.expect("authority_type is not set"),
        );
        accounts.instruction(args)
    }
}

pub mod cpi {
    use super::*;

    /// `update_v1` CPI instruction.
    pub struct UpdateV1<'a> {
        pub program: &'a solana_program::account_info::AccountInfo<'a>,
        /// Update authority or delegate
        pub authority: &'a solana_program::account_info::AccountInfo<'a>,
        /// Metadata account
        pub metadata: &'a solana_program::account_info::AccountInfo<'a>,
        /// Master Edition account
        pub master_edition: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        /// Mint account
        pub mint: &'a solana_program::account_info::AccountInfo<'a>,
        /// System program
        pub system_program: &'a solana_program::account_info::AccountInfo<'a>,
        /// System program
        pub sysvar_instructions: &'a solana_program::account_info::AccountInfo<'a>,
        /// Token account
        pub token: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        /// Delegate record PDA
        pub delegate_record: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        /// Token Authorization Rules Program
        pub authorization_rules_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        /// Token Authorization Rules account
        pub authorization_rules: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        pub args: UpdateV1InstructionArgs,
    }

    impl<'a> UpdateV1<'a> {
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
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.authority.key,
                        true,
                    ),
                    solana_program::instruction::AccountMeta::new(*self.metadata.key, false),
                    if let Some(master_edition) = self.master_edition {
                        solana_program::instruction::AccountMeta::new(*master_edition.key, false)
                    } else {
                        solana_program::instruction::AccountMeta::new_readonly(
                            crate::MPL_TOKEN_METADATA_ID,
                            false,
                        )
                    },
                    solana_program::instruction::AccountMeta::new_readonly(*self.mint.key, false),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.system_program.key,
                        false,
                    ),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.sysvar_instructions.key,
                        false,
                    ),
                    if let Some(token) = self.token {
                        solana_program::instruction::AccountMeta::new_readonly(*token.key, false)
                    } else {
                        solana_program::instruction::AccountMeta::new_readonly(
                            crate::MPL_TOKEN_METADATA_ID,
                            false,
                        )
                    },
                    if let Some(delegate_record) = self.delegate_record {
                        solana_program::instruction::AccountMeta::new_readonly(
                            *delegate_record.key,
                            false,
                        )
                    } else {
                        solana_program::instruction::AccountMeta::new_readonly(
                            crate::MPL_TOKEN_METADATA_ID,
                            false,
                        )
                    },
                    if let Some(authorization_rules_program) = self.authorization_rules_program {
                        solana_program::instruction::AccountMeta::new_readonly(
                            *authorization_rules_program.key,
                            false,
                        )
                    } else {
                        solana_program::instruction::AccountMeta::new_readonly(
                            crate::MPL_TOKEN_METADATA_ID,
                            false,
                        )
                    },
                    if let Some(authorization_rules) = self.authorization_rules {
                        solana_program::instruction::AccountMeta::new_readonly(
                            *authorization_rules.key,
                            false,
                        )
                    } else {
                        solana_program::instruction::AccountMeta::new_readonly(
                            crate::MPL_TOKEN_METADATA_ID,
                            false,
                        )
                    },
                ],
                data: self.args.try_to_vec().unwrap(),
            };
            let mut account_infos = Vec::with_capacity(10 + 1);
            account_infos.push(self.program.clone());
            account_infos.push(self.authority.clone());
            account_infos.push(self.metadata.clone());
            if let Some(master_edition) = self.master_edition {
                account_infos.push(master_edition.clone());
            }
            account_infos.push(self.mint.clone());
            account_infos.push(self.system_program.clone());
            account_infos.push(self.sysvar_instructions.clone());
            if let Some(token) = self.token {
                account_infos.push(token.clone());
            }
            if let Some(delegate_record) = self.delegate_record {
                account_infos.push(delegate_record.clone());
            }
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

    /// `update_v1` CPI instruction builder.
    pub struct UpdateV1Builder<'a> {
        program: &'a solana_program::account_info::AccountInfo<'a>,
        authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        metadata: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        master_edition: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        mint: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        system_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        sysvar_instructions: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        token: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        delegate_record: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        authorization_rules_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        authorization_rules: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        authorization_data: Option<AuthorizationData>,
        new_update_authority: Option<Pubkey>,
        data: Option<Data>,
        primary_sale_happened: Option<bool>,
        is_mutable: Option<bool>,
        token_standard: Option<TokenStandard>,
        collection: Option<Collection>,
        uses: Option<Uses>,
        collection_details: Option<CollectionDetails>,
        programmable_config: Option<ProgrammableConfig>,
        delegate_state: Option<DelegateState>,
        authority_type: Option<AuthorityType>,
    }

    impl<'a> UpdateV1Builder<'a> {
        pub fn new(program: &'a solana_program::account_info::AccountInfo<'a>) -> Self {
            Self {
                program,
                authority: None,
                metadata: None,
                master_edition: None,
                mint: None,
                system_program: None,
                sysvar_instructions: None,
                token: None,
                delegate_record: None,
                authorization_rules_program: None,
                authorization_rules: None,
                authorization_data: None,
                new_update_authority: None,
                data: None,
                primary_sale_happened: None,
                is_mutable: None,
                token_standard: None,
                collection: None,
                uses: None,
                collection_details: None,
                programmable_config: None,
                delegate_state: None,
                authority_type: None,
            }
        }
        pub fn authority(
            &'a mut self,
            authority: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.authority = Some(authority);
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
        pub fn token(
            &'a mut self,
            token: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.token = Some(token);
            self
        }
        pub fn delegate_record(
            &'a mut self,
            delegate_record: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.delegate_record = Some(delegate_record);
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
        pub fn authorization_data(
            &'a mut self,
            authorization_data: AuthorizationData,
        ) -> &mut Self {
            self.authorization_data = Some(authorization_data);
            self
        }
        pub fn new_update_authority(&'a mut self, new_update_authority: Pubkey) -> &mut Self {
            self.new_update_authority = Some(new_update_authority);
            self
        }
        pub fn data(&'a mut self, data: Data) -> &mut Self {
            self.data = Some(data);
            self
        }
        pub fn primary_sale_happened(&'a mut self, primary_sale_happened: bool) -> &mut Self {
            self.primary_sale_happened = Some(primary_sale_happened);
            self
        }
        pub fn is_mutable(&'a mut self, is_mutable: bool) -> &mut Self {
            self.is_mutable = Some(is_mutable);
            self
        }
        pub fn token_standard(&'a mut self, token_standard: TokenStandard) -> &mut Self {
            self.token_standard = Some(token_standard);
            self
        }
        pub fn collection(&'a mut self, collection: Collection) -> &mut Self {
            self.collection = Some(collection);
            self
        }
        pub fn uses(&'a mut self, uses: Uses) -> &mut Self {
            self.uses = Some(uses);
            self
        }
        pub fn collection_details(
            &'a mut self,
            collection_details: CollectionDetails,
        ) -> &mut Self {
            self.collection_details = Some(collection_details);
            self
        }
        pub fn programmable_config(
            &'a mut self,
            programmable_config: ProgrammableConfig,
        ) -> &mut Self {
            self.programmable_config = Some(programmable_config);
            self
        }
        pub fn delegate_state(&'a mut self, delegate_state: DelegateState) -> &mut Self {
            self.delegate_state = Some(delegate_state);
            self
        }
        pub fn authority_type(&'a mut self, authority_type: AuthorityType) -> &mut Self {
            self.authority_type = Some(authority_type);
            self
        }
        pub fn build(&'a self) -> UpdateV1 {
            UpdateV1 {
                program: self.program,

                authority: self.authority.expect("authority is not set"),

                metadata: self.metadata.expect("metadata is not set"),

                master_edition: self.master_edition,

                mint: self.mint.expect("mint is not set"),

                system_program: self.system_program.expect("system_program is not set"),

                sysvar_instructions: self
                    .sysvar_instructions
                    .expect("sysvar_instructions is not set"),

                token: self.token,

                delegate_record: self.delegate_record,

                authorization_rules_program: self.authorization_rules_program,

                authorization_rules: self.authorization_rules,
                args: UpdateV1InstructionArgs::new(
                    self.authorization_data,
                    self.new_update_authority,
                    self.data,
                    self.primary_sale_happened,
                    self.is_mutable,
                    self.token_standard,
                    self.collection,
                    self.uses,
                    self.collection_details,
                    self.programmable_config,
                    self.delegate_state,
                    self.authority_type.expect("authority_type is not set"),
                ),
            }
        }
    }
}
