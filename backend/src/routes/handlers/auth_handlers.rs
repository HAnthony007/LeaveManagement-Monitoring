use actix_web::{get, post, web};
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, EntityTrait, QueryFilter, Set};
use serde::{Deserialize, Serialize};
use sha256::digest;

use crate::utils::{
    api_response::{self, ApiResponse},
    app_state,
    jwt::{encode_jwt, Claims}, random::generate_random_id,
};

#[derive(Serialize, Deserialize)]
struct LoginModel {
    // n_matricule: String,
    email_empl: String,
    passw_empl: String,
}

#[derive(Serialize, Deserialize)]
struct UserModel {
    id_empl: String,
    n_matricule: String,
    id_dep: String,
    id_sup_hier: Option<String>,
    nom_empl: String,
    prenom_empl: Option<String>,
    email_empl: String,
    passw_empl: String,
    role: String,
}

#[derive(Serialize, Deserialize)]
struct UserData {
    n_matricule: String,
    id_dep: String,
    nom_empl: String,
    prenom_empl: Option<String>,
    email_empl: String,
    passw_empl: String,
    role: String,
}

#[derive(Serialize, Deserialize)]
struct LoginResponseData {
    user: UserModel,
    token: String,
}


#[get("/me")]
pub async fn me(
    _app_state: web::Data<app_state::AppState>,
    claim_data: Claims,
) -> Result<ApiResponse<UserModel>, ApiResponse<()>> {
    let employe = entity::employe::Entity::find_by_id(claim_data.id)
        .one(&_app_state.db)
        .await
        .map_err(|e| ApiResponse::new(
            500, 
            false,
            e.to_string(),
            None
        ))?
        .ok_or(api_response::ApiResponse::new(
            404,
            false,
            "User not found".to_owned(),
            None
        ))?;
    
    let employe_model = UserModel {
        id_empl: employe.id_empl,
        n_matricule: employe.n_matricule,
        id_dep: employe.id_dep,
        id_sup_hier: employe.id_sup_hier,
        nom_empl: employe.nom_empl,
        prenom_empl: employe.prenom_empl,
        email_empl: employe.email_empl,
        passw_empl: employe.passw_empl,
        role: employe.role,
    };

    Ok(api_response::ApiResponse::new(
        200,
        true,
        "User found".to_string(),
        Some(employe_model),
    ))
}

#[post("/register")]
pub async fn register(
    app_state: web::Data<app_state::AppState>,
    register_json: web::Json<UserData>,
) -> Result<ApiResponse<UserModel>, ApiResponse<()>> {
    // check email
    let existing_email = entity::employe::Entity::find()
        .filter(entity::employe::Column::EmailEmpl.eq(register_json.email_empl.clone()))
        .one(&app_state.db)
        .await
        .map_err(|e| {
            println!("{:?}", e);
            ApiResponse::new(
                500,
                false,
                "Error checking email".to_owned(),
                None
            )
        })?;
    if existing_email.is_some() {
        return Ok(ApiResponse::new(
            200,
            false,
            "Email already exists".to_owned(),
            None
        ));
    }

    // check matricule
    let existing_matricule = entity::employe::Entity::find()
        .filter(entity::employe::Column::NMatricule.eq(register_json.n_matricule.clone()))
        .one(&app_state.db)
        .await
        .map_err(|e| {
            println!("{:?}", e);
            ApiResponse::new(
                500,
                false,
                "Error checking matricule".to_owned(),
                None
            )
        })?;
    if existing_matricule.is_some() {
        return Ok(ApiResponse::new(
            200,
            false,
            "Matricule already exists".to_owned(),
            None
        ));
    }

    let departement = entity::departement::Entity::find()
        .filter(entity::departement::Column::IdDep.eq(&register_json.id_dep))
        .one(&app_state.db)
        .await
        .map_err(|e| {
            println!("{:?}", e);
            ApiResponse::new(
                500,
                false,
                "Error finding departement".to_owned(),
                None
            )
        })?;
    
    let id_sup_hier = departement
        .map(|dep| dep.chef_dep )
        .unwrap_or_default();

    let generate_id = generate_random_id(&register_json.n_matricule);

    let user_model = entity::employe::ActiveModel {
        id_empl: Set(generate_id),
        n_matricule: Set(register_json.n_matricule.clone()),
        id_dep: Set(register_json.id_dep.clone()),
        id_sup_hier: Set(id_sup_hier),
        nom_empl: Set(register_json.nom_empl.clone()),
        prenom_empl: Set(register_json.prenom_empl.clone()),
        email_empl: Set(register_json.email_empl.clone()),
        passw_empl: Set(digest(&register_json.passw_empl)),
        role: Set(register_json.role.to_lowercase().clone()),
        ..Default::default()
    }
    .insert(&app_state.db)
    .await
    .map_err(|e| {
        println!("{:?}", e);
        ApiResponse::new(
            500,
            false,
            "Error registering user".to_owned(),
            None
        )
    })?;

    let user_data = UserModel {
        id_empl: user_model.id_empl,
        n_matricule: user_model.n_matricule,
        id_dep: user_model.id_dep,
        id_sup_hier: user_model.id_sup_hier,
        nom_empl: user_model.nom_empl,
        prenom_empl: user_model.prenom_empl,
        email_empl: user_model.email_empl,
        passw_empl: user_model.passw_empl,
        role: user_model.role,
    };
    
    Ok(ApiResponse::new(
        200,
        true,
        "User registered Successfully".to_owned(),
        Some(user_data),
    ))
}

#[post("/login")]
pub async fn login(
    app_state: web::Data<app_state::AppState>,
    login_json: web::Json<LoginModel>,
) -> Result<ApiResponse<LoginResponseData>, ApiResponse<()>> {
    let employe_data = entity::employe::Entity::find()
        .filter(
            Condition::all()
                .add(entity::employe::Column::EmailEmpl.eq(login_json.email_empl.clone()))
                .add(entity::employe::Column::PasswEmpl.eq(digest(&login_json.passw_empl))),
        )
        .one(&app_state.db)
        .await
        .map_err(|err| ApiResponse::new(
            500,
            false,
            err.to_string(),
            None
        ))?
        .ok_or(ApiResponse::new(
            404,
            false,
            "User Not found".to_owned(),
            None
        ))?;

    let token = encode_jwt(employe_data.email_empl.clone(), employe_data.id_empl.clone())
        .map_err(|e| ApiResponse::new(
            500,
            false,
            e.to_string(),
            None
        ))?;
    
    let user_data = UserModel {
        id_empl: employe_data.id_empl,
        n_matricule: employe_data.n_matricule,
        id_dep: employe_data.id_dep,
        id_sup_hier: employe_data.id_sup_hier,
        nom_empl: employe_data.nom_empl,
        prenom_empl: employe_data.prenom_empl,
        email_empl: employe_data.email_empl,
        passw_empl: employe_data.passw_empl,
        role: employe_data.role,
    };
    
    let response_data = LoginResponseData {
        user: user_data,
        token,
    };

    Ok(api_response::ApiResponse::new(
        200,
        true,
        "Login successful".to_owned(),
        Some(response_data)
    ))
}
