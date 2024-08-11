use actix_web::{delete, get, post, web};
use sea_orm::{ActiveModelTrait, EntityTrait, ModelTrait, Set};
use serde::{Deserialize, Serialize};

use crate::utils::{api_response::ApiResponse, app_state, random::generate_random_id};

use super::employe_handlers::UserInfo;

#[derive(Serialize, Deserialize)]
struct DepartementModel {
    id_dep: String,
    code_dep: String,
    nom_dep: String,
    chef_dep: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct DepartementInfo {
    pub code_dep: String,
    pub nom_dep: String,
    pub chef_dep: Option<UserInfo>,
}

#[derive(Serialize, Deserialize)]
struct DepartementData {
    code_dep: String,
    nom_dep: String,
    chef_dep: Option<String>,
}

#[derive(Serialize, Deserialize)]
struct DepartementId {
    id_dep: String,
}

#[derive(Serialize, Deserialize)]
struct UserId {
    id_empl: String,
}

#[post("/add_departement")]
pub async fn add_departement(
    app_state: web::Data<app_state::AppState>,
    departement_json: web::Json<DepartementData>,
) -> Result<ApiResponse<DepartementModel>, ApiResponse<()>> {
    let generate_id = generate_random_id(&departement_json.code_dep);
    let dep_model = entity::departement::ActiveModel {
        id_dep: Set(generate_id),
        code_dep: Set(departement_json.code_dep.clone()),
        nom_dep: Set(departement_json.nom_dep.clone()),
        chef_dep: Set(departement_json.chef_dep.clone()),
        ..Default::default()
    }
    .insert(&app_state.db)
    .await
    .map_err(|err| {
        println!("{:?}", err);
        ApiResponse::new(500, false, "Error creating departement".to_owned(), None)
    })?;

    let dep_data = DepartementModel {
        id_dep: dep_model.id_dep,
        code_dep: dep_model.code_dep,
        nom_dep: dep_model.nom_dep,
        chef_dep: dep_model.chef_dep,
    };

    Ok(ApiResponse::new(
        200,
        true,
        "Departement created".to_string(),
        Some(dep_data),
    ))
}

#[get("/all_departement")]
pub async fn all_departement(
    app_state: web::Data<app_state::AppState>,
) -> Result<ApiResponse<Vec<DepartementInfo>>, ApiResponse<()>> {
    let deps = entity::departement::Entity::find()
        .all(&app_state.db)
        .await
        .map_err(|err| ApiResponse::new(500, false, err.to_string(), None))?;

    let departement_models = futures::future::join_all(deps.into_iter().map(|dep| {
        let app_state = app_state.clone();

        async move {
            let chef_dep = match dep.chef_dep {
                Some(chef_dep_id) => entity::employe::Entity::find_by_id(chef_dep_id)
                    .one(&app_state.db)
                    .await
                    .map_err(|err| ApiResponse::new(500, false, err.to_string(), None))?
                    .map(|chef| UserInfo {
                        n_matricule: chef.n_matricule,
                        id_dep: chef.id_dep,
                        nom_empl: chef.nom_empl,
                        prenom_empl: chef.prenom_empl,
                        email_empl: chef.email_empl,
                        role: chef.role,
                    }),
                None => None,
            };
            Ok(DepartementInfo {
                code_dep: dep.code_dep,
                nom_dep: dep.nom_dep,
                chef_dep: chef_dep,
            })
        }
    }))
    .await
    .into_iter()
    .collect::<Result<Vec<_>, _>>()?;

    Ok(ApiResponse::new(
        200,
        true,
        "All departments fetched".to_string(),
        Some(departement_models),
    ))
}

#[post("/update_departement")]
pub async fn update_departement(
    app_state: web::Data<app_state::AppState>,
    departement_json: web::Json<DepartementModel>,
) -> Result<ApiResponse<DepartementModel>, ApiResponse<()>> {
    let dep_model = match entity::departement::Entity::find_by_id(departement_json.id_dep.clone())
        .one(&app_state.db)
        .await
    {
        Ok(Some(dep)) => dep,
        Ok(None) => {
            return Ok(ApiResponse::new(
                404,
                false,
                "Department not found".to_owned(),
                None,
            ))
        }
        Err(e) => return Ok(ApiResponse::new(500, false, e.to_string(), None)),
    };

    let mut dep_model: entity::departement::ActiveModel = dep_model.into();

    dep_model.code_dep = Set(departement_json.code_dep.clone());
    dep_model.nom_dep = Set(departement_json.nom_dep.clone());
    dep_model.chef_dep = Set(departement_json.chef_dep.clone());

    let updated_dep_model = dep_model.update(&app_state.db).await.map_err(|e| {
        println!("{:?}", e);
        ApiResponse::new(500, false, "Error updating department".to_owned(), None)
    })?;

    let dep_data = DepartementModel {
        id_dep: updated_dep_model.id_dep,
        code_dep: updated_dep_model.code_dep,
        nom_dep: updated_dep_model.nom_dep,
        chef_dep: updated_dep_model.chef_dep,
    };
    Ok(ApiResponse::new(
        200,
        true,
        "Department updated successfully".to_owned(),
        Some(dep_data),
    ))
}

#[delete("/delete_departement/{id_dep}")]
pub async fn delete_departement(
    app_state: web::Data<app_state::AppState>,
    path: web::Path<DepartementId>,
) -> Result<ApiResponse<()>, ApiResponse<()>> {
    let id_dep = path.id_dep.clone();

    let dep_model = match entity::departement::Entity::find_by_id(id_dep)
        .one(&app_state.db)
        .await
    {
        Ok(Some(dep)) => dep,
        Ok(None) => {
            return Ok(ApiResponse::new(
                404,
                false,
                "Department not found".to_owned(),
                None,
            ))
        }
        Err(e) => return Ok(ApiResponse::new(500, false, e.to_string(), None)),
    };

    entity::departement::Model::delete(dep_model, &app_state.db)
        .await
        .map_err(|e| ApiResponse::new(500, false, e.to_string(), None))?;
    Ok(ApiResponse::new(
        200,
        true,
        "Department deleted successfully".to_owned(),
        None,
    ))
}
