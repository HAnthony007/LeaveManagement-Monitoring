use actix_web::web;
use actix_web_lab::middleware::from_fn;

use super::{handlers, middleware};

pub fn config(config: &mut web::ServiceConfig) {
    config
        .service( web::scope("/conge/secure")
            .wrap(from_fn(middleware::auth_midllewares::check_auth_middleware))
        )
        .service(web::scope("/conge")
            .service(handlers::conge_handlers::all_conge)
        );
}