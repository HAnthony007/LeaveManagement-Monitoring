use actix_web::{post, web};
use sea_orm::{ActiveModelTrait, Set};
use serde::{Deserialize, Serialize};
use sha256::digest;

use crate::utils::{api_response::ApiResponse, app_state};


#[derive(Serialize, Deserialize)]
struct RegisterModel {
    n_matricule: String,
    id_dep: Option<i32>,
    nom_empl: String,
    prenom_empl: Option<String>,
    email_empl: String,
    passw_empl: String,
    role: String
}

#[post("/register")]
pub async fn register(
    app_state: web::Data<app_state::AppState>,
    register_json: web::Json<RegisterModel>
) -> Result<ApiResponse, ApiResponse> {
    let user_model = entity::employe::ActiveModel {
        n_matricule: Set(register_json.n_matricule.clone()),
        id_dep: Set(register_json.id_dep),
        nom_empl: Set(register_json.nom_empl.clone()),
        prenom_empl: Set(register_json.prenom_empl.clone()),
        email_empl: Set(register_json.email_empl.clone()),
        passw_empl: Set(digest(&register_json.passw_empl)),
        role: Set(register_json.role.clone()),
        ..Default::default()
    }.insert(&app_state.db).await
    .map_err(|e| {
        println!("{:?}", e);
        ApiResponse::new(400, "Error registering user".to_string())
    })?;
    Ok(ApiResponse::new(200, format!("User {} created", user_model.n_matricule)))
}