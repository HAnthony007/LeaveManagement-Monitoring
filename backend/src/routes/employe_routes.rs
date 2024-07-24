use actix_web::web;
use actix_web_lab::middleware::from_fn;

use super::{handlers, middleware};


pub fn config(config: &mut web::ServiceConfig) {
    config
        .service(
            web::scope("/secure/employe")
            .wrap(from_fn(middleware::auth_midllewares::check_auth_middleware))
            .service(handlers::employe_handlers::get_employe)
        )
        .service(
            web::scope("/employe")
            .service(handlers::employe_handlers::all_employe)
        );
}