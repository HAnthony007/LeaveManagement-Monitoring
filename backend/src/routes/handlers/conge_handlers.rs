use actix_web::{get, web};
use chrono::{Local, TimeZone};
use sea_orm::{prelude::Decimal, EntityTrait};
use serde::{Deserialize, Serialize};

use crate::{
    routes::handlers::employe_handlers::UserInfo,
    utils::{api_response::ApiResponse, app_state},
};

#[derive(Debug, Serialize, Deserialize)]
pub struct CongeWithEmploye {
    pub date_dmd_cong: chrono::DateTime<chrono::Local>,
    pub motif_cong: String,
    pub date_deb_cong: chrono::NaiveDate,
    pub date_fin_cong: chrono::NaiveDate,
    pub nb_jour_cong: Decimal,
    pub status_cong: String,
    pub date_trait_cong: Option<chrono::DateTime<chrono::Local>>,
    pub employe: Vec<UserInfo>,
}

#[get("/all_conge")]
pub async fn all_conge(
    app_state: web::Data<app_state::AppState>,
) -> Result<ApiResponse<Vec<CongeWithEmploye>>, ApiResponse<()>> {
    let conges = entity::conge::Entity::find()
        .find_with_related(entity::employe::Entity)
        .all(&app_state.db)
        .await
        .map_err(|e| ApiResponse::new(500, false, e.to_string(), None))?
        .into_iter()
        .map(|(conge, employe)| {
            let employe_info: Vec<UserInfo> = employe
                .into_iter()
                .map(|e| UserInfo {
                    n_matricule: e.n_matricule,
                    id_dep: e.id_dep,
                    nom_empl: e.nom_empl,
                    prenom_empl: e.prenom_empl,
                    email_empl: e.email_empl,
                    role: e.role,
                })
                .collect();

            CongeWithEmploye {
                date_dmd_cong: Local.from_local_datetime(&conge.date_dmd_cong).unwrap(),
                motif_cong: conge.motif_cong,
                date_deb_cong: conge.date_deb_cong,
                date_fin_cong: conge.date_fin_cong,
                nb_jour_cong: conge.nb_jour_cong,
                status_cong: conge.status_cong,
                date_trait_cong: conge.date_trait_cong.map(|dt| Local.from_local_datetime(&dt).unwrap()),
                employe: employe_info,
            }
        })
        .collect();
    Ok(ApiResponse::new(
        200,
        true,
        "All conges with employee Information".to_string(),
        Some(conges),
    ))
}

// #[get("/add_conge")]
// pub async fn add_conge(

// ) {
//     // TODO: Implement adding a new conge
// }