use actix_web::{get, post, web};
use chrono::{DateTime, Duration, Local, TimeZone, Utc};
use num_traits::cast::ToPrimitive;
use sea_orm::{prelude::Decimal, ActiveModelTrait, EntityTrait, Set};
use serde::{Deserialize, Serialize};

use crate::{
    routes::handlers::employe_handlers::UserInfo,
    utils::{api_response::ApiResponse, app_state, random::generate_random_id},
};

#[derive(Debug, Serialize, Deserialize)]
pub struct CongeWithEmploye {
    pub date_dmd_cong: chrono::DateTime<chrono::Local>,
    pub motif_cong: String,
    pub date_deb_cong: chrono::NaiveDateTime,
    pub date_fin_cong: chrono::NaiveDateTime,
    pub nb_jour_cong: Decimal,
    pub status_cong: String,
    pub date_trait_cong: Option<chrono::DateTime<chrono::Local>>,
    pub employe: Vec<UserInfo>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CongeData {
    pub id_empl: String,
    pub motif_cong: String,
    pub date_deb_cong: DateTime<Utc>,
    pub debut_matin: bool,
    pub nb_jour_cong: Decimal,
}


#[post("/add_conge")]
pub async fn add_conge(
    app_state: web::Data<app_state::AppState>,
    data: web::Json<CongeData>,
) -> Result<ApiResponse<CongeData>, ApiResponse<()>> {

    let date_deb_cong_utc = data.date_deb_cong;
    let nb_jours = data.nb_jour_cong.to_f64().unwrap();
    let days = nb_jours.trunc() as i64;
    let half_day = (nb_jours.fract() * 2.0).round() as i64;

    let mut date_fin_cong = date_deb_cong_utc + Duration::days(days - 1);

    if data.debut_matin {
        date_fin_cong = date_fin_cong + Duration::hours(((12.0 * (half_day as f64 + 1.0)).round()) as i64);
        
    } else {
        date_fin_cong = date_fin_cong + Duration::hours(((12.0 * half_day as f64).round()) as i64) + Duration::hours(18);
    }

    let now = Local::now();

    let id_conge = generate_random_id(&data.id_empl);

    let new_conge = entity::conge::ActiveModel {
        id_cong: Set(id_conge),
        id_empl: Set(data.id_empl.to_owned()),
        date_dmd_cong: Set(now.naive_utc()),
        motif_cong: Set(data.motif_cong.to_owned()),
        date_deb_cong: Set(date_deb_cong_utc.naive_utc()),
        date_fin_cong: Set(date_fin_cong.naive_utc()),
        nb_jour_cong: Set(data.nb_jour_cong),
        status_cong: Set("En attente".to_string()),
        date_trait_cong: Set(None),
    }
    .insert(&app_state.db)
    .await
    .map_err(|err| {
        println!("{:?}", err);
        ApiResponse::new(500, false, err.to_string(), None)
    })?;

    let conge_data = CongeData {
        id_empl: new_conge.id_empl,
        motif_cong: new_conge.motif_cong,
        date_deb_cong: Utc.from_utc_datetime(&new_conge.date_deb_cong),
        debut_matin: data.debut_matin,
        nb_jour_cong: new_conge.nb_jour_cong,
    };

    Ok(ApiResponse::new(
        200,
        true,
        "Conge added successfully".to_string(),
        Some(conge_data),
    ))
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
                date_trait_cong: conge
                    .date_trait_cong
                    .map(|dt| Local.from_local_datetime(&dt).unwrap()),
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
