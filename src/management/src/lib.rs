use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::management_canister::main::{
    CanisterSettings, CreateCanisterArgument, InstallCodeArgument,
};
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(CandidType, Deserialize)]
struct CollectionInitData {
    owner: Principal,
    collection_size: u64,
    chain_name: String,
    description: String,
    standard: String,
}

thread_local! {
    static COLLECTIONS: RefCell<HashMap<Principal, Principal>> = RefCell::new(HashMap::new());
}

#[ic_cdk::update]
async fn create_collection(init_data: CollectionInitData) -> Result<Principal, String> {
    let caller = ic_cdk::caller();

    // Create the new canister
    let create_args = CreateCanisterArgument {
        settings: Some(CanisterSettings {
            controllers: Some(vec![ic_cdk::id()]),
            compute_allocation: None,
            memory_allocation: None,
            freezing_threshold: None,
            reserved_cycles_limit: None,
            log_visibility: None,
            wasm_memory_limit: None,
        }),
    };

    let canister_id = match ic_cdk::api::management_canister::main::create_canister(
        create_args,
        1_000_000_000_000,
    )
    .await
    {
        Ok((canister_id,)) => canister_id,
        Err((_, err)) => return Err(format!("Failed to create canister: {}", err)),
    };

    // Install the collection canister code
    let wasm_module =
        include_bytes!("../../../target/wasm32-unknown-unknown/release/collection.wasm");

    let install_args = InstallCodeArgument {
        mode: candid::parser::value::Value::Text("install".to_string()),
        canister_id,
        wasm_module: wasm_module.to_vec(),
        arg: candid::encode_one(init_data)
            .map_err(|e| format!("Failed to encode init args: {}", e))?,
    };

    match ic_cdk::api::management_canister::main::install_code(install_args).await {
        Ok(()) => {
            COLLECTIONS.with(|collections: &RefCell<HashMap<Principal, Principal>>| {
                collections.borrow_mut().insert(caller, canister_id);
            });
            Ok(canister_id)
        }
        Err((_, err)) => Err(format!("Failed to install code: {}", err)),
    }
}

#[ic_cdk::query]
fn get_user_collection(user: Principal) -> Option<Principal> {
    COLLECTIONS.with(|collections| collections.borrow().get(&user).cloned())
}

ic_cdk::export_candid!();
