mod generated;
pub use generated::*;

impl std::fmt::Display for crate::types::DelegateRole {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        let message = match self {
            Self::Authority => "authority_delegate".to_string(),
            Self::Collection => "collection_delegate".to_string(),
            Self::Use => "use_delegate".to_string(),
            Self::Utility => "utility_delegate".to_string(),
            Self::Sale => "sale_delegate".to_string(),
            Self::Update => "update_delegate".to_string(),
            Self::Transfer => "transfer_delegate".to_string(),
        };

        write!(f, "{message}")
    }
}
