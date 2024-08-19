use std::{error::Error, fmt::Display, time::Duration};

use actix_cors::Cors;
use actix_web::{middleware::Logger, web, App, HttpServer};
use job_scheduler::{Job, JobScheduler};
use migration::{Migrator, MigratorTrait};
use sea_orm::{Database, DatabaseConnection};
use tokio::spawn;
use utils::{app_state::AppState, solde_cron::create_solde_cron};

mod routes;
mod utils;

#[derive(Debug)]
struct MainError {
    message: String,
}

impl Display for MainError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Error: {}", self.message)
    }
}

impl Error for MainError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        None
    }

    fn description(&self) -> &str {
        &self.message
    }

    fn cause(&self) -> Option<&dyn Error> {
        self.source()
    }
}

#[actix_web::main]
async fn main() -> Result<(), MainError> {
    if std::env::var_os("RUST_LOG").is_none() {
        std::env::set_var("RUST_LOG", "actix_web=info");
    }

    dotenv::dotenv().ok();
    env_logger::init();

    let port = (utils::constants::PORT).clone();
    let address = (utils::constants::ADDRESS).clone();
    let database_url = (utils::constants::DATABASE_URL).clone();

    let db: DatabaseConnection =
        Database::connect(database_url)
            .await
            .map_err(|err| MainError {
                message: err.to_string(),
            })?;

    // Mise a jour BD
    Migrator::up(&db, None).await.map_err(|err| MainError {
        message: err.to_string(),
    })?;

    // // Reinitialise la base de donne
    // Migrator::fresh(&db)
    //     .await
    //     .map_err(|err| MainError {
    //         message: err.to_string(),
    //     })?;
    
    let db_clone = db.clone();


    // sched.add(Job::new("*/5 * * * * *".parse().unwrap(), move || {
    //     let app_state = web::Data::new(AppState { db: db_clone.clone() });
    //     create_solde_cron(&app_state);
    //     ()
    // }));

    let app_state = web::Data::new(AppState { db: db.clone() });

    let mut sched = JobScheduler::new();
    sched.add(create_solde_cron(&app_state));

    spawn(async move {
        loop {
            sched.tick();
            tokio::time::sleep(Duration::from_secs(60)).await;
        }
    });
    
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(AppState { db: db.clone() }))
            .wrap(Logger::default())
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
                    .supports_credentials(),
            )
            .configure(routes::test_routes::config)
            .configure(routes::auth_routes::config)
            .configure(routes::employe_routes::config)
            .configure(routes::admin_routes::config)
            .configure(routes::conge_routes::config)
    })
    .bind((address, port))
    .map_err(|err| MainError {
        message: err.to_string(),
    })?
    .run()
    .await
    .map_err(|err| MainError {
        message: err.to_string(),
    })
}
