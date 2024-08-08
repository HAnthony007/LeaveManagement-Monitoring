pub use sea_orm_migration::prelude::*;

mod m20240723_134332_create_departement_table;
mod m20240723_142314_create_employe_table;
mod m20240808_074507_create_foreign_keys;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20240723_134332_create_departement_table::Migration),
            Box::new(m20240723_142314_create_employe_table::Migration),
            Box::new(m20240808_074507_create_foreign_keys::Migration),
        ]
    }
}
