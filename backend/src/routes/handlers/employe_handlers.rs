use actix_web::{
    get, post, web::{self}
};
use sea_orm::{EntityTrait, Set, ActiveModelTrait};
use serde::{Deserialize, Serialize};

use crate::utils::{
    api_response::ApiResponse,
    app_state,
};


#[derive(Debug, Serialize, Deserialize)]
pub struct UserModel {
    id_empl: String,
    n_matricule: String,
    id_dep: String,
    id_suphier: Option<String>,
    nom_empl: String,
    prenom_empl: Option<String>,
    email_empl: String,
    passw_empl: String,
    role: String,
    status: String,
    departement: Option<DepartementData>,
}


#[derive(Debug, Serialize, Deserialize)]
pub struct DepartementData {
    id_dep: String,
    code_dep: String,
    nom_dep: String,
    chef_dep: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SuperieurData {
    id_empl: String,
    nom_empl: String,
    prenom_empl: Option<String>,
    email_empl: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub  struct UserId {
    id_empl: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateUser {
    n_matricule: String,
    id_dep: String,
    id_sup_hier: Option<String>,
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
        .find_also_related(entity::departement::Entity)
        .all(&app_state.db)
        .await
        .map_err(|err| ApiResponse::new(
            500, 
            false,
            err.to_string(),
            None
        ))?
        .into_iter()
        .map(|(employe, departement) | UserModel {
            id_empl: employe.id_empl,
            n_matricule: employe.n_matricule,
            id_dep: employe.id_dep,
            id_suphier: employe.id_sup_hier,
            nom_empl: employe.nom_empl,
            prenom_empl: employe.prenom_empl,
            email_empl: employe.email_empl,
            passw_empl: employe.passw_empl,
            role: employe.role,
            status: employe.status,
            departement: departement.map(|dep| DepartementData {
                id_dep: dep.id_dep,
                code_dep: dep.code_dep,
                nom_dep: dep.nom_dep,
                chef_dep: dep.chef_dep
            }),
        })
        .collect::<Vec<UserModel>>();

    Ok(ApiResponse::new(
        200,
        true,
        "All employees fetched".to_string(),
        Some(employes)
    ))
}


#[post("/update_employe/{user_id}")]
pub async fn update_employe(
    app_state: web::Data<app_state::AppState>,
    path: web::Path<UserId>,
    employe_json: web::Json<UpdateUser>,
) -> Result<ApiResponse<UserModel>, ApiResponse<()>>{
    let id_empl = path.id_empl.clone();

    let user_model = match entity::employe::Entity::find_by_id(id_empl)
        .one(&app_state.db)
        .await
    {
        Ok(Some(user)) => user,
        Ok(None) => {
            return Ok(ApiResponse::new(
                404,
                false,
                "User not found".to_owned(),
                None 
            ))
        }
        Err(e) => {
            return Ok(ApiResponse::new(
                500,
                false,
                e.to_string(),
                None
            ))
        }
    };

    let mut user_model: entity::employe::ActiveModel = user_model.into();

    user_model.n_matricule = Set(employe_json.n_matricule.clone());
    user_model.nom_empl = Set(employe_json.nom_empl.clone());
    user_model.prenom_empl = Set(employe_json.prenom_empl.clone());
    user_model.email_empl = Set(employe_json.email_empl.clone());
    user_model.passw_empl = Set(employe_json.passw_empl.clone());
    user_model.role = Set(employe_json.role.to_lowercase().clone());

    let updated_user_model = user_model
        .update(&app_state.db)
        .await
        .map_err(|err| ApiResponse::new(
            500, 
            false,
            err.to_string(),
            None
        ))?;

    let user_data = UserModel {
        id_empl: updated_user_model.id_empl,
        n_matricule: updated_user_model.n_matricule,
        id_dep: updated_user_model.id_dep,
        id_suphier: None,
        nom_empl: updated_user_model.nom_empl,
        prenom_empl: updated_user_model.prenom_empl,
        email_empl: updated_user_model.email_empl,
        passw_empl: updated_user_model.passw_empl,
        role: updated_user_model.role,
        status: updated_user_model.status,
        departement: None
    };

    Ok(ApiResponse::new(
        200,
        true,
        "User updated successfully".to_owned(),
        Some(user_data),
    ))

}
