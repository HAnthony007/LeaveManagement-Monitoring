use actix_web::{post, web};
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, EntityTrait, QueryFilter, Set};
use serde::{Deserialize, Serialize};
use sha256::digest;

use crate::utils::{api_response::{self, ApiResponse}, app_state, jwt::encode_jwt};


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

#[derive(Serialize, Deserialize)]
struct LoginModel {
    // n_matricule: String,
    email_empl: String,
    passw_empl: String
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


#[post("/login")]
pub async fn login(
    app_state: web::Data<app_state::AppState>,
    login_json: web::Json<LoginModel>
) -> Result<ApiResponse, ApiResponse> {

    let employe_data = entity::employe::Entity::find()
        .filter(
            Condition::all()
                .add(entity::employe::Column::EmailEmpl.eq(login_json.email_empl.clone()))
                .add(entity::employe::Column::PasswEmpl.eq(digest(&login_json.passw_empl)))
        ).one(&app_state.db).await
        .map_err(|err| ApiResponse::new(500, err.to_string()))?
        .ok_or(ApiResponse::new(404, "User Not found".to_owned()))?;

    let token = encode_jwt(employe_data.email_empl, employe_data.id_empl)
        .map_err(|e| ApiResponse::new(500, e.to_string()))?;

    Ok(api_response::ApiResponse::new(200, format!("User {} logged in. With token: {}", login_json.email_empl, token)))
}