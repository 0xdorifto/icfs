use candid::{CandidType, Deserialize, Principal};
// use ic_cdk::api::management_canister::main::{
//     CanisterIdRecord, CanisterInstallMode, CanisterSettings, CreateCanisterArgument,
//     InstallCodeArgument,
// };
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(CandidType, Deserialize)]
struct CollectionInitData {
    owner: Principal,
    name: String,
    collection_size: u64,
    chain_name: String,
    description: String,
    standard: String,
    image_canister_id: Principal,
}

thread_local! {
    static COLLECTIONS: RefCell<HashMap<Principal, Principal>> = RefCell::new(HashMap::new());
}

// #[ic_cdk::update]
// async fn create_collection() -> Principal {
//     // Create the image canister
//     // let image_wasm = include_bytes!("../../image/image.wasm").to_vec();

//     // let canister_settings = CanisterSettings {
//     //     controllers: Some(vec![ic_cdk::id()]),
//     //     compute_allocation: None,
//     //     memory_allocation: None,
//     //     freezing_threshold: None,
//     //     reserved_cycles_limit: None,
//     //     log_visibility: None,
//     //     wasm_memory_limit: None,
//     // };

//     // let create_args = CreateCanisterArgument {
//     //     settings: Some(canister_settings),
//     // };

//     // let (image_canister_id,): (CanisterIdRecord,) = match ic_cdk::api::call::call_with_payment(
//     //     Principal::management_canister(),
//     //     "create_canister",
//     //     (create_args,),
//     //     4_000_000_000_000, // 4 trillion cycles for canister creation
//     // )
//     // .await
//     // {
//     //     Ok(x) => x,
//     //     Err((_, err)) => ic_cdk::trap(&format!("Failed to create image canister: {:?}", err)),
//     // };

//     // let image_canister_id = image_canister_id.canister_id;

//     // // Install the code on the new canister
//     // let install_args = InstallCodeArgument {
//     //     mode: CanisterInstallMode::Install,
//     //     canister_id: image_canister_id,
//     //     wasm_module: image_wasm,
//     //     arg: vec![], // Empty arg for initialization
//     // };

//     // match ic_cdk::api::call::call(
//     //     Principal::management_canister(),
//     //     "install_code",
//     //     (install_args,),
//     // )
//     // .await
//     // {
//     //     Ok(()) => (),
//     //     Err((_, err)) => ic_cdk::trap(&format!("Failed to install image canister code: {:?}", err)),
//     // }

//     // Create the collection canister
//     let collection_wasm = include_bytes!("../../collection/collection.wasm").to_vec();

//     let canister_settings = CanisterSettings {
//         controllers: Some(vec![ic_cdk::id()]),
//         compute_allocation: None,
//         memory_allocation: None,
//         freezing_threshold: None,
//         reserved_cycles_limit: None,
//         log_visibility: None,
//         wasm_memory_limit: None,
//     };

//     let create_args = CreateCanisterArgument {
//         settings: Some(canister_settings),
//     };

//     let (collection_canister_id,): (CanisterIdRecord,) = match ic_cdk::api::call::call_with_payment(
//         Principal::management_canister(),
//         "create_canister",
//         (create_args,),
//         4_000_000_000_000, // 4 trillion cycles for canister creation
//     )
//     .await
//     {
//         Ok(x) => x,
//         Err((_, err)) => ic_cdk::trap(&format!("Failed to create collection canister: {:?}", err)),
//     };

//     let collection_canister_id = collection_canister_id.canister_id;

//     // Install the code on the new canister
//     let install_args = InstallCodeArgument {
//         mode: CanisterInstallMode::Install,
//         canister_id: collection_canister_id,
//         wasm_module: collection_wasm,
//         arg: candid::encode_args((CollectionInitData {
//             owner: Principal::from_text("aaaaa-aa").unwrap(),
//             name: "My Collection".to_string(),
//             collection_size: 1000,
//             chain_name: "IC".to_string(),
//             description: "My NFT Collection".to_string(),
//             standard: "ERC721".to_string(),
//             image_canister_id: Principal::from_text("aaaaa-aa").unwrap(),
//         },))
//         .unwrap(),
//     };

//     match ic_cdk::api::call::call(
//         Principal::management_canister(),
//         "install_code",
//         (install_args,),
//     )
//     .await
//     {
//         Ok(()) => (),
//         Err((_, err)) => ic_cdk::trap(&format!(
//             "Failed to install collection canister code: {:?}",
//             err
//         )),
//     }

//     return collection_canister_id;
// }

#[ic_cdk::query]
fn get_user_collection(user: Principal) -> Option<Principal> {
    COLLECTIONS.with(|collections| collections.borrow().get(&user).cloned())
}

ic_cdk::export_candid!();
