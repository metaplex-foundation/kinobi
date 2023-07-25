/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

use crate::generated::types::{ Collection, CollectionDetails, Creator, DelegateState, ProgrammableConfig, TokenStandard, Uses };
use solana_program::{ pubkey::Pubkey };


struct AssetData {
update_authority: Pubkey,
name: String,
symbol: String,
uri: String,
seller_fee_basis_points: u16,
creators: Option<Vec<Creator>>,
primary_sale_happened: bool,
is_mutable: bool,
edition_nonce: Option<u8>,
token_standard: TokenStandard,
collection: Option<Collection>,
uses: Option<Uses>,
collection_details: Option<CollectionDetails>,
programmable_config: Option<ProgrammableConfig>,
delegate_state: Option<DelegateState>,
}
