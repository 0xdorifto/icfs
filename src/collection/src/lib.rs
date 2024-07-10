use candid::{CandidType, Deserialize};
use ic_cdk;
use serde::Serialize;
use std::cell::RefCell;

#[derive(CandidType, Deserialize, Serialize, Clone)]
struct Attribute {
    trait_type: String,
    value: String,
}

#[derive(CandidType, Deserialize, Serialize, Clone)]
struct Metadata {
    name: String,
    description: String,
    image: String,
    attributes: Vec<Attribute>,
}

#[derive(CandidType, Deserialize, Clone)]
struct CollectionInfo {
    owner: String,
    name: String,
    collection_size: u64,
    chain_name: String,
    description: String,
    standard: String,
}

thread_local! {
    static METADATA_STORE: RefCell<Vec<Metadata>> = RefCell::new(Vec::new());
    static IMAGES: RefCell<Vec<Vec<u8>>> = RefCell::new(Vec::new());
    static COLLECTION_INFO: RefCell<CollectionInfo> = RefCell::new(CollectionInfo {
        owner: String::new(),
        name: String::new(),
        collection_size: 0,
        chain_name: String::new(),
        description: String::new(),
        standard: String::new(),
    });
}

//init
#[ic_cdk::init]
async fn init(info: CollectionInfo) {
    COLLECTION_INFO.with(|ci| *ci.borrow_mut() = info);
}

// modifiers
fn is_owner() -> Result<(), String> {
    // let caller = ic_cdk::caller();
    // COLLECTION_INFO.with(|info| {
    //     if info.borrow().owner == caller {
    //         Ok(())
    //     } else {
    //         Err("Only the owner can perform this action".to_string())
    //     }
    // })

    Ok(())
}

// Collection Info Getters
#[ic_cdk::query]
fn get_owner() -> String {
    COLLECTION_INFO.with(|info| info.borrow().owner.clone())
}

#[ic_cdk::query]
fn get_name() -> String {
    COLLECTION_INFO.with(|info| info.borrow().name.clone())
}

#[ic_cdk::query]
fn get_collection_size() -> u64 {
    COLLECTION_INFO.with(|info| info.borrow().collection_size)
}

#[ic_cdk::query]
fn get_chain_name() -> String {
    COLLECTION_INFO.with(|info| info.borrow().chain_name.clone())
}

#[ic_cdk::query]
fn get_description() -> String {
    COLLECTION_INFO.with(|info| info.borrow().description.clone())
}

#[ic_cdk::query]
fn get_standard() -> String {
    COLLECTION_INFO.with(|info| info.borrow().standard.clone())
}

#[ic_cdk::query]
fn get_all_collection_info() -> CollectionInfo {
    COLLECTION_INFO.with(|info| info.borrow().clone())
}

// Collection Info Setters
#[ic_cdk::update]
fn set_owner(owner: String) -> Result<(), String> {
    is_owner()?;
    COLLECTION_INFO.with(|info| info.borrow_mut().owner = owner);
    Ok(())
}

#[ic_cdk::update]
fn set_name(name: String) -> Result<(), String> {
    is_owner()?;
    COLLECTION_INFO.with(|info| info.borrow_mut().name = name);
    Ok(())
}

#[ic_cdk::update]
fn set_collection_size(size: u64) -> Result<(), String> {
    is_owner()?;
    COLLECTION_INFO.with(|info| info.borrow_mut().collection_size = size);
    Ok(())
}

#[ic_cdk::update]
fn set_chain_name(name: String) -> Result<(), String> {
    is_owner()?;
    COLLECTION_INFO.with(|info| info.borrow_mut().chain_name = name);
    Ok(())
}

#[ic_cdk::update]
fn set_description(desc: String) -> Result<(), String> {
    is_owner()?;
    COLLECTION_INFO.with(|info| info.borrow_mut().description = desc);
    Ok(())
}

