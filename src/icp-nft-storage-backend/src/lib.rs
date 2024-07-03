use candid::{CandidType, Deserialize};
use std::cell::RefCell;
use std::collections::HashMap;

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[derive(CandidType, Deserialize, Clone)]
struct Attribute {
    trait_type: String,
    value: String,
}

#[derive(CandidType, Deserialize, Clone)]
struct Metadata {
    name: String,
    description: String,
    image: String,
    attributes: Vec<Attribute>,
}

#[derive(CandidType, Deserialize, Clone)]
struct CollectionInfo {
    collection_size: u64,
    chain_name: String,
    description: String,
    standard: String,
}

thread_local! {
    static METADATA_STORE: RefCell<HashMap<u64, Metadata>> = RefCell::new(HashMap::new());
    static COLLECTION_INFO: RefCell<CollectionInfo> = RefCell::new(CollectionInfo {
        collection_size: 0,
        chain_name: String::new(),
        description: String::new(),
        standard: String::new(),
    });
}

#[ic_cdk::query]
fn get_metadata(token_id: u64) -> Option<Metadata> {
    METADATA_STORE.with(|store| store.borrow().get(&token_id).cloned())
}

#[ic_cdk::update]
fn update_metadata(token_id: u64, new_metadata: Metadata) {
    // TODO: Add authorization check here
    METADATA_STORE.with(|store| {
        store.borrow_mut().insert(token_id, new_metadata);
    });
}

#[ic_cdk::query]
fn get_all_metadata(start: u64, limit: u64) -> Vec<(u64, Metadata)> {
    METADATA_STORE.with(|store| {
        store
            .borrow()
            .iter()
            .skip(start as usize)
            .take(limit as usize)
            .map(|(&id, metadata)| (id, metadata.clone()))
            .collect()
    })
}

ic_cdk::export_candid!();
