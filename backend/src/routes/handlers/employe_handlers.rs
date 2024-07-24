use actix_web::{get, web};
use sea_orm::EntityTrait;
use serde::{Deserialize, Serialize};

use crate::utils::{api_response::{self, ApiResponse}, app_state, jwt::Claims};

#[derive(Serialize, Deserialize)]
struct EmployeModel {
    n_matricule: String,
    id_dep: Option<i32>,
    nom_empl: String,
    prenom_empl: Option<String>,
    email_empl: String,
    passw_empl: String,
    role: String
}

#[get("/get_employe")]
pub async fn get_employe(
    _app_state: web::Data<app_state::AppState>,
    claim_data: Claims
) -> Result<ApiResponse, ApiResponse> {
    let employe = entity::employe::Entity::find_by_id(claim_data.id)
        .one(&_app_state.db)
        .await
        .map_err(|e| ApiResponse::new(500, e.to_string()))?
        .ok_or(api_response::ApiResponse::new(404, "User not found".to_owned()))?;
    Ok(api_response::ApiResponse::new(200, format!(" {{ 'NMatricule': '{}', 'email': '{}' }} ", employe.n_matricule, employe.email_empl)))
}

#[get("/all_employe")]
pub async fn all_employe(
    app_state: web::Data<app_state::AppState>,
) -> Result<api_response::ApiResponse, api_response::ApiResponse> {

    let employes = entity::employe::Entity::find()
        .all(&app_state.db)
        .await
        .map_err(|err| api_response::ApiResponse::new(500, err.to_string()))?
        .into_iter()
        .map(|employe| EmployeModel {
            n_matricule: employe.n_matricule,
            id_dep: employe.id_dep,
            nom_empl: employe.nom_empl,
            prenom_empl: employe.prenom_empl,
            email_empl: employe.email_empl,
            passw_empl: employe.passw_empl,
            role: employe.role
        })
        .collect::<Vec<EmployeModel>>();

    let res_str = serde_json::to_string(&employes)
        .map_err(|err| api_response::ApiResponse::new(500, err.to_string()))?;

    Ok(api_response::ApiResponse::new(200, res_str.to_owned()))
}