#[ic_cdk::update]
fn set_standard(std: String) -> Result<(), String> {
    is_owner()?;
    COLLECTION_INFO.with(|info| info.borrow_mut().standard = std);
    Ok(())
}

#[ic_cdk::update]
fn set_all_collection_info(info: CollectionInfo) -> Result<(), String> {
    is_owner()?;
    COLLECTION_INFO.with(|ci| *ci.borrow_mut() = info);
    Ok(())
}

// main functions
#[ic_cdk::update]
fn store_image(image_data: Vec<u8>) -> Result<u64, String> {
    IMAGES.with(|images| {
        let mut images = images.borrow_mut();
        let new_token_id = images.len() as u64;
        images.push(image_data);
        Ok(new_token_id)
    })
}

#[ic_cdk::query]
fn get_image(token_id: u64) -> Option<Vec<u8>> {
    IMAGES.with(|images| images.borrow().get(token_id as usize).cloned())
}

#[ic_cdk::query]
fn get_metadata(token_id: u64) -> Option<Metadata> {
    METADATA_STORE.with(|store| store.borrow().get(token_id as usize).cloned())
}

#[ic_cdk::update]
fn update_metadata(token_id: u64, new_metadata: Metadata) -> Result<(), String> {
    is_owner()?;

    METADATA_STORE.with(|store| {
        let mut store = store.borrow_mut();
        if token_id as usize >= store.len() {
            return Err("Token ID out of range".to_string());
        }
        store[token_id as usize] = new_metadata;
        Ok(())
    })
}

#[ic_cdk::query]
fn get_all_metadata() -> Vec<(u64, Option<Metadata>)> {
    METADATA_STORE.with(|store| {
        store
            .borrow()
            .iter()
            .enumerate()
            .map(|(index, metadata)| (index as u64, Some(metadata.clone())))
            .collect()
    })
}

#[ic_cdk::update]
fn create_metadata(mut metadata: Metadata) -> Result<u64, String> {
    is_owner()?;

    METADATA_STORE.with(|store| {
        let mut store = store.borrow_mut();
        let new_token_id = store.len() as u64;

        metadata.image = format!(
            "https://{}/{}/image",
            ic_cdk::api::id().to_text(),
            new_token_id
        );

        store.push(metadata);
        Ok(new_token_id)
    })
}

#[ic_cdk::query]
fn http_request(request: HttpRequest) -> HttpResponse {
    let path: Vec<&str> = request.url.split("/").collect();
    ic_cdk::println!("Path :{:#?}", path);
    if path.len() == 2 {
        if let Ok(token_id) = path[1].parse::<u64>() {
            if let Some(metadata) = get_metadata(token_id) {
                HttpResponse {
                    status_code: 200,
                    headers: vec![("Content-Type".to_string(), "application/json".to_string())],
                    body: serde_json::to_vec(&metadata).unwrap(),
                }
            } else {
                not_found()
            }
        } else {
            bad_request()
        }
    } else if path.len() == 3 && path[2] == "image" {
        HttpResponse {
            status_code: 200,
            headers: vec![("Content-Type".to_string(), "application/json".to_string())],
            body: serde_json::to_vec("{}").unwrap(),
        }
    } else {
        not_found()
    }
}

#[derive(CandidType, Deserialize)]
struct HttpRequest {
    url: String,
    method: String,
    body: Vec<u8>,
    headers: Vec<(String, String)>,
}

#[derive(CandidType, Serialize)]
struct HttpResponse {
    status_code: u16,
    headers: Vec<(String, String)>,
    body: Vec<u8>,
}

fn not_found() -> HttpResponse {
    HttpResponse {
        status_code: 404,
        headers: vec![],
        body: b"Not Found".to_vec(),
    }
}

fn bad_request() -> HttpResponse {
    HttpResponse {
        status_code: 400,
        headers: vec![],
        body: b"Bad Request".to_vec(),
    }
}

ic_cdk::export_candid!();
