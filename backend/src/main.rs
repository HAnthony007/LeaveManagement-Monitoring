use std::{error::Error, fmt::Display, time::Duration};

use actix_cors::Cors;
use actix_web::{middleware::Logger, web, App, HttpServer};
use migration::{Migrator, MigratorTrait};
use sea_orm::{Database, DatabaseConnection};
use utils::{app_state::AppState, solde_cron::soldes_employe};

use tokio::time::sleep;
use tokio_cron_scheduler::{ Job, JobScheduler };

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

    // Mise à jour BD
    Migrator::up(&db, None).await.map_err(|err| MainError {
        message: err.to_string(),
    })?;

    let app_state = web::Data::new(AppState { db: db.clone() });

    let app_state_clone = app_state.clone();

    let shed = JobScheduler::new().await.unwrap();

    shed.add(
        Job::new("0 0 1 * * *", move |_uuid, _l| {
            let app_state_clone = app_state_clone.clone();
            tokio::spawn(async move {
                if let Err(e) = soldes_employe(&app_state_clone).await {
                    eprintln!("Error lors de incrementation solde employe: {:?}", e);
                }
            });
        })
        .unwrap(),
    )
    .await
    .unwrap();

    tokio::spawn(async move {
        shed.start().await.unwrap();

        loop {
            sleep(Duration::from_secs(60)).await;
        }
    });

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
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

// #[actix_web::main]
// async fn main() -> Result<(), MainError> {
//     if std::env::var_os("RUST_LOG").is_none() {
//         std::env::set_var("RUST_LOG", "actix_web=info");
//     }

//     dotenv::dotenv().ok();
//     env_logger::init();

//     let port = (utils::constants::PORT).clone();
//     let address = (utils::constants::ADDRESS).clone();
//     let database_url = (utils::constants::DATABASE_URL).clone();

//     let db: DatabaseConnection =
//         Database::connect(database_url)
//             .await
//             .map_err(|err| MainError {
//                 message: err.to_string(),
//             })?;

//     // Mise a jour BD
//     Migrator::up(&db, None).await.map_err(|err| MainError {
//         message: err.to_string(),
//     })?;

//     // // Reinitialise la base de donne
//     // Migrator::fresh(&db)
//     //     .await
//     //     .map_err(|err| MainError {
//     //         message: err.to_string(),
//     //     })?;

//     let app_state = web::Data::new(AppState { db: db.clone() });

//     let sched = JobScheduler::new();

//     let job = Job::new_async("0 0 1 * * *", move |_uuid, _l| {
//         let app_state = app_state.clone();
//         Box::pin(async move {
//             match soldes_employe(&app_state).await {
//                 Ok(_) => println!("Solde employe increment successfully"),
//                 Err(e) => eprintln!("Erreur lors de l'incrementation du solde: {}", e),
//             }
//         })
//     })
//     .unwarap();

//     sched.add(job).unwrap();

//     HttpServer::new(move || {
//         App::new()
//             .app_data(web::Data::new(AppState { db: db.clone() }))
//             .wrap(Logger::default())
//             .wrap(
//                 Cors::default()
//                     .allow_any_origin()
//                     .allow_any_method()
//                     .allow_any_header()
//                     .supports_credentials(),
//             )
//             .configure(routes::test_routes::config)
//             .configure(routes::auth_routes::config)
//             .configure(routes::employe_routes::config)
//             .configure(routes::admin_routes::config)
//             .configure(routes::conge_routes::config)
//     })
//     .bind((address, port))
//     .map_err(|err| MainError {
//         message: err.to_string(),
//     })?
//     .run()
//     .await
//     .map_err(|err| MainError {
//         message: err.to_string(),
//     })
// }
