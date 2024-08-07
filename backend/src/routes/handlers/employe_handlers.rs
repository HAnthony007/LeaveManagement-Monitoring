use actix_web::{
    get,
    web::{self},
};
use sea_orm::EntityTrait;
use serde::{Deserialize, Serialize};

use crate::utils::{
    api_response::{self, ApiResponse},
    app_state,
    jwt::Claims,
};

#[derive(Serialize, Deserialize)]
struct UserModel {
    id_empl: String,
    n_matricule: String,
    id_dep: Option<String>,
    nom_empl: String,
    prenom_empl: Option<String>,
    email_empl: String,
    passw_empl: String,
    role: String,
}


#[get("/all_employe")]
pub async fn all_employe(
    app_state: web::Data<app_state::AppState>,
) -> Result<ApiResponse<Vec<UserModel>>, ApiResponse<()>> {
    let employes = entity::employe::Entity::find()
        .all(&app_state.db)
        .await
        .map_err(|err| ApiResponse::new(
            500, 
            false,
            err.to_string(),
            None
        ))?
        .into_iter()
        .map(|employe| UserModel {
            id_empl: employe.id_empl,
            n_matricule: employe.n_matricule,
            id_dep: employe.id_dep,
            nom_empl: employe.nom_empl,
            prenom_empl: employe.prenom_empl,
            email_empl: employe.email_empl,
            passw_empl: employe.passw_empl,
            role: employe.role,
        })
        .collect::<Vec<UserModel>>();

    Ok(ApiResponse::new(
        200,
        true,
        "All employees fetched".to_string(),
        Some(employes)
    ))
}
