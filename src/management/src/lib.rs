use candid::{CandidType, Deserialize};
use ic_cdk;
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(CandidType, Deserialize, Clone)]
struct Collection {
    owner: String,
    name: String,
    collection_size: u64,
    chain_name: String,
    description: String,
    standard: String,
}

type UserCollections = HashMap<String, Vec<Collection>>;

thread_local! {
    static USER_COLLECTIONS: RefCell<UserCollections> = RefCell::new(HashMap::new());
}

#[ic_cdk::update]
fn add_user(user_id: String) -> String {
    USER_COLLECTIONS.with(|collections| {
        if collections.borrow().contains_key(&user_id) {
            format!("User {} already exists", user_id)
        } else {
            collections.borrow_mut().insert(user_id.clone(), Vec::new());
            format!("User {} added successfully", user_id)
        }
    })
}

#[ic_cdk::update]
fn add_collection(user_id: String, mut collection: Collection) -> String {
    USER_COLLECTIONS.with(|collections| {
        if let Some(user_collections) = collections.borrow_mut().get_mut(&user_id) {
            collection.owner = user_id.clone();
            user_collections.push(collection);
            format!("Collection added successfully for user {}", user_id)
        } else {
            format!("User {} not found", user_id)
        }
    })
}

#[ic_cdk::query]
fn list_user_collections(user_id: String) -> Option<Vec<Collection>> {
    USER_COLLECTIONS.with(|collections| collections.borrow().get(&user_id).cloned())
}

#[ic_cdk::query]
fn user_exists(user_id: String) -> bool {
    USER_COLLECTIONS.with(|collections| collections.borrow().contains_key(&user_id))
}

// Required for Candid interface generation
ic_cdk::export_candid!();
