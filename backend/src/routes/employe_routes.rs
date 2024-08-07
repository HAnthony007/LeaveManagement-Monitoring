use actix_web::web;

use super::handlers;

pub fn config(config: &mut web::ServiceConfig) {
    config
        .service(web::scope("/employe").service(handlers::employe_handlers::all_employe));
}

