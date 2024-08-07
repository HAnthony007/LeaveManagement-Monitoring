use actix_web::{delete, get, post, web};
use sea_orm::{ ActiveModelTrait, EntityTrait, ModelTrait, Set };
use serde::{Deserialize, Serialize};

use crate::utils::{api_response::ApiResponse, app_state};

#[derive(Serialize, Deserialize)]
struct DepartementModel {
    id_dep: String,
    code_dep: String,
    nom_dep: String,
    sup_hier: Option<String>,
}

#[derive(Serialize, Deserialize)]
struct DepartementId {
    id_dep: String,
}

#[post("/add_departement")]
pub async fn add_departement(
    app_state: web::Data<app_state::AppState>,
    departement_json: web::Json<DepartementModel>
) -> Result<ApiResponse<DepartementModel>, ApiResponse<()>> {
    let dep_model = entity::departement::ActiveModel {
        id_dep: Set(departement_json.id_dep.clone()),
        code_dep: Set(departement_json.code_dep.clone()),
        nom_dep: Set(departement_json.nom_dep.clone()),
        sup_hier: Set(departement_json.sup_hier.clone()),
        ..Default::default()
    }
    .insert(&app_state.db)
    .await
    .map_err(|err| {
        println!("{:?}", err);
        ApiResponse::new(
            500, 
            false,
            "Error creating departement".to_owned(),
            None
        )
    })?;

    let dep_data = DepartementModel {
        id_dep: dep_model.id_dep,
        code_dep: dep_model.code_dep,
        nom_dep: dep_model.nom_dep,
        sup_hier: dep_model.sup_hier
    };
    
    Ok(ApiResponse::new(
        200,
        true,
        "Departement created".to_string(),
        Some(dep_data)
    ))
    
}



#[get("/all_departement")]
pub async fn all_departement(
    app_state: web::Data<app_state::AppState>,
) -> Result<ApiResponse<Vec<DepartementModel>>, ApiResponse<()>> {
    let deps = entity::departement::Entity::find()
        .all(&app_state.db)
        .await
        .map_err(|err| ApiResponse::new(
            500,
            false,
            err.to_string(),
            None
        ))?
        .into_iter()
        .map(|dep| DepartementModel {
            id_dep: dep.id_dep,
            code_dep: dep.code_dep,
            nom_dep: dep.nom_dep,
            sup_hier: dep.sup_hier,
        })
        .collect::<Vec<DepartementModel>>();

    Ok(ApiResponse::new(
        200,
        true,
        "All departments fetched".to_string(),
        Some(deps)
    ))
}

#[post("/update_departement")]
pub async  fn update_departement(
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

    let mut dep_model: entity::departement::ActiveModel = dep_model.into();

    dep_model.nom_dep = Set(departement_json.nom_dep.clone());
    dep_model.sup_hier = Set(departement_json.sup_hier.clone());

    let updated_dep_model = dep_model
        .update(&app_state.db)
        .await
        .map_err(|e| {
            println!("{:?}", e);
            ApiResponse::new(500, false, "Error updating department".to_owned(), None)
        })?;
    
    let dep_data = DepartementModel {
        id_dep: updated_dep_model.id_dep,
        code_dep: updated_dep_model.code_dep,
        nom_dep: updated_dep_model.nom_dep,
        sup_hier: updated_dep_model.sup_hier,
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

    entity::departement::Model::delete(dep_model, &app_state.db)
        .await
        .map_err(|e| ApiResponse::new(500, false, e.to_string(), None))?;
    Ok(ApiResponse::new(200, true, "Department deleted successfully".to_owned(), None))
}