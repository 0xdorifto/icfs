// image_canister.rs

use candid::{CandidType, Deserialize};
use std::cell::RefCell;
use std::collections::HashMap;

thread_local! {
    static IMAGES: RefCell<HashMap<u64, Vec<u8>>> = RefCell::new(HashMap::new());
}

#[ic_cdk::update]
fn store_image(token_id: u64, image_data: Vec<u8>) -> Result<(), String> {
    IMAGES.with(|images| {
        images.borrow_mut().insert(token_id, image_data);
    });
    Ok(())
}

#[ic_cdk::query]
fn get_image(token_id: u64) -> Option<Vec<u8>> {
    IMAGES.with(|images| images.borrow().get(&token_id).cloned())
}

#[derive(CandidType, Deserialize)]
struct HttpRequest {
    url: String,
    method: String,
    body: Vec<u8>,
    headers: Vec<(String, String)>,
}

#[derive(CandidType, Clone)]
struct HttpResponse {
    status_code: u16,
    headers: Vec<(String, String)>,
    body: Vec<u8>,
}

#[ic_cdk::query]
fn http_request(request: HttpRequest) -> HttpResponse {
    let path: Vec<&str> = request.url.split('/').collect();
    if path.len() == 1 {
        if let Ok(token_id) = path[0].parse::<u64>() {
            if let Some(image_data) = get_image(token_id) {
                return HttpResponse {
                    status_code: 200,
                    headers: vec![("Content-Type".to_string(), "image/png".to_string())],
                    body: image_data,
                };
            }
        }
    }
    HttpResponse {
        status_code: 404,
        headers: vec![],
        body: b"Not Found".to_vec(),
    }
}

ic_cdk::export_candid!();
