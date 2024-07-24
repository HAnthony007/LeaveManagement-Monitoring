pub use sea_orm_migration::prelude::*;

mod m20240723_134332_create_etablissement_table;
mod m20240723_142314_create_employe_table;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20240723_134332_create_etablissement_table::Migration),
            Box::new(m20240723_142314_create_employe_table::Migration),
        ]
    }
}
