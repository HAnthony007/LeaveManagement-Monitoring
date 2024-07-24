use actix_web::{body::MessageBody, dev::{ServiceRequest, ServiceResponse}, http::header::AUTHORIZATION, Error, HttpMessage};
use actix_web_lab::middleware::Next;

use crate::utils::{api_response::{self, ApiResponse}, jwt::decode_jwt};


pub async fn check_auth_middleware (
    req: ServiceRequest,
    next: Next<impl MessageBody>
) -> Result<ServiceResponse<impl MessageBody>, Error> {
    let auth = req.headers().get(AUTHORIZATION);

    if auth.is_none() {
        return Err(Error::from(api_response::ApiResponse::new(401, "Unauthorized".to_string())));
    }

    let token = match auth.unwrap().to_str() {
        Ok(t) => t.replace("Bearer ", ""),
        Err(_) => return Err(Error::from(api_response::ApiResponse::new(400, "Invalid Authorization headers".to_string()))),
    };

    let claim = match decode_jwt(token) {
        Ok(c) => c,
        Err(_) => return Err(Error::from(api_response::ApiResponse::new(401, "Invalid Token".to_string()))),
    };

    req.extensions_mut().insert(claim.claims);

    next.call(req).await.map_err(|err| Error::from(ApiResponse::new(500, err.to_string())))
}